import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OrderController } from './purchase-order.controller'
import { PurchaseOrderRepository } from './purchase-order.repository'
import { OrderService } from './purchase-order.service'
import { PurchaseOrder, PurchaseOrderSchema } from './schemas/purchase-order.schema'
import { ProductModule } from 'apps/product/src/product.module'
import { DatabaseModule } from '@app/database'
import { I18nModule } from '@app/i18n'
import { ShoppingCartModule } from 'apps/shopping-cart/src/shopping-cart.module'
import { RmqModule } from '@app/rmq'
import { MailerModule } from '@app/mailer'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: '.env' }),
		DatabaseModule,
		I18nModule,
		RmqModule,
		MailerModule,
		MongooseModule.forFeature([{ name: PurchaseOrder.name, schema: PurchaseOrderSchema }]),
		ShoppingCartModule,
		ProductModule
	],
	controllers: [OrderController],
	providers: [
		OrderService,
		{ provide: PurchaseOrderRepository.name, useClass: PurchaseOrderRepository }
	]
})
export class UserOrderModule {}
