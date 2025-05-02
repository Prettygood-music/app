import { z } from 'zod';

export const schema = z.object({
	address: z.string().regex(/^0x[a-fA-F0-9]{64}$/, {
		message: "Invalid SUI address format. Must be '0x' followed by 64 hexadecimal characters."
	})
});

export type Schema = z.infer<typeof schema>;
