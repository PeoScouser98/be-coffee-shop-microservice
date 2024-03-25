import { NestFactory } from '@nestjs/core'
import { RetailStoreModule } from './retail-store.module'
import { ConfigService } from '@nestjs/config'
import { RmqService } from '@app/rmq'
import { Log } from '@app/common'
import cookieParser from 'cookie-parser'
import compression from 'compression'

declare const module: any
const PORT = 3005 as const

async function bootstrap() {
	const app = await NestFactory.create(RetailStoreModule)
	const configService = app.get<ConfigService>(ConfigService)
	const rmqService = app.get<RmqService>(RmqService)
	app.setGlobalPrefix('/v1/api')
	app.enableCors({
		credentials: true,
		origin: [configService.get<string>('LOCAL_ORIGIN')]
	})
	app.use(cookieParser())
	app.use(compression())
	app.connectMicroservice(rmqService.getOptions('RETAIL_STORE'))
	await app.startAllMicroservices()
	app.listen(PORT, async () => {
		const url = await app.getUrl()
		Log.info(`Retail store service is running on: ${Log.highlight(url)}`)
	})
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
