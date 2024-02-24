import { CacheOptionsFactory } from '@nestjs/cache-manager'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
import type { RedisClientOptions } from 'redis'

@Injectable()
export class RedisService implements CacheOptionsFactory {
	constructor(private readonly configService: ConfigService) {}
	public createCacheOptions(): RedisClientOptions {
		return {
			store: redisStore,
			host: this.configService.get('REDIS_HOST'),
			port: this.configService.get('REDIS_PORT')
		}
	}
}
