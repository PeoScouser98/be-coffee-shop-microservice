import Providers from '@/project/common/constants/provide.constant'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductCollectionService } from './product-collection.service'
import { ProductCollectionController } from './product-collections.controller'
import { ProductCollectionRepository } from './product-collections.repository'
import { ProductCollection, ProductCollectionSchema } from './schemas/product-collection.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: ProductCollection.name,
				schema: ProductCollectionSchema
			}
		])
	],
	providers: [
		{
			provide: Providers.PRODUCT_COLLECTION_REPOSITORY,
			useClass: ProductCollectionRepository
		},
		ProductCollectionService
	],
	controllers: [ProductCollectionController],
	exports: []
})
export class ProductCollectionModule {}
