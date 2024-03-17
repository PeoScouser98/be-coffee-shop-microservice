import { RmqService } from '@app/rmq'
import { NestFactory } from '@nestjs/core'
import { ProductModule } from './product.module'
import { ConfigService } from '@nestjs/config'
import { Log } from '@app/common'
import cookieParser from 'cookie-parser'
import compression from 'compression'

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(ProductModule)
	const rmqService = app.get<RmqService>(RmqService)
	const configService = app.get<ConfigService>(ConfigService)
	const PORT = 3002 as const
	app.setGlobalPrefix('/v1/api')
	app.enableCors({
		credentials: true,
		origin: [configService.get<string>('LOCAL_ORIGIN')]
	})
	app.use(cookieParser())
	app.use(compression())
	app.connectMicroservice(rmqService.getOptions('PRODUCT'))
	await app.startAllMicroservices()
	await app.listen(PORT, async () => {
		const url = await app.getUrl()
		Log.info(`Product service is running on: ${Log.highlight(url)}`)
	})
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
