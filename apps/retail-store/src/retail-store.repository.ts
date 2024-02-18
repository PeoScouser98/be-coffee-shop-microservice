import { Injectable } from '@nestjs/common'
import { RetailStoreModelSchema, type RetailStoreDocument } from './schemas/retail-store.schema'
import { IRetailChainRepository } from './interfaces/retail-store.repository.interface'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseAbstractRepository } from '@app/common'

@Injectable()
export class RetailStoreRepository
	extends BaseAbstractRepository<RetailStoreDocument>
	implements IRetailChainRepository
{
	static provide: string = 'RETAIL_STORE_REPOSITORY' as const

	constructor(
		@InjectModel(RetailStoreModelSchema.name)
		readonly branchStoreModel: Model<RetailStoreDocument>,
		@InjectConnection() connection
	) {
		super(branchStoreModel, connection)
	}
}
