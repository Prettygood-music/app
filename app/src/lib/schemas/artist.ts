import { z } from 'zod';

export const schema = z.object({
	name: z.string(),
	bio: z.string().optional(),
	genre: z.array(z.string()).default([]),
	location: z.string().optional(),
	//social: z.string(),
	website: z.string().optional(),

	avatar: z.instanceof(File).optional().nullable(),
	// socials
	twitter: z.string().optional(),
	instagram: z.string().optional()
});

export type Schema = z.infer<typeof schema>;
