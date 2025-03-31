/**
 * Analytics Service - Type Definitions
 * 
 * This file contains TypeScript interfaces and types for the analytics service.
 */

// Type for the period parameter
export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'year' | 'all';

// Interface for play count data
export interface PlayCountData {
	total: number;
	byPeriod: {
		period: string;
		count: number;
	}[];
	byTrack?: {
		trackId: string;
		trackTitle: string;
		count: number;
	}[];
}

// Interface for follower stats
export interface FollowerStats {
	totalFollowers: number;
	followersTrend: number;
	newFollowers: {
		period: string;
		count: number;
	}[];
}

// Interface for earnings data
export interface EarningsData {
	totalEarnings: number;
	earningsTrend: number;
	byPeriod: {
		period: string;
		amount: number;
	}[];
	byPaymentType: {
		type: string;
		amount: number;
	}[];
	recentTransactions: {
		id: string;
		date: string;
		amount: number;
		type: string;
		senderId?: string;
		senderName?: string;
	}[];
}

// Interface for geographic data
export interface GeoData {
	countryCode: string;
	countryName: string;
	playCount: number;
	percentage: number;
}

// Interface for traffic source data
export interface TrafficSourceData {
	source: string;
	count: number;
	percentage: number;
}

// Interface for dashboard overview data
export interface DashboardData {
	totalPlays: number;
	playsTrend: string;
	followers: number;
	followersTrend: string;
	totalEarnings: number;
	earningsTrend: string;
	recentTips: number;
	tipsTrend: string;
	recentActivity: {
		type: 'play' | 'follow' | 'tip';
		content: string;
		time: string;
		timestamp: Date;
	}[];
}

// Interface for track performance data
export interface TrackPerformanceData {
	id: string;
	title: string;
	albumId?: string;
	albumTitle?: string;
	coverUrl?: string;
	releaseDate?: string;
	playCount: number;
	trend: number;
	duration: number;
}

// Interface for engagement metrics
export interface EngagementData {
	saves: number;
	shares: number;
	playlists: number;
	saveRate: number;
	averageDuration: number;
	completionRate: number;
}

// Interface for comparing time periods
export interface ComparisonData {
	currentPeriod: {
		plays: number;
		followers: number;
		earnings: number;
	};
	previousPeriod: {
		plays: number;
		followers: number;
		earnings: number;
	};
	percentChange: {
		plays: number;
		followers: number;
		earnings: number;
	};
}
