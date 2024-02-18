import { ServiceResult } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Algorithm, JwtPayload } from 'jsonwebtoken'
import * as crypto from 'node:crypto'
import { IUser } from '../interfaces/user.interface'
import { UserTokenRepository } from '../repositories/user-token.repository'
import { UserRepository } from '../repositories/user.repository'
import { UserDocument } from '../schemas/user.schema'
import { I18nService } from '@app/i18n'

@Injectable()
export class AuthService {
	constructor(
		@Inject(UserTokenRepository.provide)
		private readonly userTokenRepository: UserTokenRepository,
		@Inject(UserRepository.provide)
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly localizationService: I18nService
	) {}

	public async verifyUser(
		payload: Pick<IUser, 'email' | 'password'>
	): Promise<ServiceResult<UserDocument>> {
		const user = await this.userRepository.findUserByEmail(payload.email)
		if (!user)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.user.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})

		if (!user.authenticate(payload.password))
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.auth.incorrect_password'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResult(user)
	}

	public async revokeToken(userId: string) {
		const deletedUserToken = await this.userTokenRepository.deleteByUserId(userId)
		if (!deletedUserToken)
			return new ServiceResult(null, {
				message: 'Không tìm thấy người dùng',
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResult(true)
	}
	public generateKeyPair() {
		return crypto.generateKeyPairSync('rsa', {
			modulusLength: +this.configService.get('CRYPTO_MODULUS_LENGTH'),
			publicKeyEncoding: {
				type: this.configService.get('CRYPTO_ENCODING_TYPE'),
				format: this.configService.get('CRYPTO_ENCODING_FORMAT')
			},
			privateKeyEncoding: {
				type: this.configService.get('CRYPTO_ENCODING_TYPE'),
				format: this.configService.get('CRYPTO_ENCODING_FORMAT')
			}
		})
	}
	public async generateTokenPair({
		payload,
		privateKey
	}: {
		payload: { _id: string; email: string }
		privateKey: string
	}) {
		const algorithm: Algorithm = this.configService.get<Algorithm>('JWT_ALGORITHM')

		const exprireTime = {
			accessToken: this.configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
			refreshToken: this.configService.get<string>('JWT_REFRESH_TOKEN_EXP')
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

	public async verifyToken(token: string, publicKey: string): Promise<JwtPayload> {
		return await this.jwtService.verifyAsync(token, {
			publicKey: publicKey,
			algorithms: [this.configService.get<Algorithm>('JWT_ALGORITHM')]
		})
	}
}
