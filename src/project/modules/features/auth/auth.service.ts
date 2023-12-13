import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Algorithm, JwtPayload } from 'jsonwebtoken'
import { UserDTO } from '../user/dto/user.dto'
import { UserDocument } from '../user/schemas/user.schema'
import { UserTokenRepository } from './../user-token/user-token.repository'
import { UserRepository } from './../user/user.repository'
import { ServiceResponse } from '@/project/common/helpers/http.helper'
import Providers from '@/project/common/constants/provide.constant'

@Injectable()
export class AuthService {
	constructor(
		@Inject(Providers.USER_TOKEN_REPOSITORY)
		private readonly userTokenRepository: UserTokenRepository,
		@Inject(Providers.USER_REPOSITORY)
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService // private readonly userTokenService: UserTokenService
	) {}

	async verifyUser(
		payload: Pick<UserDTO, 'email' | 'password'>
	): Promise<ServiceResponse<UserDocument>> {
		const user = await this.userRepository.findUserByEmail(payload.email)
		if (!user)
			return new ServiceResponse(null, {
				message: {
					vi: 'Không tìm thấy người dùng',
					en: 'User is not found'
				},
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResponse<UserDocument>(user)
	}

	async revokeToken(userId: string) {
		const deletedUserToken = await this.userTokenRepository.deleteByUserId(userId)
		if (!deletedUserToken)
			return new ServiceResponse(null, {
				message: {
					vi: 'Không tìm thấy người dùng',
					en: 'User is not found'
				},
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResponse(true)
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
