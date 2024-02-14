import Respositories from '@app/common/constants/repositories.constant'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserCartModelSchema, UserCartSchema } from './schemas/user-cart.schema'
import { UserCartController } from './user-cart.controller'
import { UserCartRepository } from './user-cart.repository'
import { UserCartService } from './user-cart.service'

import { DatabaseModule, LocalizationModule } from '@app/common'
import { ProductModule } from 'apps/product/src/product.module'
import { InventoryModule } from 'apps/inventory/src/inventory.module'

@Module({
	imports: [
		DatabaseModule,
		LocalizationModule,
		MongooseModule.forFeature([{ name: UserCartModelSchema.name, schema: UserCartSchema }]),
		ProductModule,
		InventoryModule
	],
	providers: [UserCartService, { provide: Respositories.USER_CART, useClass: UserCartRepository }],
	controllers: [UserCartController],
	exports: [UserCartService, { provide: Respositories.USER_CART, useClass: UserCartRepository }]
})
export class UserCartModule {}
