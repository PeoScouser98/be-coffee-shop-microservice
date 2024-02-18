import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AuthModule } from './auth.module'
import { Log } from '@app/common'
import cookieParser from 'cookie-parser'
import compression from 'compression'

async function bootstrap() {
	const app = await NestFactory.create(AuthModule)
	const configService = app.get<ConfigService>(ConfigService)
	app.setGlobalPrefix('/v1/api')
	app.enableCors({
		credentials: true,
		origin: [configService.get<string>('LOCAL_ORIGIN')]
	})
	app.use(cookieParser())
	app.use(compression())
	await app.listen(configService.get('PORT'), () =>
		Log.info(`User service is running on port ${configService.get('PORT')}`)
	)
}
bootstrap()
