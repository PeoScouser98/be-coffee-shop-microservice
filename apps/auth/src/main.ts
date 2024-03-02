import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { AuthModule } from './auth.module'

declare const module: any

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
	await app.listen(configService.get('PORT'), async () => {
		const url = await app.getUrl()
		console.log(`Auth service is running on: ${url}`)
	})
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
