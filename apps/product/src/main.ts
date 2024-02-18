import { RmqService } from '@app/rmq'
import { NestFactory } from '@nestjs/core'
import { ProductModule } from './product.module'
import { ConfigService } from '@nestjs/config'
import { Log } from '@app/common'

async function bootstrap() {
	const app = await NestFactory.create(ProductModule)
	app.setGlobalPrefix('/v1/api')
	const rmqService = app.get<RmqService>(RmqService)
	const configService = app.get<ConfigService>(RmqService)
	app.connectMicroservice(rmqService.getOptions('PRODUCT', true))
	await app.startAllMicroservices()
	await app.listen(configService.get('PORT'), () =>
		Log.info(`Product service is running on port ${configService.get('PORT')}`)
	)
}
bootstrap()
