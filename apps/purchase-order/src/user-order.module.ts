import { Repositories } from '@app/common'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OrderController } from './user-order.controller'
import { OrderRepository } from './user-order.repository'
import { OrderService } from './user-order.service'
import { UserOrderModelSchema, OrderSchema } from './schemas/user-order.schema'
import { ProductModule } from 'apps/product/src/product.module'
import { UserCartModule } from 'apps/user-cart/src/user-cart.module'
import { DatabaseModule, LocalizationModule } from '@app/common'

@Module({
	imports: [
		DatabaseModule,
		LocalizationModule,
		MongooseModule.forFeature([{ name: UserOrderModelSchema.name, schema: OrderSchema }]),
		UserCartModule,
		ProductModule
	],
	controllers: [OrderController],
	providers: [OrderService, { provide: Repositories.ORDER, useClass: OrderRepository }]
})
export class UserOrderModule {}
