import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { S3Module as NestS3Module } from 'nestjs-s3'
import { S3Service } from './s3.service'

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: '.env' }),
		ThrottlerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService) => ({
				throttlers: [
					{
						ttl: +configService.get('UPLOAD_TTL'),
						limit: +configService.get('UPLOAD_RATE_LIMIT')
					}
				]
			})
		}),
		NestS3Module.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				config: {
					credentials: {
						accessKeyId: configService.getOrThrow('AWS_S3_ACCEESS_KEY'),
						secretAccessKey: configService.getOrThrow('AWS_S3_SECRET_KEY')
					},
					region: configService.getOrThrow('AWS_REGION'),
					forcePathStyle: true,
					signatureVersion: 'v4'
				}
			})
		})
	],
	providers: [
		S3Service,
		{
			provide: 'APP_GUARD',
			useClass: ThrottlerGuard
		}
	],
	exports: [S3Service]
})
export class S3Module {}
