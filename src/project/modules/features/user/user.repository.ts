import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDTO } from './dto/user.dto'
import { IUserRepository } from './interfaces/user.repository.interface'
import { User, UserDocument } from './schemas/user.schema'
import { BaseAbstractRepository } from '../../base/repositories/base.abstract.repository'

@Injectable()
export class UserRepository
	extends BaseAbstractRepository<UserDocument>
	implements IUserRepository
{
	constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
		super(userModel)
	}

	async findUserByEmail(email: string): Promise<UserDocument> {
		return await this.userModel.findOne({ email: email }).lean()
	}

	async createUser(payload: Omit<UserDTO, '_id'>): Promise<UserDocument> {
		return await new this.userModel(payload).save()
	}
}
