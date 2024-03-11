import mongoose from 'mongoose'
import { z } from 'zod'
import { ProductStatus, ProductTypeEnum } from '../constants/product.constant'

export const productValidator = z.object({
	name: z.string({ required_error: '"name" is required' }),
	description: z.object({
		vi: z.string(),
		en: z.string()
	}),
	status: z.nativeEnum(ProductStatus),
	product_type: z.nativeEnum(ProductTypeEnum),
	price: z.number().positive(),
	attributes: z.record(z.string(), z.any()),
	sku: z.string().optional(),
	thumbnail: z.string(),
	gallery_images: z.array(z.string()).optional().default([]),
	is_draft: z.boolean().default(true),
	is_published: z.boolean().default(false),
	collection: z.string().refine((value) => mongoose.isValidObjectId(value), {
		message: 'Value of "collection" is an invalid Mongo ID'
	}),
	product_line: z.string().refine((value) => mongoose.isValidObjectId(value), {
		message: 'Value of "productLine" is an invalid Mongo ID'
	}),
	variants: z
		.array(
			z.string().refine((value) => mongoose.isValidObjectId(value), {
				message: 'Value of "collection" is an invalid Mongo ID'
			})
		)
		.default([])
})

export type ProductDTO = z.infer<typeof productValidator>
