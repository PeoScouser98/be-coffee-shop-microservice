import { z } from 'zod'

export const productLineValidator = z.object({
	name: z.string()
})

export type ProductLineDTO = z.infer<typeof productLineValidator>
