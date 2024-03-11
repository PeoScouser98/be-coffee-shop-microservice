import { ServiceResult } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { flatten } from 'flat'
import { pick } from 'lodash'
import { FilterQuery } from 'mongoose'
import { RetailStoreRepository } from './retail-store.repository'
import { BranchStoreDTO } from './dto/retail-store.dto'
import { IRetailStore } from './interfaces/retail-store.interface'
import { I18nService } from '@app/i18n'

@Injectable()
export class RetailStoreService {
	constructor(
		@Inject(RetailStoreRepository.provide)
		private readonly branchStoreRepository: RetailStoreRepository,
		private readonly localizationService: I18nService
	) {}

	public async findRetailStore(filterQuery: FilterQuery<IRetailStore>) {
		filterQuery = pick(flatten(filterQuery), ['city.slug', 'district.slug', 'type'])
		const branchStores = await this.branchStoreRepository.findWithFilter(filterQuery)
		return new ServiceResult(branchStores)
	}

	public async createRetailStore(payload: BranchStoreDTO) {
		const newBranchStore = await this.branchStoreRepository.createOne(payload)
		if (!newBranchStore) {
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.retail_store.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		return new ServiceResult(newBranchStore)
	}

	public async updateBranchStore(id: string, payload: Partial<IRetailStore>) {
		const updatedBranchStore = await this.branchStoreRepository.updateOneById(id, payload)
		if (!updatedBranchStore) {
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.retail_store.updating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		return new ServiceResult(updatedBranchStore)
	}
	public async deleteBranchStore(id: string) {
		const deletedBranchStore = await this.branchStoreRepository.deleteOneById(id)
		if (!deletedBranchStore) {
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.retail_store.deleting'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		return new ServiceResult(deletedBranchStore)
	}
}
