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
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class AuthService {
	constructor(
		@Inject(UserTokenRepository.provide)
		private readonly userTokenRepository: UserTokenRepository,
		@Inject(UserRepository.provide)
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly i18nService: I18nService,
		private readonly mailerService: MailerService
	) {}

	public async verifyUser(
		payload: Pick<IUser, 'email' | 'password'>
	): Promise<ServiceResult<UserDocument>> {
		const user = await this.userRepository.findUserByEmail(payload.email)
		if (!user)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.user.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})

		if (!user.authenticate(payload.password))
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.auth.incorrect_password'),
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

	public async changePassword(payload: {
		email: string
		currentPassword: string
		newPassword: string
	}) {
		const user = await this.userRepository.findUserByEmail(payload.email)
		if (!user)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.user.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		if (!user.authenticate(payload.currentPassword))
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.user.incorrect_password'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		user.password = payload.newPassword
		const updatedUser = await user.save()
		return new ServiceResult(updatedUser)
	}

	public async recoverPassword(origin: string, payload) {
		const user = await this.userRepository.findUserByEmail(payload.email)
		if (!user)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.user.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		const { publicKey, privateKey } = this.generateKeyPair()
		const { accessToken, refreshToken } = await this.generateTokenPair({
			payload: { _id: String(user._id), email: user.email },
			privateKey
		})
		await this.userTokenRepository.updateOneByUserId(
			user._id,
			{
				public_key: publicKey,
				private_key: privateKey,
				refresh_token: refreshToken,
				$addToSet: { used_refresh_tokens: refreshToken }
			},
			{ new: true, upsert: true }
		)

		const result = await this.mailerService.sendMail({
			to: user.email,
			subject: 'Ananas - Request to reset your password',
			template: 'reset-password',
			context: {
				url: `${origin}/reset-password?token=${accessToken}&user_id=${user._id}`,
				display_name: user.display_name
			}
		})

		return new ServiceResult({
			accessToken,
			clientId: user._id,
			result: result.response
		})
	}

	public async resetPassword(accessToken: string, userId: string, newPassword: string) {
		const reliableUserToken = await this.userTokenRepository.findOneByUserId(userId)
		if (!reliableUserToken)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.user_token.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		const payload = await this.verifyToken(accessToken, reliableUserToken.public_key)
		const user = await this.userRepository.findUserByEmail(payload.email)
		if (!user)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.user.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		user.password = newPassword
		const updatedUser = await user.save()
		return new ServiceResult(updatedUser)
	}
}
