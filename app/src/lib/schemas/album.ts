import { z } from 'zod';

export const schema = z.object({
	title: z.string().min(1, 'Title is required'),
	genre: z.array(z.string()).default([]),
	release_date: z.string().optional().nullable(),
	description: z.string().optional().nullable(),

	// These will be file uploads
	cover_image: z.instanceof(File).optional().nullable()
});

export type Schema = z.infer<typeof schema>;
