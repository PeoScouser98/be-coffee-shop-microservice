import { z } from 'zod'

export const RecoverPasswordValidator = z.object({
	email: z.string({ required_error: '"email" is required' })
})

export const ResetPasswordValidator = z.object({
	newPassword: z.string({ required_error: '"password" is required' })
})

export type RecoverPasswordDTO = z.infer<typeof RecoverPasswordValidator>
export type ResetPasswordDTO = z.infer<typeof ResetPasswordValidator>
