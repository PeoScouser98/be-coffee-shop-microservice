import { NestFactory } from '@nestjs/core'
import { BranchStoreModule } from './branch-store.module'

async function bootstrap() {
	const app = await NestFactory.create(BranchStoreModule)
	await app.listen(3000)
}
bootstrap()
