import { Respositories } from '@app/common'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import * as _ from 'lodash'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import * as mongooseSlugGenerator from 'mongoose-slug-generator'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import {
	ProductRepository,
	SneakerProductRepository,
	TopHalfProductRepository
} from './product.repository'
import { AccessoryProduct, AccessoryProductSchema } from './schemas/accessory-product.schema'
import { ProductModelSchema, ProductSchema } from './schemas/product.schema'
import { SneakerProductModelSchema, SneakerProductSchema } from './schemas/sneaker-product.schema'
import { TopHalfProductModelSchema, TopHalfProductSchema } from './schemas/top-half-product.schema'
import { Collections } from '@app/common'
import { DatabaseModule, LocalizationModule } from '@app/common'
@Module({
	imports: [
		DatabaseModule,
		LocalizationModule,
		MongooseModule.forFeatureAsync([
			{
				name: ProductModelSchema.name,
				collection: Collections.PRODUCTS,
				useFactory: () => {
					const schema = ProductSchema
					schema.pre('save', function (next) {
						this.name = _.capitalize(this.name)
						next()
					})
					schema.plugin(mongooseSlugGenerator)
					schema.plugin(mongoosePaginate)
					return schema
				}
			},
			{
				name: SneakerProductModelSchema.name,
				collection: Collections.PRODUCT_SNEAKERS,
				useFactory: () => SneakerProductSchema
			},
			{
				name: TopHalfProductModelSchema.name,
				collection: Collections.PRODUCT_TOP_HALF,
				useFactory: () => TopHalfProductSchema
			},
			{
				name: AccessoryProduct.name,
				collection: Collections.PRODUCT_ACCESSORIES,
				useFactory: () => AccessoryProductSchema
			}
		])
	],
	controllers: [ProductController],
	providers: [
		ProductService,
		{ useClass: ProductRepository, provide: Respositories.PRODUCT },
		{
			useClass: SneakerProductRepository,
			provide: Respositories.SNEAKER_PRODUCT
		},
		{
			useClass: TopHalfProductRepository,
			provide: Respositories.TOP_HALF_PRODUCT
		},
		{
			useClass: TopHalfProductRepository,
			provide: Respositories.ACCESSORY_PRODUCT
		}
	],
	exports: [ProductService]
})
export class ProductModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply().forRoutes()
	}
}
