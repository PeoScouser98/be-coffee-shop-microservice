import { Connection, FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose'
import { BaseAbstractSchema } from './base.abstract.schema'
import { IBaseRepository } from './base.repository.interface'

export abstract class BaseAbstractRepository<T extends BaseAbstractSchema>
	implements IBaseRepository<T>
{
	provide: string

	constructor(
		private readonly model: Model<T>,
		private readonly connection: Connection
	) {
		this.model = model
		this.connection = connection
	}
	async startTransaction() {
		const session = await this.connection.startSession()
		session.startTransaction()
		return session
	}
	async findAll() {
		return await this.model.find().lean()
	}
	async createOne(payload): Promise<T> {
		return (await new this.model(payload).save()) as T
	}

	async findWithFilter(
		filter: FilterQuery<T> = {},
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>
	) {
		return await this.model.find(filter, projection, options)
	}

	async findOneWithFilter(
		filter: FilterQuery<T> = {},
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>
	) {
		return await this.model.findOne(filter, projection, options)
	}

	async findOneById(id: string | Types.ObjectId) {
		return await this.model.findById(id)
	}

	async updateOneById(id: string | Types.ObjectId, update, options?: QueryOptions): Promise<T> {
		return await this.model
			.findByIdAndUpdate(id, { $set: update }, { new: true, ...options })
			.exec()
	}

	async deleteOneById(id: string | Types.ObjectId): Promise<any> {
		return await this.model.findByIdAndDelete(id).exec()
	}
}
