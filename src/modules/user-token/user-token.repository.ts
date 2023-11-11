import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseAbstractRepository } from '../shared/repositories/base.abstract.repository';
import { IUserTokenRepository } from './interfaces/user-token.repository.interface';
import { UserToken, UserTokenDocument } from './schemas/user-token.schema';

@Injectable()
export class UserTokenRepository
	extends BaseAbstractRepository<UserTokenDocument>
	implements IUserTokenRepository
{
	constructor(
		@InjectModel(UserToken.name)
		private readonly userTokenModel: Model<UserTokenDocument>
	) {
		super(userTokenModel);
	}
	async findOneByUserId(userId: string) {
		return await this.userTokenModel.findOne({ user: userId });
	}
	async deleteByUserId(userId: string) {
		return await this.userTokenModel.findOneAndDelete({ user: userId });
	}
	async updateOneByUserId(userId: string) {
		return await this.userTokenModel.findOneAndUpdate({ user: userId });
	}
}
