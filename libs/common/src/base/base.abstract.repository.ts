import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose'
import { BaseAbstractDocument } from './base.abstract.schema'
import { IBaseRepository } from './base.repository.interface'

export abstract class BaseAbstractRepository<TDocument extends BaseAbstractDocument>
	implements IBaseRepository<TDocument>
{
	constructor(private readonly model: Model<TDocument>) {
		this.model = model
	}
	async findAll() {
		return await this.model.find().lean()
	}
	async createOne(payload): Promise<TDocument> {
		return (await new this.model(payload).save()) as TDocument
	}

	async findWithFilter(
		filter: FilterQuery<TDocument> = {},
		projection?: ProjectionType<TDocument>,
		options?: QueryOptions<TDocument>
	) {
		return await this.model.find(filter, projection, options)
	}

	async findOneWithFilter(
		filter: FilterQuery<TDocument> = {},
		projection?: ProjectionType<TDocument>,
		options?: QueryOptions<TDocument>
	) {
		return await this.model.findOne(filter, projection, options)
	}

	async findOneById(id: string | Types.ObjectId) {
		return await this.model.findById(id)
	}

	async updateOneById(
		id: string | Types.ObjectId,
		update,
		options?: QueryOptions
	): Promise<TDocument> {
		return await this.model
			.findByIdAndUpdate(id, { $set: update }, { new: true, ...options })
			.exec()
	}

	async deleteOneById(id: string | Types.ObjectId): Promise<any> {
		return await this.model.findByIdAndDelete(id).exec()
	}
}
