import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserCartStatus } from './constants/user-cart.constant'
import { ICartItem } from './interfaces/user-cart.interface'
import { UserCartModelSchema, UserCartDocument } from './schemas/user-cart.schema'
import { BaseAbstractRepository, IBaseRepository } from '@app/common'

@Injectable()
export class UserCartRepository
	extends BaseAbstractRepository<UserCartDocument>
	implements IBaseRepository<UserCartDocument>
{
	constructor(
		@InjectModel(UserCartModelSchema.name) private readonly userCartModel: Model<UserCartDocument>
	) {
		super(userCartModel)
	}

	public async upsertCartItemByUser(user: string, product: ICartItem) {
		return await this.userCartModel.findOneAndUpdate(
			{ created_by: user, status: UserCartStatus.ACTIVE },
			{
				$addToSet: { items: product }
			},
			{ upsert: true, new: true }
		)
	}
	public async findOneByUser(user: string) {
		return await this.userCartModel.findOne({ created_by: user })
	}

	public async updateCartItemQuantity(user: string, productId: string, quantity: number) {
		return await this.userCartModel.findOneAndUpdate(
			{ created_by: user, 'items._id': productId },
			{ 'items.$.quantity': quantity },
			{ new: true }
		)
	}

	public async deleteCartItem(user: string, productId: string) {
		return await this.userCartModel.findOneAndUpdate(
			{
				created_by: user,
				'items._id': productId
			},
			{
				$pull: { 'items._id': productId }
			},
			{
				new: true
			}
		)
	}
}
