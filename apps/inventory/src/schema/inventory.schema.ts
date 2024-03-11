import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { IInventory } from '../interfaces/inventory.interface'
import { Product } from 'apps/product/src/schemas/product.schema'
import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'
import { RetailStore } from 'apps/retail-store/src/schemas/retail-store.schema'

export type InventoryDocument = HydratedDocument<IInventory>

const COLLECTION_NAME = 'inventories'

@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions()
})
export class InventoryModelSchema extends BaseAbstractSchema {
	@Prop({ type: mongoose.Types.ObjectId, required: true, ref: Product.name })
	product: mongoose.Types.ObjectId

	@Prop({ type: mongoose.Types.ObjectId, required: true, ref: RetailStore.name })
	store: mongoose.Types.ObjectId

	@Prop({ type: Number, required: true, min: 1 })
	stock: number

	@Prop({ type: Array, required: true, default: [] })
	reservations: []
}

export const InventorySchema = SchemaFactory.createForClass(InventoryModelSchema)
