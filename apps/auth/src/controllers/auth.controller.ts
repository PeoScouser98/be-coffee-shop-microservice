import { CurrentUser, JwtGuard, ZodValidationPipe } from '@app/common'
import { ResponseMessage } from '@app/common/decorators/response-message.decorator'
import { AllExceptionsFilter } from '@app/common/exceptions/exception.filter'
import { TransformInterceptor } from '@app/common/interceptors/transform-response.interceptor'
import {
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	UnauthorizedException,
	UseFilters,
	UseGuards,
	UseInterceptors,
	UsePipes
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { isValidObjectId } from 'mongoose'
import {
	RecoverPasswordDTO,
	RecoverPasswordValidator,
	ResetPasswordDTO,
	ResetPasswordValidator
} from '../dto/auth.dto'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { IUser } from '../interfaces/user.interface'
import { AuthService } from '../services/auth.service'
import { UserTokenService } from '../services/user-token.service'
import { UserService } from '../services/user.service'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly userTokenService: UserTokenService,
		private readonly configService: ConfigService
	) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@ResponseMessage('success_messages.auth.logged_in')
	@UseInterceptors(TransformInterceptor)
	@HttpCode(HttpStatus.OK)
	@UseFilters(AllExceptionsFilter)
	async login(@CurrentUser() user: IUser) {
		await this.userTokenService.deleteUserTokenByUserId(user._id.toString())
		const { privateKey, publicKey } = this.authService.generateKeyPair()
		const { accessToken, refreshToken } = await this.authService.generateTokenPair({
			payload: { _id: String(user._id), email: user.email, role: user.role },
			privateKey: privateKey
		})
		await this.userTokenService.upsertUserToken({
			user: String(user._id),
			public_key: publicKey,
			private_key: privateKey,
			refresh_token: refreshToken,
			used_refresh_tokens: []
		})
		console.log(user)
		return { user, accessToken, refreshToken }
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.auth.logged_out')
	@UseInterceptors(TransformInterceptor)
	@UseGuards(JwtGuard)
	@UseFilters(AllExceptionsFilter)
	async logout(@Req() req: Request) {
		const userToken = await this.userTokenService.getUserTokenByUserId(req.cookies.client_id)
		const payload = await this.jwtService.verifyAsync(req.cookies.refresh_token, {
			publicKey: Buffer.from(userToken?.public_key)
		})
		const user = await this.userService.findUserById(payload?._id)
		const result = await this.authService.revokeToken(String(user?._id))
		return { success: result }
	}

	@Get('refresh-token')
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('success_messages.auth.refreshed_token')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	async refreshToken(@Req() req: Request) {
		const clientId = req.cookies.client_id
		const refreshToken = req.cookies.refresh_token
		return await this.authService.refreshToken(clientId, refreshToken)
	}

	@Post('recover-password')
	@HttpCode(HttpStatus.CREATED)
	@ResponseMessage('success_messages.auth.reset_password')
	@UseInterceptors(TransformInterceptor)
	@UsePipes(new ZodValidationPipe(RecoverPasswordValidator))
	@UseFilters(AllExceptionsFilter)
	public async recoverPassword(@Body() payload: RecoverPasswordDTO, @Req() req: Request) {
		const origin = req.headers.origin ?? this.configService.get<string>('CLIENT_ORIGIN')
		return await this.authService.recoverPassword(origin + '/' + req.cookies.lang, payload)
	}

	@Post('reset-password')
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(ResetPasswordValidator))
	@UseFilters(AllExceptionsFilter)
	public async resetPassword(
		@Body() payload: ResetPasswordDTO,
		@Headers('authorization') token: string,
		@Headers('x-client-id') userId: string
	) {
		if (!token) throw new UnauthorizedException('Invalid access token')
		if (!userId || !isValidObjectId(userId)) throw new UnauthorizedException('Invalid credential')
		const accessToken = token.replace('Bearer', '').trim()
		return await this.authService.resetPassword(accessToken, userId, payload.newPassword)
	}

	@Get('current-user')
	@UseGuards(JwtGuard)
	@ResponseMessage('success_messages.ok')
	@UseInterceptors(TransformInterceptor)
	@UseFilters(AllExceptionsFilter)
	async getCurrentUser(@CurrentUser() user) {
		return user
	}
}
