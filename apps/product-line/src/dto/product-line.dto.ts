import { z } from 'zod'

export const ProductLineValidator = z.object({
	name: z.string()
})

export type ProductLineDTO = z.infer<typeof ProductLineValidator>
