import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { isValidObjectId } from 'mongoose'
import { UserTokenDTO } from './dto/user-token.dto'
import { UserTokenDocument } from './schemas/user-token.schema'
import { UserTokenRepository } from './user-token.repository'
import { ServiceResponse } from '@/project/common/helpers/http.helper'
import Providers from '@/project/common/constants/provide.constant'

@Injectable()
export class UserTokenService {
	constructor(
		@Inject(Providers.USER_TOKEN_REPOSITORY)
		private readonly userTokenRepository: UserTokenRepository
	) {}
	async upsertUserToken(payload: Partial<UserTokenDTO>) {
		return await this.userTokenRepository.updateOneByUserId(payload.user, payload, {
			new: true,
			upsert: true
		})
	}

	async getUserTokenByUserId(userId: string): Promise<ServiceResponse<UserTokenDocument>> {
		if (!isValidObjectId(userId))
			return new ServiceResponse(null, {
				message: {
					vi: 'User ID không đúng định dạng',
					en: 'User ID is invalid'
				},
				errorCode: HttpStatus.BAD_REQUEST
			})
		const userToken = await this.userTokenRepository.findOneByUserId(userId)
		if (!userToken)
			return new ServiceResponse(null, {
				message: {
					vi: 'Không tìm thấy token của người dùng',
					en: `User's token not found`
				},
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResponse(userToken, null)
	}

	async getUserTokenByRefreshToken(refreshToken): Promise<ServiceResponse<UserTokenDocument>> {
		const userToken = await this.userTokenRepository.findOneByRefreshToken(refreshToken)
		return new ServiceResponse(userToken, null)
	}

	async updateUserTokenByUserId(userId: string, update: { refreshToken: string }) {
		const result = await this.userTokenRepository.updateOneByUserId(
			userId,
			{ $set: { refreshToken: update.refreshToken } },
			{
				$addToSet: {
					usedRefreshTokens: update.refreshToken
				}
			}
		)
		if (!result)
			return new ServiceResponse(null, {
				message: {
					vi: 'Người dùng không tồn tại',
					en: 'User is not found'
				},
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResponse(result, null)
	}

	async deleteUserTokenByUserId(userId: string) {
		const result = await this.userTokenRepository.deleteByUserId(userId)
		return new ServiceResponse(result, null)
	}
}
