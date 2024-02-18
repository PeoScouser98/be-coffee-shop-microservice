import { Collections } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { IInventory } from '../interfaces/inventory.interface'
import { Product } from 'apps/product/src/schemas/product.schema'
import { BranchStoreModelSchema } from 'apps/branch-store/src/schemas/brach-store.schema'
import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'

export type InventoryDocument = HydratedDocument<IInventory>
@Schema({
	collection: Collections.INVENTORIES,
	...getDefaultSchemaOptions
})
export class InventoryModelSchema extends BaseAbstractSchema {
	@Prop({ type: mongoose.Types.ObjectId, required: true, ref: Product.name })
	product: mongoose.Types.ObjectId

	@Prop({ type: mongoose.Types.ObjectId, required: true, ref: BranchStoreModelSchema.name })
	store: mongoose.Types.ObjectId

	@Prop({ type: Number, required: true, min: 1 })
	stock: number

	@Prop({ type: Array, required: true, default: [] })
	reservations: []
}

export const InventorySchema = SchemaFactory.createForClass(InventoryModelSchema)
