import mongoose from 'mongoose'
import { z } from 'zod'

export const UserTokenValidator = z.object({
	user: z
		.string()
		.refine((value) => mongoose.isValidObjectId(value), { message: 'Invalid mongo ID' }),
	public_key: z.string(),
	private_key: z.string(),
	refresh_token: z.string(),
	used_refresh_tokens: z.array(z.string()).default([])
})

export type UserTokenDTO = z.infer<typeof UserTokenValidator>
