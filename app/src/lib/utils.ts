import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import mime from 'mime-types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number | null): string {
	if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';

	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Generate a gradient background based on the playlist title
export function generateGradient(title: string): string {
	// Simple hash function to generate a consistent color from a string
	const hash = title.split('').reduce((acc, char) => {
		return char.charCodeAt(0) + ((acc << 5) - acc);
	}, 0);

	const h1 = Math.abs(hash % 360);
	const h2 = (h1 + 40) % 360;

	return `linear-gradient(135deg, hsl(${h1}, 70%, 60%), hsl(${h2}, 70%, 50%))`;
}

/**
 * Generates a gradient image data URL from a string input
 *
 * @param title - The string to generate the gradient from
 * @param width - Width of the generated image (default: 200)
 * @param height - Height of the generated image (default: 200)
 * @returns A data URL that can be used directly in an img src attribute
 */
export function generateGradientDataURL(
	title: string,
	width: number = 200,
	height: number = 200
): string {
	// Simple hash function to generate a consistent color from a string
	const hash = title.split('').reduce((acc, char) => {
		return char.charCodeAt(0) + ((acc << 5) - acc);
	}, 0);

	const h1 = Math.abs(hash % 360);
	const h2 = (h1 + 40) % 360;

	// Create an SVG with the gradient
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:hsl(${h1}, 70%, 60%);stop-opacity:1" /><stop offset="100%" style="stop-color:hsl(${h2}, 70%, 50%);stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)" /></svg>`;

	// URL-encode the SVG
	const encodedSVG = encodeURIComponent(svg);

	// Return as data URL
	return `data:image/svg+xml,${encodedSVG}`;
}

/**
 * Generates a unique file name by appending a UUID to the file's extension.
 *
 * @param file - The file for which a unique name is to be generated.
 * @returns A promise that resolves to a unique file name string in the format `<UUID>.<extension>`.
 *
 * @remarks
 * - The file's extension is derived from its name using the `mime.extension` method.
 * - A UUID is generated using `crypto.randomUUID()` to ensure uniqueness.
 */
export async function makeUniqueName(file: File) {
	const extension = mime.extension(file.name);
	const uuid = crypto.randomUUID();
	const fileName = `${uuid}.${extension}`;
	return fileName;
}



export function makeExplorerLink(digest: string){
	return `https://testnet.suivision.xyz/txblock/${digest}`;
}