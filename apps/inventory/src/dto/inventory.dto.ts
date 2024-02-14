import mongoose from 'mongoose'
import { z } from 'zod'

export const InventoryValidator = z.object({
	product: z
		.string()
		.refine((value) => mongoose.isValidObjectId(value), { message: 'Invalid Mongo ID' }),
	store: z
		.string()
		.refine((value) => mongoose.isValidObjectId(value), { message: 'Invalid Mongo ID' }),
	stock: z.number().positive(),
	reservation: z.array(z.any()).default([])
})

export type InventoryDTO = z.infer<typeof InventoryValidator>
