import { isAfter, isValid, parse } from 'date-fns'
import { isValidObjectId } from 'mongoose'
import { z } from 'zod'
import { DiscountApplyingMethod, DiscountTypeEnum } from '../constants/discount.contant'

export const DiscountValidator = z.object({
	name: z.record(z.enum(['vi', 'en']), z.string({ required_error: '' })),
	discount_code: z.string({ required_error: '"discount_code" is required' }),
	discount_type: z.nativeEnum(DiscountTypeEnum),
	discount_value: z.number({ required_error: '"discount_value" is required' }),
	applying_method: z.nativeEnum(DiscountApplyingMethod),
	start_date: z
		.string({ required_error: '"start_date" is required' })
		.refine(
			(value) => isValid(parse(value, 'yyyy-MM-dd', new Date())),
			'"start_date" is invalid date'
		)
		.transform((value) => new Date(value)),
	end_date: z
		.string({ required_error: '"end_date" is required' })
		.refine(
			(value) => isValid(parse(value, 'yyyy-MM-dd', new Date())),
			'"end_date" is invalid date'
		)
		.transform((value) => new Date(value)),
	quantity: z.number({ required_error: '"quantity" is required' }),
	applied_for_products: z
		.array(
			z.string().refine((value) => isValidObjectId(value), { message: 'Invalid product ID' })
		)
		.optional()
		.nullable(),
	min_order_value: z.number({ required_error: 'Min order value is required' }),
	max_use_times: z.number({ required_error: '"max_use_times" is required' })
})

const CreateDiscountValidator = DiscountValidator.refine(
	(values) => isAfter(values.end_date, values.start_date),
	{
		path: ['endDate'],
		message: 'End date of discount code must be after start date'
	}
).refine((values) => {
	if (values.discount_type === DiscountTypeEnum.BY_PERCENTAGE)
		return values.discount_value > 0 && values.discount_value < 1
	else return values.discount_value > 0
})

export const UpdateDiscountValidator = DiscountValidator.partial()
	.refine((values) => isAfter(values.end_date, values.start_date), {
		path: ['endDate'],
		message: 'End date of discount code must be after start date'
	})
	.refine((values) => {
		if (values.discount_type === DiscountTypeEnum.BY_PERCENTAGE)
			return values.discount_value > 0 && values.discount_value < 1
		else return values.discount_value > 0
	})

export type DiscountDTO = z.infer<typeof CreateDiscountValidator>
export type PartialDiscountDTO = z.infer<typeof UpdateDiscountValidator>
