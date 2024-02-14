import { Collections } from '@app/common'
import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IOrder } from '../interfaces/user-order.interface'
import { BaseAbstractDocument, defaultSchemaOptions } from '@app/common/base/base.abstract.schema'

export type UserOrderDocument = HydratedDocument<IOrder>
@Schema({
	collection: Collections.ORDERS,
	...defaultSchemaOptions
})
export class UserOrderModelSchema extends BaseAbstractDocument {}

export const OrderSchema = SchemaFactory.createForClass(UserOrderModelSchema)
