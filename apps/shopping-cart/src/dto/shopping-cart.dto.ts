import z from 'zod'

const cartItemSchema = z.object({
	_id: z.string(),
	name: z.string(),
	thumbnail: z.string()
})
