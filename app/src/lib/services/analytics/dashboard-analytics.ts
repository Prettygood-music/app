/**
 * Analytics Service - Dashboard Analytics Functions
 * 
 * This file contains functions for the dashboard overview page.
 */

import type { DashboardData, AnalyticsPeriod } from './types';
import { getClient, getDateRange, getTimeAgo, formatPercentChange } from './utils';
import { getPlayCounts } from './play-analytics';
import { getFollowerStats } from './follower-analytics';
import { getEarningsData } from './earnings-analytics';

/**
 * Get aggregated dashboard data for the overview page
 */
export const getDashboardData = async (
  artistId: string,
  period: AnalyticsPeriod = 'week'
): Promise<DashboardData> => {
  try {
    // Get basic analytics data
    const playData = await getPlayCounts(artistId, period);
    const followerData = await getFollowerStats(artistId, period);
    const earningsData = await getEarningsData(artistId, period);
    
    // Get recent tips count
    const recentTips = earningsData.recentTransactions.filter(tx => tx.type === 'tip').length;
    
    // Calculate tips trend (simple estimation based on earnings trend if we don't have specific data)
    const tipsTrend = formatPercentChange(earningsData.earningsTrend);
    
    // Format other trends for display
    const playsTrend = formatPercentChange(Math.floor(Math.random() * 20) + 5); // Placeholder until we have real trend data
    const followersTrend = formatPercentChange(followerData.followersTrend);
    const earnTrend = formatPercentChange(earningsData.earningsTrend);
    
    // Get recent activity data
    const db = getClient();
    const { startDate } = getDateRange(period);
    
    // First, get the track IDs for this artist
    const { data: artistTracks, error: artistTracksError } = await db
      .from('tracks')
      .select('id')
      .eq('artist_id', artistId);

    if (artistTracksError) throw artistTracksError;
    
    const artistTrackIds = artistTracks?.map(track => track.id) || [];
    if (artistTrackIds.length === 0) {
      // No tracks found, return empty activity
      return {
        totalPlays: 0,
        playsTrend: '+0%',
        followers: 0,
        followersTrend: '+0%',
        totalEarnings: 0,
        earningsTrend: '+0%',
        recentTips: 0,
        tipsTrend: '+0%',
        recentActivity: []
      };
    }

    // Get recent plays
    const { data: recentPlays, error: playsError } = await db.rpc('get_recent_plays', {
      track_ids: artistTrackIds,
      start_date: startDate,
      limit_count: 10
    });

    if (playsError) throw playsError;
    
    // Get recent followers
    const { data: recentFollowers, error: followersError } = await db.rpc('get_recent_followers', {
      artist_id: artistId,
      start_date: startDate,
      limit_count: 5
    });

    if (followersError) throw followersError;
    
    // Get recent tips
    const { data: recentTipsData, error: tipsError } = await db.rpc('get_recent_tips', {
      artist_id: artistId,
      start_date: startDate,
      limit_count: 5
    });

    if (tipsError) throw tipsError;
    
    // Combine all activities
    const activities: DashboardData['recentActivity'] = [];
    
    // Add play activities
    if (recentPlays) {
      recentPlays.forEach((play: any) => {
        activities.push({
          type: 'play',
          content: `${play.username || 'Someone'} played "${play.track_title || 'a track'}"`,
          time: getTimeAgo(new Date(play.played_at)),
          timestamp: new Date(play.played_at)
        });
      });
    }
    
    // Add follower activities
    if (recentFollowers) {
      recentFollowers.forEach((follow: any) => {
        activities.push({
          type: 'follow',
          content: `New follower: ${follow.username || 'Anonymous'}`,
          time: getTimeAgo(new Date(follow.added_at)),
          timestamp: new Date(follow.added_at)
        });
      });
    }
    
    // Add tip activities
    if (recentTipsData) {
      recentTipsData.forEach((tip: any) => {
        activities.push({
          type: 'tip',
          content: `Received a ${tip.amount} SUI tip from ${tip.username || 'Anonymous'}`,
          time: getTimeAgo(new Date(tip.created_at)),
          timestamp: new Date(tip.created_at)
        });
      });
    }
    
    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return {
      totalPlays: playData.total,
      playsTrend,
      followers: followerData.totalFollowers,
      followersTrend,
      totalEarnings: earningsData.totalEarnings,
      earningsTrend: earnTrend,
      recentTips,
      tipsTrend,
      recentActivity: activities.slice(0, 10) // Take only the 10 most recent activities
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
