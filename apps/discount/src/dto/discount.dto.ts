import { z } from 'zod'
import { DiscountTypeEnum } from '../constants/discount.contant'
import { isAfter } from 'date-fns'
import { isValidObjectId } from 'mongoose'

export const DiscountValidator = z
	.object({
		name: z.record(z.enum(['vi', 'en']), z.string({ required_error: '' })),
		discount_code: z.string({ required_error: '"discount_code" is required' }),
		discount_type: z.nativeEnum(DiscountTypeEnum),
		start_date: z
			.date({ required_error: '"start_date" is required' })
			.refine((value) => isAfter(value, new Date()), {
				message: 'Start date must be after today'
			}),
		end_date: z.date({ required_error: '"end_date" is required' }),
		quantity: z.number({ required_error: '"quantity" is required' }),
		applied_for_products: z
			.array(
				z.string().refine((value) => isValidObjectId(value), { message: 'Invalid product ID' })
			)
			.nullable(),
		max_use_times: z.number({ required_error: '"max_use_times" is required' }),
		discount_value: z.number({ required_error: '"discount_value" is required' })
	})
	.refine((values) => isAfter(values.end_date, values.start_date), {
		path: ['endDate'],
		message: 'End date of discount code must be after start date'
	})

export type DiscountDTO = z.infer<typeof DiscountValidator>
