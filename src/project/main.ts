import { NestFactory } from '@nestjs/core'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import 'dotenv/config'
import { AppModule } from './app.module'
// import chalk from 'chalk'

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('/v1/api', {})
	app.use(cookieParser())
	app.use(
		compression({
			level: 6,
			threshold: 1024
		})
	)

	app.enableCors({
		credentials: true,
		origin: [process.env.LOCAL_ORIGIN]
	})

	await app.listen(process.env.PORT, async () => {
		console.log(`Server is ready on: message: http://localhost:${process.env.PORT}`)
	})

	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}

bootstrap()
