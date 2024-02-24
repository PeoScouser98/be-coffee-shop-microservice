import { BaseAbstractRepository } from '@app/common'
import { Injectable } from '@nestjs/common'
import { Post, PostDocument } from './schemas/post.schema'
import { IPostRepository } from './interfaces/post.repository.interface'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, FilterQuery, PaginateModel, PaginateOptions } from 'mongoose'

@Injectable()
export class PostRepository
	extends BaseAbstractRepository<PostDocument>
	implements IPostRepository
{
	static provide: string = 'POST_REPOSITORY'

	constructor(
		@InjectModel(Post.name) private readonly postModel: PaginateModel<PostDocument>,
		@InjectConnection() connection: Connection
	) {
		super(postModel, connection)
	}

	public async paginate(filterQuery: FilterQuery<PostDocument> = {}, options: PaginateOptions) {
		const data = await this.postModel.paginate(filterQuery, {
			page: options.page,
			limit: options.limit
		})
		return data
	}
}
