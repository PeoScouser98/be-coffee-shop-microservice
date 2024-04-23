import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import mongoose, { isValidObjectId } from 'mongoose'
import { UserTokenDTO } from '../dto/user-token.dto'
import { UserTokenRepository } from '../repositories/user-token.repository'
import { UserTokenDocument } from '../schemas/user-token.schema'
import { I18nService } from '@app/i18n'

@Injectable()
export class UserTokenService {
	constructor(
		@Inject(UserTokenRepository.name)
		private readonly userTokenRepository: UserTokenRepository,
		private readonly i18nService: I18nService
	) {}
	async upsertUserToken(payload: Partial<UserTokenDTO>) {
		return await this.userTokenRepository.updateOneByUserId(
			payload.user,
			{ ...payload, user: new mongoose.Types.ObjectId(payload.user) },
			{
				new: true,
				upsert: true
			}
		)
	}

	async getUserTokenByUserId(userId: string): Promise<UserTokenDocument> {
		if (!isValidObjectId(userId)) {
			throw new BadRequestException(this.i18nService.t('error_messages.user.invalid_id'))
		}
		const userToken = await this.userTokenRepository.findOneByUserId(userId)
		if (!userToken) {
			throw new NotFoundException(this.i18nService.t('error_messages.user_token.not_found'))
		}
		return userToken
	}

	async getUserTokenByRefreshToken(refreshToken): Promise<UserTokenDocument> {
		const userToken = await this.userTokenRepository.findOneByRefreshToken(refreshToken)
		return userToken
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
		if (!result) throw new NotFoundException(this.i18nService.t('error_messages.user.not_found'))
		return result
	}

	async deleteUserTokenByUserId(userId: string) {
		return await this.userTokenRepository.deleteByUserId(userId)
	}
}
