import mongoose from 'mongoose'
import { NotificationType } from '../constants/notification.constant'

export interface INotification {
	type: NotificationType
	from: string | mongoose.Types.ObjectId
	to: string | mongoose.Types.ObjectId
	content: string
}
