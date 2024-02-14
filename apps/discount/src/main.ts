import { NestFactory } from '@nestjs/core'
import { DiscountModule } from './discount.module'

async function bootstrap() {
	const app = await NestFactory.create(DiscountModule)
	await app.listen(3000)
}
bootstrap()
