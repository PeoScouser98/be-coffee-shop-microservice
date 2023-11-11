import { BaseSchema } from 'src/modules/shared/schemas/base.schema';
import { IBaseRepository } from './base.interface.repository';
import mongoose, {
	FilterQuery,
	Model,
	ProjectionType,
	QueryOptions
} from 'mongoose';

export abstract class BaseAbstractRepository<T extends BaseSchema>
	implements IBaseRepository<T>
{
	protected constructor(private readonly model: Model<T>) {
		this.model = model;
	}

	async createOne(payload: T) {
		return await new this.model(payload).save();
	}

	async findWithFilter(
		filter: FilterQuery<T> = {},
		projection?: ProjectionType<T>,
		options?: QueryOptions<T>
	) {
		return await this.model.find(filter, projection, options).exec();
	}

	async findOneById(id: string | mongoose.Types.ObjectId) {
		return await this.model.findById(id).exec();
	}

	async updateOneById(
		id: string | mongoose.Types.ObjectId,
		update: Partial<T>
	): Promise<T> {
		return await this.model.findByIdAndUpdate(id, update).exec();
	}

	async deleteOneById(id: string | mongoose.Types.ObjectId): Promise<T> {
		return await this.model.findByIdAndDelete(id).exec();
	}
}
