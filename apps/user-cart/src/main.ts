import { NestFactory } from '@nestjs/core'
import { UserCartModule } from './user-cart.module'

async function bootstrap() {
	const app = await NestFactory.create(UserCartModule)
	await app.listen(3000)
}
bootstrap()
