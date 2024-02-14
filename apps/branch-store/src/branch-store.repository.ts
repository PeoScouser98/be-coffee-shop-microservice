import { Injectable } from '@nestjs/common'
import { BranchStoreModelSchema, type BranchStoreDocument } from './schemas/brach-store.schema'
import { IBranchStoreRepository } from './interfaces/brach-store.repository.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseAbstractRepository } from '@app/common'

@Injectable()
export class BranchStoreRepository
	extends BaseAbstractRepository<BranchStoreDocument>
	implements IBranchStoreRepository
{
	constructor(
		@InjectModel(BranchStoreModelSchema.name)
		private readonly branchStoreModel: Model<BranchStoreDocument>
	) {
		super(branchStoreModel)
	}
}
