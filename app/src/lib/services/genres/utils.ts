/**
 * Genres Service - Utility Functions
 */

import { createClient } from '@prettygood/database';
import type { PopularityPeriod } from './types';
import { PUBLIC_POSTGREST_URL } from '$env/static/public';

/**
 * Gets a PostgREST client instance
 */
export const getClient = () => {
	const postgrestUrl = PUBLIC_POSTGREST_URL;
	if (!postgrestUrl) {
		throw new Error('PostgREST URL not defined in environment variables');
	}
	return createClient(postgrestUrl);
};

/**
 * Calculates start and end dates based on a time period for popularity metrics
 */
export const getDateRange = (period: PopularityPeriod): { startDate: string; endDate: string } => {
	const now = new Date();
	const endDate = now.toISOString();
	let startDate: Date;

	switch (period) {
		case 'day':
			startDate = new Date(now);
			startDate.setDate(now.getDate() - 1);
			break;
		case 'week':
			startDate = new Date(now);
			startDate.setDate(now.getDate() - 7);
			break;
		case 'month':
			startDate = new Date(now);
			startDate.setMonth(now.getMonth() - 1);
			break;
		case 'year':
			startDate = new Date(now);
			startDate.setFullYear(now.getFullYear() - 1);
			break;
		default: // 'all'
			startDate = new Date(0); // Beginning of time
			break;
	}

	return { startDate: startDate.toISOString(), endDate };
};

/**
 * Format a duration in seconds to MM:SS format
 */
export const formatDuration = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format a date string to a readable format
 */
export const formatReleaseDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

/**
 * Generate a random color for genres that don't have one
 */
export const generateRandomColor = (): string => {
	const colors = [
		'#E53935', // Red
		'#D81B60', // Pink
		'#8E24AA', // Purple
		'#5E35B1', // Deep Purple
		'#3949AB', // Indigo
		'#1E88E5', // Blue
		'#039BE5', // Light Blue
		'#00ACC1', // Cyan
		'#00897B', // Teal
		'#43A047', // Green
		'#7CB342', // Light Green
		'#C0CA33', // Lime
		'#FDD835', // Yellow
		'#FFB300', // Amber
		'#FB8C00', // Orange
		'#F4511E' // Deep Orange
	];

	return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Slugify a genre name for URLs
 */
export const slugify = (text: string): string => {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word characters
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
};
