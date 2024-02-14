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
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as crypto from 'node:crypto'

import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { UserService } from 'apps/user/src/user.service'
import { UserTokenService } from 'apps/user-token/src/user-token.service'
import { AllExceptionsFilter } from '@app/common/exceptions/all-exceptions-filter'
import { ResponseBody } from '@app/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly userTokenService: UserTokenService
	) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard('local'))
	@UseFilters(AllExceptionsFilter)
	async login(@Req() req: Request, @Res() res: Response) {
		const { data: user, error } = await this.authService.verifyUser(req.body)
		if (error) {
			throw new HttpException(error.message, error.errorCode)
		}
		// Delete stored user key tokens of previous signin session if exists
		await this.userTokenService.deleteUserTokenByUserId(user._id.toString())

		// Create new public and private key pair
		const { privateKey, publicKey } = crypto.generateKeyPairSync(
			this.configService.get('crypto.type'),
			this.configService.get('crypto.options')
		)

		// Generate new access and refresh tokens
		const { accessToken, refreshToken } = await this.authService.generateTokenPair({
			payload: { _id: user._id?.toString(), email: user.email },
			privateKey: privateKey
		})

		await this.userTokenService.upsertUserToken({
			user: String(user._id),
			public_key: publicKey,
			private_key: privateKey,
			refresh_token: refreshToken,
			used_refresh_tokens: []
		})

		const response = new ResponseBody({ user, accessToken, refreshToken }, HttpStatus.OK, '')
		return res
			.cookie('client_id', user._id, {
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
			.status(response.statusCode)
			.json(response)
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
			'Đăng xuất thành công'
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
			'Reset phiên đăng nhập thành công'
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
