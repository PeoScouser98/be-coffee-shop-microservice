import { Collections } from '@app/common'
import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IOrder } from '../interfaces/user-order.interface'
import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common/base/base.abstract.schema'

export type UserOrderDocument = HydratedDocument<IOrder>
@Schema({
	collection: Collections.ORDERS,
	...getDefaultSchemaOptions
})
export class UserOrderModelSchema extends BaseAbstractSchema {}

export const OrderSchema = SchemaFactory.createForClass(UserOrderModelSchema)
