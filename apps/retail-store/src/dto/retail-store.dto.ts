import { z } from 'zod'
import { Areas, RetailStoreTypeEnum } from '../constants/retail-store.constant'

export const RetailStoreValidator = z.object({
	name: z.string(),
	area: z.enum(Areas),
	address: z.string(),
	hotline: z.string(),
	open_time: z.string(),
	close_time: z.string(),
	type: z.nativeEnum(RetailStoreTypeEnum),
	google_map_coordinate: z
		.object({ latitude: z.number(), longtitude: z.number() })
		.nullable()
		.default(null)
})

export type RetailStoreDTO = z.infer<typeof RetailStoreValidator>
