import { LocalizationService, ServiceResult } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY } from '../constants/user.constant'
import { UserDTO } from '../dto/user.dto'
import { UserRepository } from '../repositories/user.repository'
import { UserDocument } from '../schemas/user.schema'
import { AuthService } from './auth.service'
import { UserTokenService } from './user-token.service'

@Injectable()
export class UserService {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: UserRepository,
		private readonly authService: AuthService,
		private readonly localizationService: LocalizationService,
		private readonly userTokenService: UserTokenService
	) {}

	public async createUser(payload: UserDTO) {
		const existedUser = await this.userRepository.findUserByEmail(payload.email)
		if (existedUser)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.user.conflict'),
				errorCode: HttpStatus.CONFLICT
			})

		const { privateKey, publicKey } = this.authService.generateKeyPair()

		const newUser = await this.userRepository.createUser(payload)
		if (!newUser)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.user.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		const { accessToken, refreshToken } = await this.authService.generateTokenPair({
			payload: { _id: newUser?._id?.toString(), email: newUser.email },
			privateKey: privateKey
		})

		const newUserToken = {
			user: newUser._id.toString(),
			public_key: publicKey.toString(),
			private_key: privateKey.toString(),
			refresh_token: refreshToken,
			used_refresh_tokens: [refreshToken]
		}

		await this.userTokenService.upsertUserToken(newUserToken)

		return new ServiceResult({ user: newUser, accessToken, refreshToken }, null)
	}

	public async findUserById(userId: string): Promise<ServiceResult<UserDocument>> {
		const user = await this.userRepository.findOneById(userId)
		if (!user)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.user.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResult(user, null)
	}
}
