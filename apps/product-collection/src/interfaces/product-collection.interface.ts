import { Types } from 'mongoose'

export interface IProductCollection {
	_id: Types.ObjectId
	name: string
	releaseDate: Date
}
