import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { IPost } from '../interfaces/post.interface'
import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'
import { User } from 'apps/auth/src/schemas/user.schema'

export type PostDocument = HydratedDocument<IPost>

const COLLECTION_NAME = 'posts'

@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions()
})
export class Post extends BaseAbstractSchema {
	@Prop({
		type: mongoose.Types.ObjectId,
		required: true,
		ref: User.name,
		autopopulate: { select: '_id display_name picture' }
	})
	author: mongoose.Types.ObjectId

	@Prop({
		type: String,
		required: true,
		maxLength: 60
	})
	title: string

	@Prop({
		type: String,
		required: true
	})
	content: string

	@Prop({
		type: String,
		required: true
	})
	thumbnail: string

	@Prop({
		type: Boolean,
		default: false
	})
	is_published: boolean

	@Prop({
		type: Boolean,
		default: true
	})
	is_draft: boolean

	@Prop({
		type: Date,
		default: null
	})
	published_at: Date | null
}

export const PostSchema = SchemaFactory.createForClass(Post)
