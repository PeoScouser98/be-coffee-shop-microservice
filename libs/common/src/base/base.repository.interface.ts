import mongoose, { FilterQuery, ProjectionType, QueryOptions } from 'mongoose'

export declare interface IBaseRepository<TDocument> {
	createOne?: (payload: TDocument) => Promise<TDocument>

	findOneById?: (id: string | mongoose.Types.ObjectId) => Promise<TDocument>

	findWithFilter?: (
		filter: FilterQuery<TDocument>,
		projection?: ProjectionType<TDocument>,
		opitons?: QueryOptions<TDocument>
	) => Promise<Array<TDocument | Partial<TDocument>>>

	updateOneById?: (
		id: string | mongoose.Types.ObjectId,
		update: Partial<TDocument>
	) => Promise<TDocument>

	deleteOneById?: (id: string | mongoose.Types.ObjectId) => Promise<TDocument>
}
