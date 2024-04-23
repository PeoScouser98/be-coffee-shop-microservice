import { DatabaseModule } from '@app/database'
import { I18nModule } from '@app/i18n'
import { RmqModule } from '@app/rmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'apps/auth/src/auth.module'
import { isNil } from 'lodash'
import mongoosePaginate from 'mongoose-paginate-v2'
import { DiscountApplyingMethod } from './constants/discount.contant'
import { DiscountController } from './discount.controller'
import { DiscountRepository } from './discount.repository'
import { DiscountService } from './discount.service'
import { DiscountModelSchema, DiscountSchema } from './schemas/discount.schema'

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			envFilePath: '.env'
		}),
		DatabaseModule,
		RmqModule,
		I18nModule,
		MongooseModule.forFeatureAsync([
			{
				name: DiscountModelSchema.name,
				useFactory: () => {
					DiscountSchema.pre('save', function () {
						if (isNil(this.applied_for_products))
							this.applying_method = DiscountApplyingMethod.ALL
						else this.applying_method = DiscountApplyingMethod.SPECIFIC
					})
					DiscountSchema.plugin(mongoosePaginate)
					return DiscountSchema
				}
			}
		])
	],
	providers: [
		DiscountService,
		{ provide: DiscountRepository.provide, useClass: DiscountRepository }
	],
	controllers: [DiscountController]
})
export class DiscountModule {}
