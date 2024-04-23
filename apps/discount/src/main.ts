import { Log } from '@app/common'
import { RmqService } from '@app/rmq'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DiscountModule } from './discount.module'

async function bootstrap() {
	const app = await NestFactory.create(DiscountModule)
	app.setGlobalPrefix('v1/api')
	const configService = app.get(ConfigService)
	// Microservices
	const rmqService = app.get<RmqService>(RmqService)
	app.connectMicroservice(rmqService.getOptions('DISCOUNT'))
	await app.startAllMicroservices()
	await app.listen(configService.get('DISCOUNT_SERVICE_PORT'), async () => {
		const url = await app.getUrl()
		Log.info(`Discount service is running on: ${Log.highlight(url)}`)
	})
}
bootstrap()
