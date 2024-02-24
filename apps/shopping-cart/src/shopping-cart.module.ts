import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserCartModelSchema, UserCartSchema } from './schemas/shopping-cart.schema'
import { ShoppingCartController } from './shopping-cart.controller'
import { ShoppingCartRepository } from './shopping-cart.repository'
import { UserCartService } from './shopping-cart.service'

import { ProductModule } from 'apps/product/src/product.module'
import { InventoryModule } from 'apps/inventory/src/inventory.module'
import { DatabaseModule } from '@app/database'
import { I18nModule } from '@app/i18n'

@Module({
	imports: [
		DatabaseModule,
		I18nModule,
		MongooseModule.forFeature([{ name: UserCartModelSchema.name, schema: UserCartSchema }]),
		ProductModule,
		InventoryModule
	],
	providers: [
		UserCartService,
		{ provide: ShoppingCartRepository.provide, useClass: ShoppingCartRepository }
	],
	controllers: [ShoppingCartController],
	exports: [
		UserCartService,
		{ provide: ShoppingCartRepository.provide, useClass: ShoppingCartRepository }
	]
})
export class ShoppingCartModule {}
