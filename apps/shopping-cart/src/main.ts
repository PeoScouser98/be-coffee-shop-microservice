import { Log } from '@app/common'
import { RmqService } from '@app/rmq'
import { NestFactory } from '@nestjs/core'
import { ShoppingCartModule } from './shopping-cart.module'
import { ConfigService } from '@nestjs/config'

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(ShoppingCartModule)
	const configService = app.get(ConfigService)
	app.setGlobalPrefix('/v1/api')
	// Microservices
	const rmqService = app.get(RmqService)
	app.connectMicroservice(rmqService.getOptions('SHOPPING_CART'))
	await app.startAllMicroservices()
	await app.listen(configService.get('SHOPPING_CART_SERVICE_PORT'), async () => {
		const url = await app.getUrl()
		Log.info(`Shopping cart service is running on: ${Log.highlight(url)}`)
	})
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
