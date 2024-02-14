import { Module } from '@nestjs/common'
import { BranchStoreService } from './branch-store.service'
import { BranchStoreController } from './branch-store.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { BranchStoreModelSchema, BranchStoreSchema } from './schemas/brach-store.schema'
import * as mongooseSlugGenerator from 'mongoose-slug-generator'
import { Respositories } from '@app/common'
import { BranchStoreRepository } from './branch-store.repository'
import { Collections } from '@app/common'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: BranchStoreModelSchema.name,
				collection: Collections.BRANCH_STORES,
				useFactory: () => {
					const schema = BranchStoreSchema
					schema.plugin(mongooseSlugGenerator)
					return schema
				}
			}
		])
	],
	providers: [
		BranchStoreService,
		{ provide: Respositories.BRANCH_STORE, useClass: BranchStoreRepository }
	],
	controllers: [BranchStoreController]
})
export class BranchStoreModule {}
