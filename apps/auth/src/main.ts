import { NestFactory } from '@nestjs/core'
import { AuthModule } from './auth.module'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
	const app = await NestFactory.createMicroservice(AuthModule, {
		transport: Transport.TCP
	})
	await app.listen()
}
bootstrap()
