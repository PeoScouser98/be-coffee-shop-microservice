import { ServiceResult } from '@app/common'
import { I18nService } from '@app/i18n'
import { MailerService } from '@nestjs-modules/mailer'
import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Algorithm, JwtPayload } from 'jsonwebtoken'
import * as crypto from 'node:crypto'
import { IUser } from '../interfaces/user.interface'
import { UserTokenRepository } from '../repositories/user-token.repository'
import { UserRepository } from '../repositories/user.repository'
import { UserDocument } from '../schemas/user.schema'
import { UserTokenService } from './user-token.service'
import { UserRoles } from '../constants/user.constant'

@Injectable()
export class AuthService {
	constructor(
		@Inject(UserTokenRepository.name)
		private readonly userTokenRepository: UserTokenRepository,
		@Inject(UserRepository.name)
		private readonly userRepository: UserRepository,
		private readonly userTokenService: UserTokenService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly i18nService: I18nService,
		private readonly mailerService: MailerService
	) {}

	async verifyUser(payload: Pick<IUser, 'email' | 'password'>): Promise<UserDocument> {
		const user = await this.userRepository.findUserByEmail(payload.email)
		console.log('user', user)
		if (!user) throw new NotFoundException(this.i18nService.t('error_messages.user.not_found'))
		if (!user.authenticate(payload.password))
			throw new BadRequestException(this.i18nService.t('error_messages.auth.incorrect_password'))
		return user
	}

	async revokeToken(userId: string) {
		const deletedUserToken = await this.userTokenRepository.deleteByUserId(userId)
		if (!deletedUserToken)
			throw new NotFoundException(this.i18nService.t('error_messages.user.not_found'))
		return true
	}

	generateKeyPair() {
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

	async generateTokenPair({
		payload,
		privateKey
	}: {
		payload: { _id: string; email: string; role: UserRoles }
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

	async verifyToken(token: string, publicKey: string): Promise<JwtPayload> {
		return await this.jwtService.verifyAsync(token, {
			publicKey: publicKey,
			algorithms: [this.configService.get<Algorithm>('JWT_ALGORITHM')]
		})
	}

	async changePassword(payload: { email: string; currentPassword: string; newPassword: string }) {
		const user = await this.userRepository.findUserByEmail(payload.email)
		if (!user) throw new NotFoundException(this.i18nService.t('error_messages.user.not_found'))
		if (!user.authenticate(payload.currentPassword))
			throw new BadRequestException(this.i18nService.t('error_messages.auth.incorrect_password'))
		user.password = payload.newPassword
		const updatedUser = await user.save()
		return updatedUser
	}

	async recoverPassword(origin: string, payload) {
		const user = await this.userRepository.findUserByEmail(payload.email)
		if (!user) throw new NotFoundException(this.i18nService.t('error_messages.user.not_found'))
		const { publicKey, privateKey } = this.generateKeyPair()
		const { accessToken, refreshToken } = await this.generateTokenPair({
			payload: { _id: String(user._id), email: user.email, role: user.role },
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

		return {
			accessToken,
			clientId: user._id,
			result: result.response
		}
	}

	async resetPassword(accessToken: string, userId: string, newPassword: string) {
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

		return await user.save()
	}

	async refreshToken(
		clientId: string,
		clientRefreshToken: string
	): Promise<{ accessToken: string; refreshToken: string }> {
		if (!clientId || !clientRefreshToken) throw new BadRequestException()

		const suspectUserToken =
			await this.userTokenService.getUserTokenByRefreshToken(clientRefreshToken)
		if (suspectUserToken) {
			const decodeUser = await this.verifyToken(
				suspectUserToken.refresh_token,
				suspectUserToken.public_key
			)
			await this.userTokenService.deleteUserTokenByUserId(decodeUser?._id?.toString())
			throw new HttpException('Refresh token không còn khả dụng', HttpStatus.FORBIDDEN)
		}

		const reliableUserToken = await this.userTokenService.getUserTokenByUserId(clientId)
		const decodeUser = await this.verifyToken(
			reliableUserToken.refresh_token,
			reliableUserToken.public_key
		)

		// Create new access/refresh tokens pair
		const { accessToken, refreshToken } = await this.generateTokenPair({
			payload: { _id: decodeUser?._id, email: decodeUser?.email, role: decodeUser?.role },
			privateKey: reliableUserToken.private_key
		})

		// Add previous refresh token used to decode to used refresh token list
		await this.userTokenService.updateUserTokenByUserId(decodeUser?._id, {
			refreshToken
		})

		return { accessToken, refreshToken }
	}
}
