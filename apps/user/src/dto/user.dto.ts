import { z } from 'zod'
import { UserRoles } from '../constants/user.constant'

export const UserValidator = z.object({
	email: z.string().email(),
	password: z.string(),
	display_name: z.string(),
	phone: z.string(),
	address: z.string(),
	role: z.nativeEnum(UserRoles).optional()
})

export type UserDTO = z.infer<typeof UserValidator>
