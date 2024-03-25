import { Injectable } from '@nestjs/common'
import { RetailStore, type RetailStoreDocument } from './schemas/retail-store.schema'
import { IRetailStoreRepository } from './interfaces/retail-store.repository.interface'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseAbstractRepository } from '@app/common'

@Injectable()
export class RetailStoreRepository
	extends BaseAbstractRepository<RetailStoreDocument>
	implements IRetailStoreRepository
{
	static provide: string = 'RETAIL_STORE_REPOSITORY' as const

	constructor(
		@InjectModel(RetailStore.name)
		readonly retailStoreModel: Model<RetailStoreDocument>,
		@InjectConnection() connection
	) {
		super(retailStoreModel, connection)
	}
}
