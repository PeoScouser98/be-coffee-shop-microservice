import { BaseAbstractRepository } from '@app/common'
import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { ShoppingCartStatus } from './constants/shopping-cart.constant'
import { ICartItem } from './interfaces/shopping-cart.interface'
import { IShoppingCartRepository } from './interfaces/shopping-cart.repository.interface'
import { ShoppingCartDocument, UserCartModelSchema } from './schemas/shopping-cart.schema'

@Injectable()
export class ShoppingCartRepository
	extends BaseAbstractRepository<ShoppingCartDocument>
	implements IShoppingCartRepository
{
	static provide: string = 'USER_CART_REPOSITORY' as const

	constructor(
		@InjectModel(UserCartModelSchema.name)
		private readonly shoppingCartModel: Model<ShoppingCartDocument>,
		@InjectConnection() connection: Connection
	) {
		super(shoppingCartModel, connection)
	}

	public async upsertCartItemByUser(user: string, product: ICartItem) {
		return await this.shoppingCartModel.findOneAndUpdate(
			{ created_by: user, status: ShoppingCartStatus.ACTIVE },
			{
				$addToSet: { items: product }
			},
			{ upsert: true, new: true }
		)
	}
	public async findOneByUser(user: string) {
		return await this.shoppingCartModel.findOne({ created_by: user })
	}

	public async updateCartItemQuantity(uid: string, productId: string, quantity: number) {
		return await this.shoppingCartModel.findOneAndUpdate(
			{ created_by: uid, 'items._id': productId },
			{ 'items.$.quantity': quantity },
			{ new: true }
		)
	}

	public async deleteCartItem(user: string, productId: string) {
		return await this.shoppingCartModel.findOneAndUpdate(
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

	public async deleteCartByUserId(uid: string) {
		return await this.shoppingCartModel.deleteOne({ $or: [{ user: uid }, { sessionId: uid }] })
	}
}
