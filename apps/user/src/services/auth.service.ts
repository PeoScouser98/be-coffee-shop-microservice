import { ServiceResult, Respositories } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserTokenRepository } from 'apps/auth/src/repositories/user-token.repository'
import { IUser } from 'apps/auth/src/interfaces/user.interface'
import { UserDocument } from 'apps/auth/src/schemas/user.schema'
import { UserRepository } from 'apps/auth/src/repositories/user.repository'
import { Algorithm, JwtPayload } from 'jsonwebtoken'

@Injectable()
export class AuthService {
	constructor(
		@Inject(Respositories.USER_TOKEN)
		private readonly userTokenRepository: UserTokenRepository,
		@Inject(Respositories.USER)
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService // private readonly userTokenService: UserTokenService
	) {}

	async verifyUser(
		payload: Pick<IUser, 'email' | 'password'>
	): Promise<ServiceResult<UserDocument>> {
		const user = await this.userRepository.findUserByEmail(payload.email)
		if (!user)
			return new ServiceResult(null, {
				message: 'Không tìm thấy người dùng',
				errorCode: HttpStatus.NOT_FOUND
			})

		if (!user.authenticate(payload.password))
			return new ServiceResult(null, {
				message: 'Mật khẩu không chính xác',
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResult(user)
	}

	async revokeToken(userId: string) {
		const deletedUserToken = await this.userTokenRepository.deleteByUserId(userId)
		if (!deletedUserToken)
			return new ServiceResult(null, {
				message: 'Không tìm thấy người dùng',
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResult(true)
	}

	async generateTokenPair({
		payload,
		privateKey
	}: {
		payload: { _id: string; email: string }
		privateKey: string
	}) {
		const algorithm: Algorithm = this.configService.get<Algorithm>('jwt.algorithm')

		const exprireTime = {
			accessToken: this.configService.get<string>('jwt.accessTokenExpires'),
			refreshToken: this.configService.get<string>('jwt.refreshTokenExpires')
		}

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.sign(payload, {
				privateKey,
				algorithm,
				expiresIn: exprireTime.accessToken
			}),
			this.jwtService.sign(payload, {
				privateKey,
				algorithm,
				expiresIn: exprireTime.refreshToken
			})
		])

		return { accessToken, refreshToken }
	}

	async verifyToken(token: string, publicKey: string): Promise<JwtPayload> {
		return await this.jwtService.verifyAsync(token, {
			publicKey: publicKey,
			algorithms: [this.configService.get<Algorithm>('jwt.algorithm')]
		})
	}
}
