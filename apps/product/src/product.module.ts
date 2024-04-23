import { toCapitalize } from '@app/common/utils/string.util'
import { DatabaseModule } from '@app/database'
import { I18nModule } from '@app/i18n'
import { RmqModule } from '@app/rmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'apps/auth/src/auth.module'
import mongoosePaginate from 'mongoose-paginate-v2'
import mongooseSlugUpdater from 'mongoose-slug-updater'
import { ProductCollectionController } from './controllers/product-collection.controller'
import { ProductLineController } from './controllers/product-line.controller'
import { ProductController } from './controllers/product.controller'
import { ProductCollectionRepository } from './repositories/product-collection.repository'
import { ProductLineRepository } from './repositories/product-line.repository'
import {
	AccessoryProductRepository,
	ProductRepository,
	SneakerProductRepository,
	TopHalfProductRepository
} from './repositories/product.repository'
import { AccessoryProduct, AccessoryProductSchema } from './schemas/accessory-product.schema'
import { ProductCollection, ProductCollectionSchema } from './schemas/product-collection.schema'
import { ProductLine, ProductLineSchema } from './schemas/product-line.schema'
import { Product, ProductSchema } from './schemas/product.schema'
import { SneakerProduct, SneakerProductSchema } from './schemas/sneaker-product.schema'
import { TopHalfProduct, TopHalfProductSchema } from './schemas/top-half-product.schema'
import { ProductCollectionService } from './services/product-collection.service'
import { ProductLineService } from './services/product-line.service'
import { ProductService } from './services/product.service'
import mongooseAutoPopulate from 'mongoose-autopopulate'
import { S3Module } from '@app/s3'

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: '.env' }),
		AuthModule,
		S3Module,
		RmqModule,
		I18nModule,
		DatabaseModule,
		MongooseModule.forFeatureAsync([
			{
				name: Product.name,
				useFactory: () => {
					ProductSchema.pre('save', function (next) {
						this.name = toCapitalize(this.name)
						next()
					})
					ProductSchema.plugin(mongooseSlugUpdater)
					ProductSchema.plugin(mongoosePaginate)
					ProductSchema.plugin(mongooseAutoPopulate)
					return ProductSchema
				}
			},
			{
				name: SneakerProduct.name,
				useFactory: () => SneakerProductSchema
			},
			{
				name: TopHalfProduct.name,
				useFactory: () => TopHalfProductSchema
			},
			{
				name: AccessoryProduct.name,
				useFactory: () => AccessoryProductSchema
			},
			{
				name: ProductCollection.name,
				useFactory: () => {
					const schema = ProductCollectionSchema
					schema.pre('save', function (next) {
						this.name = toCapitalize(this.name)
						next()
					})
					schema.plugin(mongooseSlugUpdater)
					return schema
				}
			},
			{
				name: ProductLine.name,
				useFactory: () => {
					const schema = ProductLineSchema
					schema.pre('save', function (next) {
						this.name = toCapitalize(this.name)
						next()
					})
					schema.plugin(mongooseSlugUpdater)
					return schema
				}
			}
		])
	],
	controllers: [ProductController, ProductLineController, ProductCollectionController],
	providers: [
		ProductService,
		ProductCollectionService,
		ProductLineService,
		{
			useClass: ProductRepository,
			provide: ProductRepository.name
		},
		{
			useClass: SneakerProductRepository,
			provide: SneakerProductRepository.name
		},
		{
			useClass: TopHalfProductRepository,
			provide: TopHalfProductRepository.name
		},
		{
			useClass: AccessoryProductRepository,
			provide: AccessoryProductRepository.name
		},
		{
			useClass: ProductLineRepository,
			provide: ProductLineRepository.name
		},
		{
			useClass: ProductCollectionRepository,
			provide: ProductCollectionRepository.name
		}
	],
	exports: [ProductService]
})
export class ProductModule {}
