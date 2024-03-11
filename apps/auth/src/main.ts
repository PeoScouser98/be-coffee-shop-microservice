import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { AuthModule } from './auth.module'
import { Log } from '@app/common'

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(AuthModule)
	const configService = app.get<ConfigService>(ConfigService)
	app.setGlobalPrefix('v1/api')
	app.enableCors({
		credentials: true,
		origin: [configService.get<string>('LOCAL_ORIGIN')]
	})
	console.log(configService.get('CRYPTO_MODULUS_LENGTH'))
	app.use(cookieParser())
	app.use(compression())
	const PORT = 3001 as const
	await app.listen(PORT, async () => {
		const url = await app.getUrl()
		Log.info(`Auth service is running on: ${Log.highlight(url)}`)
	})
	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
