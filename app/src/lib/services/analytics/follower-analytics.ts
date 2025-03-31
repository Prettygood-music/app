/**
 * Analytics Service - Follower Analytics Functions
 *
 * This file contains functions related to follower statistics and analysis.
 */

import type { FollowerStats, AnalyticsPeriod } from './types';
import { getClient, getDateRange, calculatePercentChange } from './utils';

/**
 * Get follower statistics for an artist
 */
export const getFollowerStats = async (
	artistId: string,
	period: AnalyticsPeriod = 'all'
): Promise<FollowerStats> => {
	const db = getClient();
	const { startDate, endDate } = getDateRange(period);

	try {
		// Get total followers count
		const { data: followersData, error: followersError } = await db.rpc(
			'get_artist_followers_count',
			{
				artist_id: artistId
			}
		);

		if (followersError) throw followersError;

		const totalFollowers = parseInt(followersData?.toString() || '0');

		// Get new followers by period using RPC
		let timeFormat = '%Y-%m-%d';
		if (period === 'year') {
			timeFormat = '%Y-%m';
		} else if (period === 'all') {
			timeFormat = '%Y';
		}

		const { data: newFollowersData, error: newFollowersError } = await db.rpc(
			'get_followers_by_period',
			{
				artist_id: artistId,
				start_date: startDate,
				end_date: endDate,
				time_format: timeFormat
			}
		);

		if (newFollowersError) throw newFollowersError;

		// Calculate trend (comparing current period with previous period)
		const previousPeriodStart = new Date(startDate);
		const previousPeriodEnd = new Date(endDate);
		const periodDuration = previousPeriodEnd.getTime() - new Date(startDate).getTime();

		previousPeriodStart.setTime(previousPeriodStart.getTime() - periodDuration);
		previousPeriodEnd.setTime(previousPeriodEnd.getTime() - periodDuration);

		const { data: previousFollowersCount, error: previousFollowersError } = await db.rpc(
			'get_followers_count_for_period',
			{
				artist_id: artistId,
				start_date: previousPeriodStart.toISOString(),
				end_date: previousPeriodEnd.toISOString()
			}
		);

		if (previousFollowersError) throw previousFollowersError;

		const previousPeriodFollowers = parseInt(previousFollowersCount?.toString() || '0');
		const currentPeriodFollowers =
			newFollowersData?.reduce((sum: number, item) => sum + parseInt(item.count.toString()), 0) ||
			0;

		const followersTrend = calculatePercentChange(currentPeriodFollowers, previousPeriodFollowers);

		return {
			totalFollowers,
			followersTrend,
			newFollowers: newFollowersData
				? newFollowersData.map((d) => ({
						period: d.period,
						count: parseInt(d.count.toString())
					}))
				: []
		};
	} catch (error) {
		console.error('Error fetching follower stats:', error);
		throw error;
	}
};
