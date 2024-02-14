import { NestFactory } from '@nestjs/core'
import { UserOrderModule } from './user-order.module'

async function bootstrap() {
	const app = await NestFactory.create(UserOrderModule)
	await app.listen(3000)
}
bootstrap()
