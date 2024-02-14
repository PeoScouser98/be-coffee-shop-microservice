import { Module } from '@nestjs/common'
import { ProductLineService } from './product-line.service'
import { ProductLineController } from './product-line.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductLineModelSchema, ProductLineSchema } from './schemas/product-line.schema'
import { Respositories } from '@app/common'
import { ProductLineRepository } from './product-line.repository'
import * as _ from 'lodash'
import * as mongooseSlugGenerator from 'mongoose-slug-generator'
import { Collections } from '@app/common'
import { DatabaseModule, LocalizationModule } from '@app/common'
@Module({
	imports: [
		DatabaseModule,
		LocalizationModule,
		MongooseModule.forFeatureAsync([
			{
				name: ProductLineModelSchema.name,
				collection: Collections.PRODUCT_LINES,
				useFactory: () => {
					const schema = ProductLineSchema
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
		ProductLineService,
		{
			provide: Respositories.PRODUCT_LINE,
			useClass: ProductLineRepository
		}
	],
	controllers: [ProductLineController]
})
export class ProductLineModule {}
