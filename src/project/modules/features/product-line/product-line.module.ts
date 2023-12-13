import { Module } from '@nestjs/common'
import { ProductLineService } from './product-line.service'
import { ProductLineController } from './product-line.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductLine, ProductLineSchema } from './schemas/product-line.schema'
import Providers from '@/project/common/constants/provide.constant'
import { ProductLineRepository } from './product-line.repository'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: ProductLine.name,
				schema: ProductLineSchema
			}
		])
	],
	providers: [
		ProductLineService,
		{
			provide: Providers.PRODUCT_LINE_REPOSITORY,
			useClass: ProductLineRepository
		}
	],
	controllers: [ProductLineController]
})
export class ProductLineModule {}
