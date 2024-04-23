import { NestFactory } from '@nestjs/core'
import { PostModule } from './post.module'
import { RmqService } from '@app/rmq'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(PostModule)
	const rmqService = app.get<RmqService>(RmqService)
	const configService = app.get<ConfigService>(ConfigService)
	app.connectMicroservice(rmqService.getOptions('POST'))
	await app.startAllMicroservices()
	await app.listen(configService.get<string>('POST_SERVICE_PORT'))
}
bootstrap()
