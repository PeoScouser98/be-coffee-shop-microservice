import { ServiceResponse } from '@/project/common/helpers/http.helper'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'node:crypto'
import { AuthService } from '../auth/auth.service'
import { UserTokenDTO } from '../user-token/dto/user-token.dto'
import { UserTokenService } from '../user-token/user-token.service'
import { IUser } from './interfaces/user.interface'
import { UserDocument } from './schemas/user.schema'
import { UserRepository } from './user.repository'
import Providers from '@/project/common/constants/provide.constant'

@Injectable()
export class UserService {
	constructor(
		@Inject(Providers.USER_REPOSITORY)
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
		private readonly userTokenService: UserTokenService
	) {}

	async createUser(payload: Omit<IUser, '_id'>) {
		const existedUser = await this.userRepository.findUserByEmail(payload.email)
		if (existedUser)
			return new ServiceResponse(null, {
				message: {
					vi: 'Người dùng đã tồn tại',
					en: 'User already existed'
				},
				errorCode: HttpStatus.CONFLICT
			})

		const { privateKey, publicKey } = crypto.generateKeyPairSync(
			this.configService.get('crypto.type'),
			this.configService.get('crypto.options')
		)

		const newUser = await this.userRepository.createUser(payload)
		if (!newUser)
			return new ServiceResponse(null, {
				message: {
					vi: 'Không tạo được user',
					en: 'Failed to create new user'
				},
				errorCode: HttpStatus.BAD_REQUEST
			})

		const { accessToken, refreshToken } = await this.authService.generateTokenPair({
			payload: { _id: newUser?._id?.toString(), email: newUser.email },
			privateKey: privateKey
		})

		const newUserToken = {
			user: newUser._id,
			publicKey: publicKey.toString(),
			privateKey: privateKey.toString(),
			refreshToken: refreshToken,
			usedRefreshTokens: [refreshToken]
		}

		await this.userTokenService.upsertUserToken(newUserToken as Partial<UserTokenDTO>)

		return new ServiceResponse({ user: newUser, accessToken, refreshToken }, null)
	}

	async findUserById(userId: string): Promise<ServiceResponse<UserDocument>> {
		const user = await this.userRepository.findOneById(userId)
		if (!user)
			return new ServiceResponse(null, {
				message: {
					vi: 'Không tìm thấy người dùng',
					en: 'User is not found'
				},
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResponse(user, null)
	}
}
