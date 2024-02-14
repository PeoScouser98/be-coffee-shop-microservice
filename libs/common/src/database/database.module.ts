import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from '../configs'

@Module({
	providers: [ConfigService],
	imports: [
		ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				return {
					uri: configService.get<string>('database.uri'),
					dbName: configService.get<string>('database.dbName'),
					maxPoolSize: configService.get<number>('database.maxPoolSize'),
					connectTimeoutMS: configService.get<number>('database.connectTimeoutMS')
				}
			},

			inject: [ConfigService]
		})
		// Add more databases configurations here, like MySQL, PostgreSQL, etc.
	],
	exports: [MongooseModule]
})
export class DatabaseModule {}
