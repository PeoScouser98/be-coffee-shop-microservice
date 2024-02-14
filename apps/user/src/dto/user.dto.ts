import { z } from 'zod'

export const UserValidator = z.object({
	email: z.string().email(),
	password: z.string(),
	displayName: z.string(),
	phone: z.string(),
	address: z.string()
})

export type UserDTO = z.infer<typeof UserValidator>
