import { isValid } from 'date-fns'
import { z } from 'zod'

export const ProductCollectionValidator = z.object({
	name: z.string(),
	release_date: z
		.date()
		.or(z.string())
		.optional()
		.default(new Date())
		.refine((value) => isValid(value))
})

export type ProductCollectionDTO = z.infer<typeof ProductCollectionValidator>
