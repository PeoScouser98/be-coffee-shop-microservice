import { NestFactory } from '@nestjs/core'
import { ShoppingCartModule } from './shopping-cart.module'
import { ConfigService } from '@nestjs/config'
import { RmqService } from '@app/rmq'
import { Log } from '@app/common'

async function bootstrap() {
	const app = await NestFactory.create(ShoppingCartModule)
	const configService = app.get<ConfigService>(ConfigService)
	const rmqService = app.get<RmqService>(RmqService)

	await app.connectMicroservice(rmqService.getOptions('SHOPPING_CART'))
	await app.startAllMicroservices()
	await app.listen(3000, () =>
		Log.info(`Shopping cart service now is running on port: ${configService.get('PORT')}`)
	)
}
bootstrap()
