import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
	emailOrUsername: z.string().min(1, 'Email or username is required'),
	password: z.string().min(1, 'Password is required'),
	rememberMe: z.boolean().optional().default(false)
});

export type LoginSchema = typeof loginSchema;
