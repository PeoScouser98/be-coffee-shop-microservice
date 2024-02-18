import { ServiceResult } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { isValidObjectId } from 'mongoose'
import { UserTokenDTO } from '../dto/user-token.dto'
import { UserTokenRepository } from '../repositories/user-token.repository'
import { UserTokenDocument } from '../schemas/user-token.schema'
import { I18nService } from '@app/i18n'

@Injectable()
export class UserTokenService {
	constructor(
		@Inject(UserTokenRepository.provide)
		private readonly userTokenRepository: UserTokenRepository,
		private readonly localizationService: I18nService
	) {}
	async upsertUserToken(payload: Partial<UserTokenDTO>) {
		return await this.userTokenRepository.updateOneByUserId(payload.user, payload, {
			new: true,
			upsert: true
		})
	}

	async getUserTokenByUserId(userId: string): Promise<ServiceResult<UserTokenDocument>> {
		if (!isValidObjectId(userId))
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.user.invalid_id'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		const userToken = await this.userTokenRepository.findOneByUserId(userId)
		if (!userToken)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.user_token.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResult(userToken, null)
	}

	async getUserTokenByRefreshToken(refreshToken): Promise<ServiceResult<UserTokenDocument>> {
		const userToken = await this.userTokenRepository.findOneByRefreshToken(refreshToken)
		return new ServiceResult(userToken, null)
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
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.user.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResult(result, null)
	}

	async deleteUserTokenByUserId(userId: string) {
		const result = await this.userTokenRepository.deleteByUserId(userId)
		return new ServiceResult(result, null)
	}
}
