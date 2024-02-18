import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import * as mongooseSlugGenerator from 'mongoose-slug-generator'
import { RetailStoreController } from './retail-store.controller'
import { RetailStoreRepository } from './retail-store.repository'
import { RetailStoreService } from './retail-store.service'
import { RETAIL_STORE_COLLECTION } from './constants/retail-store.constant'
import { RetailStoreModelSchema, RetailStoreSchema } from './schemas/retail-store.schema'
import { DatabaseModule } from '@app/database'
import { RmqModule } from '@app/rmq'

@Module({
	imports: [
		DatabaseModule,
		RmqModule,
		MongooseModule.forFeatureAsync([
			{
				name: RetailStoreModelSchema.name,
				collection: RETAIL_STORE_COLLECTION,
				useFactory: () => {
					const schema = RetailStoreSchema
					schema.plugin(mongooseSlugGenerator)
					return schema
				}
			}
		])
	],
	providers: [
		RetailStoreService,
		{ provide: RetailStoreRepository.provide, useClass: RetailStoreRepository }
	],
	controllers: [RetailStoreController]
})
export class RetailStoreModule {}
