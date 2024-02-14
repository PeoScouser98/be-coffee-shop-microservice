import { Module } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { InventoryController } from './inventory.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { InventoryModelSchema, InventorySchema } from './schema/inventory.schema'
import Collections from '@app/common/constants/collections.constant'
import Respositories from '@app/common/constants/repositories.constant'
import { InventoryRepository } from './inventory.repository'
import { DatabaseModule } from '@app/common'

@Module({
	imports: [
		DatabaseModule,
		MongooseModule.forFeature([
			{
				name: InventoryModelSchema.name,
				schema: InventorySchema,
				collection: Collections.INVENTORIES
			}
		])
	],
	providers: [
		InventoryService,
		{ provide: Respositories.INVENTORY, useClass: InventoryRepository }
	],
	controllers: [InventoryController],
	exports: [InventoryService]
})
export class InventoryModule {}
