import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { UserDTO } from '../dto/user.dto'
import { UserRepository } from '../repositories/user.repository'
import { UserDocument } from '../schemas/user.schema'
import { AuthService } from './auth.service'
import { UserTokenService } from './user-token.service'
import { I18nService } from '@app/i18n'

@Injectable()
export class UserService {
	constructor(
		@Inject(UserRepository.name)
		private readonly userRepository: UserRepository,
		private readonly authService: AuthService,
		private readonly i18nService: I18nService,
		private readonly userTokenService: UserTokenService
	) {}

	public async createUser(payload: UserDTO) {
		const existedUser = await this.userRepository.findUserByEmail(payload.email)
		if (existedUser)
			throw new ConflictException(this.i18nService.t('error_messages.user.conflict'))

		const newUser = await this.userRepository.createUser(payload)
		if (!newUser)
			throw new BadRequestException(this.i18nService.t('error_messages.user.registering'))

		const { privateKey, publicKey } = this.authService.generateKeyPair()
		const { accessToken, refreshToken } = await this.authService.generateTokenPair({
			payload: { _id: newUser?._id?.toString(), email: newUser.email, role: newUser.role },
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
		return { user: newUser, accessToken, refreshToken }
	}

	public async findUserById(userId: string): Promise<UserDocument> {
		const user = await this.userRepository.findOneById(userId)
		if (!user) throw new NotFoundException(this.i18nService.t('error_messages.user.not_found'))
		return user
	}
}
