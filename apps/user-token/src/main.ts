import { NestFactory } from '@nestjs/core'
import { UserTokenModule } from './user-token.module'

async function bootstrap() {
	const app = await NestFactory.create(UserTokenModule)
	await app.listen(3001)
}
bootstrap()
