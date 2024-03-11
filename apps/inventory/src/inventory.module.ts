import { Module } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { InventoryController } from './inventory.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { InventoryModelSchema, InventorySchema } from './schema/inventory.schema'
import { InventoryRepository } from './inventory.repository'
import { DatabaseModule } from '@app/database'
import { RmqModule } from '@app/rmq'
import { ConfigModule } from '@nestjs/config'
import { I18nModule } from '@app/i18n'
import { AuthModule } from 'apps/auth/src/auth.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: './apps/inventory/.env',
			isGlobal: true,
			cache: true
		}),
		AuthModule,
		I18nModule,
		RmqModule,
		DatabaseModule,
		MongooseModule.forFeature([
			{
				name: InventoryModelSchema.name,
				schema: InventorySchema
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
