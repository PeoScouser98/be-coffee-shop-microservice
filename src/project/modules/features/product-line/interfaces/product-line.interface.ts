import mongoose from 'mongoose'

export declare interface IProductLine {
	_id: mongoose.Types.ObjectId
	name: string
	slug: string
}
