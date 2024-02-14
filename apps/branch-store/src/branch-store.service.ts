import Respositories from '@app/common/constants/repositories.constant'
import { ServiceResult } from '@app/common'
import { LocalizationService } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { FilterQuery } from 'mongoose'
import { BranchStoreRepository } from './branch-store.repository'
import { CreateBranchStoreDTO } from './dto/branch-store.dto'
import { IBranchStore } from './interfaces/branch-store.interface'
import { pick } from 'lodash'
import { flatten } from 'flat'

@Injectable()
export class BranchStoreService {
	constructor(
		@Inject(Respositories.BRANCH_STORE)
		private readonly branchStoreRepository: BranchStoreRepository,
		private readonly localizationService: LocalizationService
	) {}

	public async findBranchStores(filterQuery: FilterQuery<IBranchStore>) {
		filterQuery = pick(flatten(filterQuery), ['city.slug', 'district.slug', 'type'])
		const branchStores = await this.branchStoreRepository.findWithFilter(filterQuery)
		return new ServiceResult(branchStores)
	}

	public async createBranchStore(payload: CreateBranchStoreDTO) {
		const newBranchStore = await this.branchStoreRepository.createOne(payload)
		if (!newBranchStore) {
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.branch_store.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		return new ServiceResult(newBranchStore)
	}

	public async updateBranchStore(id: string, payload: Partial<IBranchStore>) {
		const updatedBranchStore = await this.branchStoreRepository.updateOneById(id, payload)
		if (!updatedBranchStore) {
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.branch_store.updating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		return new ServiceResult(updatedBranchStore)
	}
	public async deleteBranchStore(id: string) {
		const deletedBranchStore = await this.branchStoreRepository.deleteOneById(id)
		if (!deletedBranchStore) {
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.branch_store.deleting'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		return new ServiceResult(deletedBranchStore)
	}
}
