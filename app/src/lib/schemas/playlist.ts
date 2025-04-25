import { z } from 'zod';

export const playlistCreationSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional().nullable(),
	isPublic: z.boolean().default(false),
	cover_image: z.instanceof(File).optional().nullable()
});

export type PlaylistCreationSchema = z.infer<typeof playlistCreationSchema>;

