import { RetailStoreTypeEnum } from '../constants/retail-store.constant'

export declare interface IRetailStore {
	name: string
	slug: string
	address: string
	hotline: string
	open_time: string
	store_type: RetailStoreTypeEnum
	google_map_coordinate: Record<'latitude' | 'longtitude', number>
}
