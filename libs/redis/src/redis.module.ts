import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { RedisService } from './redis.service'

@Module({
	imports: [
		CacheModule.registerAsync({
			isGlobal: true,
			useClass: RedisService
		})
	],
	providers: [RedisService],
	exports: [RedisService]
})
export class RedisModule {}
