import { DatabaseModule } from '@app/database'
import { I18nModule } from '@app/i18n'
import { RmqModule } from '@app/rmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'apps/auth/src/auth.module'
import mongooseAutoPopulate from 'mongoose-autopopulate'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import mongooseSlugUpdater from 'mongoose-slug-updater'
import { PostController } from './post.controller'
import { PostRepository } from './post.repository'
import { PostService } from './post.service'
import { Post, PostSchema } from './schemas/post.schema'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '/apps/post/.env'
		}),
		DatabaseModule,
		RmqModule,
		AuthModule,
		I18nModule,
		MongooseModule.forFeatureAsync([
			{
				name: Post.name,
				useFactory: () => {
					const schema = PostSchema
					schema.plugin(mongooseAutoPopulate)
					schema.plugin(mongoosePaginate)
					schema.plugin(mongooseSlugUpdater)
					return schema
				}
			}
		])
	],
	controllers: [PostController],
	providers: [
		PostService,
		{
			provide: PostRepository.provide,
			useClass: PostRepository
		}
	]
})
export class PostModule {}
