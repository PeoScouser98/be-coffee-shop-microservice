import { z } from 'zod'

export const PostValidator = z.object({
	title: z.string({ required_error: '"title" is required' }).max(60),
	content: z.string({ required_error: '"content" is required' }),
	thumbnail: z
		.string({ required_error: '"thumbnail" is required' })
		.url({ message: 'Invalid thumbnail url' }),
	creator: z.string({ required_error: '"creator" is required' }),
	is_draft: z.boolean().optional(),
	is_published: z.boolean().optional(),
	published_at: z.date().nullable().optional()
})

export type PostDTO = z.infer<typeof PostValidator>
