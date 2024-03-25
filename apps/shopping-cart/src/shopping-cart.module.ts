import { DatabaseModule } from '@app/database'
import { I18nModule } from '@app/i18n'
import { RmqModule } from '@app/rmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'apps/auth/src/auth.module'
import { UserCartModelSchema, UserCartSchema } from './schemas/shopping-cart.schema'
import { ShoppingCartController } from './shopping-cart.controller'
import { ShoppingCartRepository } from './shopping-cart.repository'
import { ShoppingCartService } from './shopping-cart.service'
import { ProductModule } from 'apps/product/src/product.module'
import { InventoryModule } from 'apps/inventory/src/inventory.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: 'apps/shopping-cart/.env'
		}),
		DatabaseModule,
		RmqModule,
		AuthModule,
		I18nModule,
		ProductModule,
		InventoryModule,
		MongooseModule.forFeature([{ name: UserCartModelSchema.name, schema: UserCartSchema }])
	],
	providers: [
		ShoppingCartService,
		{
			provide: ShoppingCartRepository.provide,
			useClass: ShoppingCartRepository
		}
	],
	controllers: [ShoppingCartController],
	exports: [
		ShoppingCartService,
		{
			provide: ShoppingCartRepository.provide,
			useClass: ShoppingCartRepository
		}
	]
})
export class ShoppingCartModule {}
