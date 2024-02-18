import { z } from 'zod'
import { Cities } from '../constants/retail-store.constant'

export const RetailChainValidator = z.object({
	name: z.string(),
	location: z.enum(Cities),
	address: z.string(),
	hotline: z.string(),
	open_time: z.string(),
	close_time: z.string(),
	google_map_coordinate: z
		.object({ latitude: z.number(), longtitude: z.number() })
		.nullable()
		.default(null)
})

export type BranchStoreDTO = z.infer<typeof RetailChainValidator>
