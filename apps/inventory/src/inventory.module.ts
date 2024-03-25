import { DatabaseModule } from '@app/database'
import { I18nModule } from '@app/i18n'
import { RmqModule } from '@app/rmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'apps/auth/src/auth.module'
import mongooseAutoPopulate from 'mongoose-autopopulate'
import { InventoryController } from './inventory.controller'
import { InventoryRepository } from './inventory.repository'
import { InventoryService } from './inventory.service'
import { Inventory, InventorySchema } from './schema/inventory.schema'
import { ProductModule } from 'apps/product/src/product.module'
import { RetailStoreModule } from 'apps/retail-store/src/retail-store.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: './apps/inventory/.env',
			isGlobal: true,
			cache: true
		}),
		AuthModule,
		ProductModule,
		RetailStoreModule,
		I18nModule,
		RmqModule,
		DatabaseModule,
		MongooseModule.forFeatureAsync([
			{
				name: Inventory.name,
				useFactory: () => {
					const schema = InventorySchema
					schema.plugin(mongooseAutoPopulate)
					return schema
				}
			}
		])
	],
	providers: [
		InventoryService,
		{ provide: InventoryRepository.provide, useClass: InventoryRepository }
	],
	controllers: [InventoryController],
	exports: [InventoryService]
})
export class InventoryModule {}
