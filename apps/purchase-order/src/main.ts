import { NestFactory } from '@nestjs/core'
import { UserOrderModule } from './purchase-order.module'
import { ConfigService } from '@nestjs/config'
import { RmqService } from '@app/rmq'

async function bootstrap() {
	const app = await NestFactory.create(UserOrderModule)
	app.setGlobalPrefix('v1/api')
	const configService = app.get<ConfigService>(ConfigService)
	const rmqService = app.get<RmqService>(RmqService)
	await app.startAllMicroservices()
	app.connectMicroservice(rmqService.getOptions('PURCHASE_ORDER'))
	await app.listen(configService.get('PURCHASE_ORDER_SERVICEPORT'), async () => {
		const url = await app.getUrl()
		console.log(`Purchase order service is running on: ${url}`)
	})
}
bootstrap()
