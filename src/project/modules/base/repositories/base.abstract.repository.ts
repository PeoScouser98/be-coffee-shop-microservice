import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose'
import { IBaseRepository } from './base.interface.repository'
import { BaseSchema } from '../schemas/base.schema'

export abstract class BaseAbstractRepository<T extends BaseSchema> implements IBaseRepository<T> {
	protected constructor(private readonly model: Model<T>) {
		this.model = model
	}
	async findAll() {
		return await this.model.find().lean()
	}
	async createOne(payload): Promise<T> {
		return (await new this.model(payload).save()) as T
	}

	async findWithFilterQuery(
		filter: FilterQuery<T> = {},
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>
	) {
		return await this.model.find(filter, projection, options).exec()
	}

	async findOneById(id: string | Types.ObjectId) {
		return await this.model.findById(id).exec()
	}

	async updateOneById(id: string | Types.ObjectId, update: Partial<T>): Promise<T> {
		return await this.model.findByIdAndUpdate(id, update).exec()
	}

	async deleteOneById(id: string | Types.ObjectId): Promise<T> {
		return await this.model.findByIdAndDelete(id).exec()
	}
}
