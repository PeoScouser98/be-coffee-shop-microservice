import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model, QueryOptions } from 'mongoose'
import { UserToken, UserTokenDocument } from './schemas/user-token.schema'
import { BaseAbstractRepository } from '../../base/repositories/base.abstract.repository'
import { IUserTokenRepository } from './interfaces/user-token.repository.interface'

@Injectable()
export class UserTokenRepository
	extends BaseAbstractRepository<UserTokenDocument>
	implements IUserTokenRepository
{
	constructor(
		@InjectModel(UserToken.name)
		private readonly userTokenModel: Model<UserTokenDocument>
	) {
		super(userTokenModel)
	}

	async findOneByUserId(userId: string): Promise<UserTokenDocument> {
		const userToken = await this.userTokenModel
			.findOne({ user: new mongoose.Types.ObjectId(userId) })
			.lean()
		return userToken
	}

	async findOneByRefreshToken(refreshToken: string): Promise<UserTokenDocument> {
		const userToken = await this.userTokenModel
			.findOne({
				usedRefreshTokens: refreshToken
			})
			.lean()
		return userToken
	}

	async deleteByUserId(userId: string) {
		return await this.userTokenModel.deleteOne({ user: userId }).exec()
	}

	async updateOneByUserId(
		userId: string | mongoose.Types.ObjectId,
		update: mongoose.UpdateQuery<Partial<UserTokenDocument>>,
		options?: QueryOptions<UserTokenDocument>
	) {
		// return await this.userTokenModel.findOneAndUpdate({ user: userId }, payload, options).lean()
		return await this.userTokenModel.findOneAndUpdate({ user: userId }, update, options).exec()
	}
}
