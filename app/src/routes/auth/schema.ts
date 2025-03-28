import { z } from 'zod';

// Define registration schema
export const registerSchema = z
	.object({
		email: z.string().email('Please enter a valid email address'),
		username: z
			.string()
			.min(3, 'Username must be at least 3 characters')
			.max(20, 'Username cannot exceed 20 characters')
			.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z.string(),
		displayName: z.string().optional(),
		terms: z.enum(['on']).optional()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	})
	.refine((data) => data.terms === 'on', {
		message: 'You must accept the terms and conditions',
		path: ['terms']
	});

export type RegisterSchema = typeof registerSchema;
