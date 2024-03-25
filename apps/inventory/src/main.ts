import { Log } from '@app/common'
import { RmqService } from '@app/rmq'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { InventoryModule } from './inventory.module'

declare const module: any
const PORT = 3003

async function bootstrap() {
	const app = await NestFactory.create(InventoryModule)
	const rmqService = app.get<RmqService>(RmqService)
	const configService = app.get<ConfigService>(ConfigService)
	app.setGlobalPrefix('/v1/api')
	app.enableCors({
		credentials: true,
		origin: [configService.get<string>('LOCAL_ORIGIN')]
	})
	app.use(cookieParser())
	app.use(compression())
	app.connectMicroservice(rmqService.getOptions('INVENTORY'))

	await app.startAllMicroservices()
	await app.listen(PORT, async () => {
		const url = await app.getUrl()
		Log.info(`Inventory service is running on: ${Log.highlight(url)}`)
	})
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
