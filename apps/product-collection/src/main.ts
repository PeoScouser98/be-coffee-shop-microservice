import { NestFactory } from '@nestjs/core'
import { ProductCollectionModule } from './product-collection.module'

async function bootstrap() {
	const app = await NestFactory.create(ProductCollectionModule)
	await app.listen(3000)
}
bootstrap()
