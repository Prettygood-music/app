import type { Track } from './player';
import { z } from 'zod';
import type { Database } from '@prettygood/database';
/*
export interface Artist {
	id: string;
	artist_name: string;
	bio: string | null;
	avatar_url: string | null;
	cover_url: string | null;
	socials: {
		website?: string;
		twitter?: string;
		instagram?: string;
	};
}*/
export type Artist = Database['public']['Tables']['artists']['Row'];
/**
 * Artist with detailed information
 */
export interface ArtistWithDetails extends Artist {
	createdAt: string;
	trackCount: number;
	albumCount: number;
	recentTracks: Track[];
}

/**
 * Artist request validators
 */
export const ArtistSchema = z.object({
	id: z.string().uuid(),
	artistName: z.string().min(2).max(100),
	bio: z.string().max(500).nullable(),
	profileImage: z.string().url().nullable(),
	walletAddress: z.string()
});

export const ArtistWithDetailsSchema = ArtistSchema.extend({
	createdAt: z.string(),
	trackCount: z.number().int(),
	albumCount: z.number().int(),
	recentTracks: z.array(
		z.object({
			id: z.string().uuid(),
			title: z.string(),
			duration: z.number().int(),
			coverImage: z.string().url().nullable()
		})
	)
});

/**
 * Artist update request schema
 */
export const ArtistUpdateSchema = z.object({
	artistName: z.string().min(2).max(100),
	bio: z.string().max(500).optional(),
	profileImage: z.string().url().optional()
});

/**
 * Response wrappers
 */
export interface ArtistListResponse {
	artists: Artist[];
	total: number;
}

export interface ArtistDetailResponse {
	artist: ArtistWithDetails;
}
