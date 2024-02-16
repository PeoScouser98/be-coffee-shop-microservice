import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
	providers: [ConfigService],
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				return {
					uri: configService.get<string>('MONGO_URI'),
					maxPoolSize: 100,
					connectTimeoutMS: 5000
				}
			},

			inject: [ConfigService]
		})
		// Add more databases configurations here, like MySQL, PostgreSQL, etc.
	],
	exports: [MongooseModule]
})
export class DatabaseModule {}
