import mongoose, { FilterQuery, ProjectionType, QueryOptions } from 'mongoose'

export declare interface IBaseRepository<T> {
	provide: string
	all: () => Promise<T[]>
	create: (payload: T) => Promise<T>
	findOneById: (id: string | mongoose.Types.ObjectId) => Promise<T>
	find: (
		filter: FilterQuery<T>,
		projection?: ProjectionType<T>,
		opitons?: QueryOptions<T>
	) => Promise<Array<T | Partial<T>>>
	findByIdAndUpdate: (id: string | mongoose.Types.ObjectId, update: Partial<T>) => Promise<T>
	findAndDeleteById: (id: string | mongoose.Types.ObjectId) => Promise<T>
}
