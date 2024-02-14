import { BranchStoreTypeEnum } from '../constants/branch-store.constant'

export declare interface IBranchStore {
	name: string
	slug: string
	address: string
	hotline: string
	open_time: string
	store_type: BranchStoreTypeEnum
	google_map_coordinate: Record<'latitude' | 'longtitude', number>
}
