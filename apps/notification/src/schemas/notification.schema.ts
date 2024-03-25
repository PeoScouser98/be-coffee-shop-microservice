import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { NotificationType } from '../constants/notification.constant'
import mongoose from 'mongoose'
import { User } from 'apps/auth/src/schemas/user.schema'
import { INotification } from '../interfaces/notification.interface'

const COLLECTION_NAME = 'notifications'

@Schema({ collection: COLLECTION_NAME, ...getDefaultSchemaOptions() })
export class Notifiction extends BaseAbstractSchema {
	@Prop({
		type: String,
		enum: NotificationType,
		required: true
	})
	type: NotificationType

	@Prop({
		type: mongoose.Types.ObjectId,
		ref: User.name,
		required: true
	})
	from: mongoose.Types.ObjectId

	@Prop({
		type: mongoose.Types.ObjectId,
		ref: User.name,
		required: true
	})
	to: mongoose.Types.ObjectId

	@Prop({
		type: String,
		required: true
	})
	content: string
}

export type NotificationDocument = mongoose.HydratedDocument<INotification>

export const NotificationSchema = SchemaFactory.createForClass(Notification)
