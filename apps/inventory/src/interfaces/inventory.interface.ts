import mongoose from 'mongoose'

export declare interface IInventory {
	product: mongoose.Types.ObjectId
	store: mongoose.Types.ObjectId
	stock: number
	reservation: Array<Record<string, any>>
}
