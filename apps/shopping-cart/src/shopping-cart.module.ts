import { DatabaseModule } from '@app/database'
import { I18nModule } from '@app/i18n'
import { RmqModule } from '@app/rmq'
import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'apps/auth/src/auth.module'
import { ShoppingCartModelSchema, UserCartSchema } from './schemas/shopping-cart.schema'
import { ShoppingCartController } from './shopping-cart.controller'
import { ShoppingCartRepository } from './shopping-cart.repository'
import { ShoppingCartService } from './shopping-cart.service'
import { ProductModule } from 'apps/product/src/product.module'
import { InventoryModule } from 'apps/inventory/src/inventory.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env'
		}),
		RmqModule,
		I18nModule,
		DatabaseModule,
		MongooseModule.forFeature([{ name: ShoppingCartModelSchema.name, schema: UserCartSchema }]),
		// AuthModule,
		forwardRef(() => AuthModule),
		forwardRef(() => ProductModule),
		forwardRef(() => InventoryModule)
	],
	providers: [
		ShoppingCartService,
		{
			provide: ShoppingCartRepository.name,
			useClass: ShoppingCartRepository
		}
	],
	controllers: [ShoppingCartController],
	exports: [
		ShoppingCartService,
		{
			provide: ShoppingCartRepository.name,
			useClass: ShoppingCartRepository
		}
	]
})
export class ShoppingCartModule {}
