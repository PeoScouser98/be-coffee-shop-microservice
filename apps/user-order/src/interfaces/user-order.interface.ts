import mongoose from 'mongoose'

export interface IOrder {
	created_by: mongoose.Types.ObjectId
}
