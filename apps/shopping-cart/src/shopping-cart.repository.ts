import { BaseAbstractRepository } from '@app/common'
import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import mongoose, { Connection, Model } from 'mongoose'
import { ShoppingCartStatus } from './constants/shopping-cart.constant'
import { ICartItem } from './interfaces/shopping-cart.interface'
import { IShoppingCartRepository } from './interfaces/shopping-cart.repository.interface'
import { ShoppingCartDocument, ShoppingCartModelSchema } from './schemas/shopping-cart.schema'

@Injectable()
export class ShoppingCartRepository
	extends BaseAbstractRepository<ShoppingCartDocument>
	implements IShoppingCartRepository
{
	static provide: string = 'USER_CART_REPOSITORY' as const

	constructor(
		@InjectModel(ShoppingCartModelSchema.name)
		private readonly shoppingCartModel: Model<ShoppingCartDocument>,
		@InjectConnection() connection: Connection
	) {
		super(shoppingCartModel, connection)
	}

	public async addToCart(credential: string, payload: ICartItem) {
		return await this.shoppingCartModel.findOneAndUpdate(
			{
				$and: [
					{ $or: [{ user: credential }, { session_id: credential }] },
					{ status: ShoppingCartStatus.ACTIVE }
				]
			},
			{
				$addToSet: { items: payload },
				$inc: { items_count: payload.quantity }
			},
			{ new: true }
		)
	}
	public async findOneByUser(user: string) {
		return await this.shoppingCartModel.findOne({
			user: new mongoose.Types.ObjectId(user),
			status: ShoppingCartStatus.ACTIVE
		})
	}

	public async updateCartItemQuantity(
		credential: string,
		productId: mongoose.Types.ObjectId,
		quantity: number
	) {
		const result = await this.shoppingCartModel.findOneAndUpdate(
			{
				$or: [{ user: credential }, { session_id: credential }],
				'items.product_id': productId
			},
			{ $inc: { 'items.$.quantity': quantity, items_count: quantity } },
			{ new: true }
		)
		return result
	}

	public async deleteCartItem(credential: string, productId: mongoose.Types.ObjectId) {
		return await this.shoppingCartModel.findOneAndUpdate(
			{ $or: [{ user: credential }, { session_id: credential }], 'items.product_id': productId },
			{ $pull: { items: { product_id: productId } } },
			{ new: true }
		)
	}

	public async deleteCartByUserId(uid: string) {
		return await this.shoppingCartModel.deleteOne({ $or: [{ user: uid }, { sessionId: uid }] })
	}
}
