import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import mongoose, { Connection, Model, QueryOptions } from 'mongoose'
import { UserToken, UserTokenDocument } from '../schemas/user-token.schema'
import { BaseAbstractRepository } from '@app/common'
import { IUserTokenRepository } from '../interfaces/user-token.repository.interface'

@Injectable()
export class UserTokenRepository
	extends BaseAbstractRepository<UserTokenDocument>
	implements IUserTokenRepository
{
	static provide: string = 'USER_TOKEN_REPOSITORY' as const

	constructor(
		@InjectModel(UserToken.name)
		private readonly userTokenModel: Model<UserTokenDocument>,
		@InjectConnection() connection: Connection
	) {
		super(userTokenModel, connection)
	}

	async findOneByUserId(userId: string): Promise<UserTokenDocument> {
		return await this.userTokenModel.findOne({ user: new mongoose.Types.ObjectId(userId) })
	}

	async findOneByRefreshToken(refreshToken: string): Promise<UserTokenDocument> {
		const userToken = await this.userTokenModel
			.findOne({
				used_refresh_tokens: refreshToken
			})
			.lean()
		return userToken
	}

	async deleteByUserId(userId: string) {
		return await this.userTokenModel.findOneAndDelete({
			user: new mongoose.Types.ObjectId(userId)
		})
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
