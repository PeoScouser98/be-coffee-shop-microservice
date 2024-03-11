import { NestFactory } from '@nestjs/core'
import { ShoppingCartModule } from './shopping-cart.module'
import { ConfigService } from '@nestjs/config'
import { RmqService } from '@app/rmq'
import { Log } from '@app/common'
import session from 'express-session'

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(ShoppingCartModule)
	const configService = app.get<ConfigService>(ConfigService)
	const rmqService = app.get<RmqService>(RmqService)
	const PORT = 3004 as const
	app.setGlobalPrefix('/v1/api')
	app.enableCors({
		credentials: true,
		origin: [configService.get<string>('LOCAL_ORIGIN')]
	})
	app.use(
		session({
			secret: configService.get<string>('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false
		})
	)
	app.connectMicroservice(rmqService.getOptions('SHOPPING_CART'))
	await app.startAllMicroservices()
	console.log(configService.get('RABBIT_MQ_SHOPPING_CART_QUEUE'))
	await app.listen(PORT, async () => {
		const url = await app.getUrl()
		Log.info(`Shopping cart service is running on: ${url}`)
	})
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
