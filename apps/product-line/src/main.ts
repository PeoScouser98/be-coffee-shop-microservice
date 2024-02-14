import { NestFactory } from '@nestjs/core'
import { ProductLineModule } from './product-line.module'

async function bootstrap() {
	const app = await NestFactory.create(ProductLineModule)
	await app.listen(3000)
}
bootstrap()
