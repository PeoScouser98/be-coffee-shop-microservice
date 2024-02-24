import { ResponseBody, CurrentUser } from '@app/common'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import {
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Post,
	Req,
	Res,
	UseFilters,
	UseGuards
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Request, Response } from 'express'
import { IUser } from '../interfaces/user.interface'
import { AuthService } from '../services/auth.service'
import { UserTokenService } from '../services/user-token.service'
import { UserService } from '../services/user.service'
import { I18nService } from 'nestjs-i18n'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly i18nService: I18nService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly userTokenService: UserTokenService
	) {}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	async login(@CurrentUser() user: IUser, @Res() res: Response) {
		// Delete stored user key tokens of previous signin session if exists
		await this.userTokenService.deleteUserTokenByUserId(String(user?._id))

		// Create new public and private key pair
		const { privateKey, publicKey } = this.authService.generateKeyPair()

		// Generate new access and refresh tokens
		const { accessToken, refreshToken } = await this.authService.generateTokenPair({
			payload: { _id: String(user?._id), email: user?.email },
			privateKey: privateKey
		})

		await this.userTokenService.upsertUserToken({
			user: String(user?._id),
			public_key: publicKey,
			private_key: privateKey,
			refresh_token: refreshToken,
			used_refresh_tokens: []
		})
		const responseBody = new ResponseBody(
			{ user, accessToken, refreshToken },
			HttpStatus.OK,
			this.i18nService.t('success_messages.auth.logged_in')
		)
		return res
			.cookie('client_id', user?._id, {
				maxAge: 60 * 60 * 24 * 7,
				httpOnly: true,
				secure: true,
				sameSite: 'none'
			})
			.cookie('access_token', accessToken, {
				maxAge: 60 * 60 * 24 * 7,
				httpOnly: true,
				secure: true,
				sameSite: 'none'
			})
			.cookie('refresh_token', refreshToken, {
				maxAge: 60 * 60 * 24 * 30,
				httpOnly: true,
				secure: true,
				sameSite: 'none'
			})
			.json(responseBody)
	}

	@Post('logout')
	@UseFilters(AllExceptionsFilter)
	async signout(@Req() req: Request, @Res() res: Response) {
		const { data: userToken, error: getTokenError } =
			await this.userTokenService.getUserTokenByUserId(req.cookies.client_id)

		if (!userToken) {
			throw new HttpException(getTokenError.message, getTokenError.errorCode)
		}

		const payload = await this.jwtService.verifyAsync(req.cookies.refresh_token, {
			publicKey: Buffer.from(userToken?.public_key)
		})
		const { data: user, error: findUserError } = await this.userService.findUserById(payload?._id)
		// Check if user exists or not
		if (findUserError) throw new HttpException(findUserError.message, findUserError.errorCode)

		const { data: revokeTokenResult, error: revokeTokenError } =
			await this.authService.revokeToken(user?._id?.toString())

		if (revokeTokenError) return res.status(revokeTokenError.errorCode).json(revokeTokenError)
		const response = new ResponseBody(
			{
				success: revokeTokenResult,
				signoutAt: new Date().toLocaleDateString()
			},
			HttpStatus.OK,
			this.i18nService.t('success_messages.auth.logged_out')
		)
		return res.status(response.statusCode).json(response)
	}

	@Get('refresh-token')
	@UseFilters(AllExceptionsFilter)
	async refreshToken(@Req() req: Request, @Res() res: Response) {
		/**
		 * Check if refresh token is used or not
		 * If refresh token used -> delete current user token and throw forbidden error
		 */
		const { data: suspectUserToken } = await this.userTokenService.getUserTokenByRefreshToken(
			req.cookies.refresh_token
		)
		if (suspectUserToken) {
			const decodeUser = await this.authService.verifyToken(
				suspectUserToken.refresh_token,
				suspectUserToken.public_key
			)
			await this.userTokenService.deleteUserTokenByUserId(decodeUser?._id?.toString())
			throw new HttpException('Refresh token không còn khả dụng', HttpStatus.FORBIDDEN)
		}

		const { data: reliableUserToken } = await this.userTokenService.getUserTokenByUserId(
			req.cookies.client_id
		)
		const decodeUser = await this.authService.verifyToken(
			reliableUserToken.refresh_token,
			reliableUserToken.public_key
		)

		// Create new access/refresh tokens pair
		const { accessToken, refreshToken } = await this.authService.generateTokenPair({
			payload: { _id: decodeUser?._id, email: decodeUser?.email },
			privateKey: reliableUserToken.private_key
		})

		// Add previous refresh token used to decode to used refresh token list
		await this.userTokenService.updateUserTokenByUserId(decodeUser?._id, {
			refreshToken
		})

		const response = new ResponseBody(
			{ accessToken, refreshToken },
			HttpStatus.OK,
			this.i18nService.t('success_messages.auth.refreshed_token')
		)
		return res
			.cookie('access_token', accessToken, {
				maxAge: 60 * 60 * 24 * 7,
				httpOnly: true,
				secure: true,
				sameSite: 'none'
			})
			.cookie('refresh_token', refreshToken, {
				maxAge: 60 * 60 * 24 * 30,
				httpOnly: true,
				secure: true,
				sameSite: 'none'
			})
			.status(response.statusCode)
			.json(response)
	}
}
