import mongoose from 'mongoose'
import { z } from 'zod'

export const InventoryValidator = z.object({
	product: z
		.string()
		.refine((value) => mongoose.isValidObjectId(value), { message: 'Invalid Mongo ID' })
		.transform((value) => new mongoose.Types.ObjectId(value)),
	store: z
		.string()
		.refine((value) => mongoose.isValidObjectId(value), { message: 'Invalid Mongo ID' })
		.transform((value) => new mongoose.Types.ObjectId(value)),
	stock: z.number().positive(),
	reservation: z.array(z.any()).default([])
})

export type InventoryDTO = z.infer<typeof InventoryValidator>
