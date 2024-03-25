import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import mongooseSlugUpdater from 'mongoose-slug-updater'
import { RetailStoreController } from './retail-store.controller'
import { RetailStoreRepository } from './retail-store.repository'
import { RetailStoreService } from './retail-store.service'
import { RetailStore, RetailStoreSchema } from './schemas/retail-store.schema'
import { DatabaseModule } from '@app/database'
import { RmqModule } from '@app/rmq'
import { AuthModule } from 'apps/auth/src/auth.module'
import { I18nModule } from '@app/i18n'

@Module({
	imports: [
		DatabaseModule,
		RmqModule,
		AuthModule,
		I18nModule,
		MongooseModule.forFeatureAsync([
			{
				name: RetailStore.name,
				useFactory: () => {
					const schema = RetailStoreSchema
					schema.plugin(mongooseSlugUpdater)
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
