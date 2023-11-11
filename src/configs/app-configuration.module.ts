import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';

@Module({
	providers: [ConfigService],
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
			load: [configuration]
		})
	],
	exports: [ConfigModule]
})
export class GlobalConfigModule {}
