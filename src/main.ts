import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import __console__ from './common/utils/log.utils';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('/v1/api', {});
	app.enableCors({
		credentials: true,
		origin: [process.env.LOCAL_ORIGIN]
	});
	await app.listen(process.env.PORT, () => {
		__console__.success(
			`Server is ready on: http://localhost:${process.env.PORT}`
		);
	});

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();
