import { NestFactory } from '@nestjs/core'
import { PostModule } from './post.module'
import { RmqService } from '@app/rmq'
import { ConfigService } from '@nestjs/config'

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(PostModule)
	const rmqService = app.get<RmqService>(RmqService)
	const configService = app.get<ConfigService>(ConfigService)
	app.connectMicroservice(rmqService.getOptions('POST'))
	await app.startAllMicroservices()
	await app.listen(configService.get<string>('PORT'))
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
