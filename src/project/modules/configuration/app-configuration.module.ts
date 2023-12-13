import { Module, Global } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from '../../configs/configuration'

@Global()
@Module({
	providers: [ConfigService],
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
			validationOptions: {
				abortEarlier: true
			},
			cache: true,

			load: [configuration]
		})
	],
	exports: [ConfigModule]
})
export class GlobalConfigModule {}
