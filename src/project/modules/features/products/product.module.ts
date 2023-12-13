import Providers from '@/project/common/constants/provide.constant'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductController } from './product.controller'
import { ProductRepository, TopHalfProductRepository } from './product.repository'
import { ProductFactoryService } from './product.factory.service'
import { AccessoriesProduct, AccessoriesProductSchema } from './schemas/accessories-product.schema'
import { Product, ProductSchema } from './schemas/product.schema'
import { SneakerProduct, SneakerProductSchema } from './schemas/sneaker-product.schema'
import { TopHalfProduct, TopHalfProductSchema } from './schemas/top-half-product.schema'
import { ProductService } from './product.service'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Product.name,
				schema: ProductSchema
			},
			{
				name: SneakerProduct.name,
				schema: SneakerProductSchema
			},
			{ name: TopHalfProduct.name, schema: TopHalfProductSchema },
			{ name: AccessoriesProduct.name, schema: AccessoriesProductSchema }
		])
	],
	controllers: [ProductController],
	providers: [
		ProductFactoryService,
		ProductService,
		{ useClass: ProductRepository, provide: Providers.PRODUCT_REPOSITORY },
		{
			useClass: TopHalfProductRepository,
			provide: Providers.SNEAKER_PRODUCT_REPOSITORY
		}
	]
})
export class ProductModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply().forRoutes()
	}
}
