import { ServiceResult } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { FilterQuery } from 'mongoose'
import { RetailStoreRepository } from './retail-store.repository'
import { RetailStoreDTO } from './dto/retail-store.dto'
import { IRetailStore } from './interfaces/retail-store.interface'
import { I18nService } from '@app/i18n'

@Injectable()
export class RetailStoreService {
	constructor(
		@Inject(RetailStoreRepository.provide)
		private readonly retailStoreRepository: RetailStoreRepository,
		private readonly i18nService: I18nService
	) {}

	public async getAllRetailStore() {
		const allRetailStores = await this.retailStoreRepository.all()
		return new ServiceResult(allRetailStores)
	}

	public async findRetailStore(filterQuery: FilterQuery<IRetailStore>) {
		for (const key in filterQuery) {
			if (!filterQuery[key]) delete filterQuery[key]
		}
		const branchStores = await this.retailStoreRepository.find(filterQuery)
		return new ServiceResult(branchStores)
	}

	public async createRetailStore(payload: RetailStoreDTO) {
		const newBranchStore = await this.retailStoreRepository.create(payload)
		if (!newBranchStore) {
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.retail_store.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		return new ServiceResult(newBranchStore)
	}

	public async updateRetailStore(id: string, payload: Partial<RetailStoreDTO>) {
		const updatedBranchStore = await this.retailStoreRepository.findByIdAndUpdate(id, payload)
		if (!updatedBranchStore) {
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.retail_store.updating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		return new ServiceResult(updatedBranchStore)
	}

	public async deleteRetailStore(id: string) {
		const deletedBranchStore = await this.retailStoreRepository.findAndDeleteById(id)
		if (!deletedBranchStore) {
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.retail_store.deleting'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		return new ServiceResult(deletedBranchStore)
	}
}
