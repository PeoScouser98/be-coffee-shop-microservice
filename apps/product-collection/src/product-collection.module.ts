import Respositories from '@app/common/constants/repositories.constant'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductCollectionService } from './product-collection.service'
import { ProductCollectionController } from './product-collection.controller'
import { ProductCollectionRepository } from './product-collection.repository'
import {
	ProductCollectionModelSchema,
	ProductCollectionSchema
} from './schemas/product-collection.schema'
import * as _ from 'lodash'
import * as mongooseSlugGenerator from 'mongoose-slug-generator'
import Collections from '@app/common/constants/collections.constant'
import { DatabaseModule, LocalizationModule } from '@app/common'

@Module({
	imports: [
		DatabaseModule,
		LocalizationModule,
		MongooseModule.forFeatureAsync([
			{
				name: ProductCollectionModelSchema.name,
				collection: Collections.PRODUCT_COLLECTIONS,
				useFactory: () => {
					const schema = ProductCollectionSchema
					schema.pre('save', function (next) {
						this.name = _.capitalize(this.name)
						next()
					})
					schema.plugin(mongooseSlugGenerator)
					return schema
				}
			}
		])
	],
	providers: [
		{
			provide: Respositories.PRODUCT_COLLECTION,
			useClass: ProductCollectionRepository
		},
		ProductCollectionService
	],
	controllers: [ProductCollectionController],
	exports: []
})
export class ProductCollectionModule {}
