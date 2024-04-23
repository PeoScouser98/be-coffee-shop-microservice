import { NestFactory } from '@nestjs/core'
import { RetailStoreModule } from './retail-store.module'
import { ConfigService } from '@nestjs/config'
import { RmqService } from '@app/rmq'
import { Log } from '@app/common'
import { ValidationPipe } from '@nestjs/common'

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(RetailStoreModule)
	const rmqService = app.get<RmqService>(RmqService)
	app.setGlobalPrefix('/v1/api')
	app.connectMicroservice(rmqService.getOptions('RETAIL_STORE'))
	app.useGlobalPipes(new ValidationPipe())
	const configService = app.get(ConfigService)
	await app.startAllMicroservices()
	app.connectMicroservice(rmqService.getOptions('RETAIL_STORE'))
	await app.startAllMicroservices()
	app.listen(configService.get('RETAIL_STORE_SERVICE_PORT'), async () => {
		const url = await app.getUrl()
		Log.info(`Retail store service is running on: ${Log.highlight(url)}`)
	})
}
bootstrap()
