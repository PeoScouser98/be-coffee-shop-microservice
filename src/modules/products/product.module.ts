import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
	DesertProdSchema,
	BaseProduct,
	BaseProductSchema
} from './schemas/base-product.schema';
import { DrinkProdSchema } from './schemas/drink-product.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: BaseProduct.name, schema: BaseProductSchema },
			{ name: BaseProduct.name, schema: DrinkProdSchema },
			{ name: BaseProduct.name, schema: DesertProdSchema }
		])
	],
	controllers: [ProductController],
	providers: [ProductService]
})
export class ProductModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply().forRoutes();
	}
}
