import { Log } from '@app/common'
import { RmqService } from '@app/rmq'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { ProductModule } from './product.module'

async function bootstrap() {
	const app = await NestFactory.create(ProductModule)
	app.setGlobalPrefix('v1/api')

	const rmqService = app.get<RmqService>(RmqService)
	const configService = app.get(ConfigService)

	app.connectMicroservice(rmqService.getOptions('PRODUCT'))
	await app.startAllMicroservices()
	await app.listen(configService.get('PRODUCT_SERVICE_PORT'), async () => {
		const url = await app.getUrl()
		Log.info(`Product service is running on: ${Log.highlight(url)}`)
	})
}
bootstrap()
