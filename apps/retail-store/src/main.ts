import { NestFactory } from '@nestjs/core'
import { RetailStoreModule } from './retail-store.module'

async function bootstrap() {
	const app = await NestFactory.create(RetailStoreModule)
	await app.listen(3000)
}
bootstrap()
