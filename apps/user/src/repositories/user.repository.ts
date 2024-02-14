import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { UserDTO } from '../dto/user.dto'
import { IUserRepository } from '../interfaces/user.repository.interface'
import { UserModelSchema, UserDocument } from '../schemas/user.schema'
import { BaseAbstractRepository } from '@app/common/base/base.abstract.repository'

@Injectable()
export class UserRepository
	extends BaseAbstractRepository<UserDocument>
	implements IUserRepository
{
	constructor(@InjectModel(UserModelSchema.name) private readonly userModel: Model<UserDocument>) {
		super(userModel)
	}

	async findUserByEmail(email: string): Promise<UserDocument> {
		return await this.userModel.findOne({ email: email })
	}

	async createUser(payload: UserDTO): Promise<UserDocument> {
		return await new this.userModel(payload).save()
	}
}
