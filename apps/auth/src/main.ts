import { Log } from '@app/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { AuthModule } from './auth.module'

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(AuthModule)
	const configService = app.get(ConfigService)
	app.setGlobalPrefix('v1/api')
	console.log(configService.get('LOCAL_ORIGIN'))
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
	app.use(cookieParser())
	app.use(compression())

	await app.listen(configService.get('AUTH_SERVICE_PORT'), async () => {
		const url = await app.getUrl()
		Log.info(`Auth service is running on: ${Log.highlight(url)}`)
	})

	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
