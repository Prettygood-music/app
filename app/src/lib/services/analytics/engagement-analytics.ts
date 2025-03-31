/**
 * Analytics Service - Engagement Analytics Functions
 * 
 * This file contains functions related to engagement and audience metrics.
 */

import type { EngagementData, AnalyticsPeriod, ComparisonData } from './types';
import { getClient, getDateRange, calculatePercentChange } from './utils';
import { getPlayCounts } from './play-analytics';
import { getFollowerStats } from './follower-analytics';
import { getEarningsData } from './earnings-analytics';

/**
 * Get engagement metrics for artist content
 */
export const getEngagementMetrics = async (
  artistId: string,
  period: AnalyticsPeriod = 'all'
): Promise<EngagementData> => {
  const db = getClient();
  const { startDate, endDate } = getDateRange(period);

  try {
    // Get track IDs first
    const { data: trackIds, error: trackIdsError } = await db
      .from('tracks')
      .select('id')
      .eq('artist_id', artistId);

    if (trackIdsError) throw trackIdsError;
    
    const trackIdValues = trackIds?.map(track => track.id) || [];
    if (trackIdValues.length === 0) {
      return {
        saves: 0,
        shares: 0,
        playlists: 0,
        saveRate: 0,
        averageDuration: 0,
        completionRate: 0
      };
    }

    // Get track saves count using RPC
    const { data: savesData, error: savesError } = await db.rpc('get_track_saves_count', {
      track_ids: trackIdValues,
      start_date: startDate,
      end_date: endDate
    });

    if (savesError) throw savesError;

    // Get tracks in playlists count using RPC
    const { data: playlistsData, error: playlistsError } = await db.rpc('get_track_playlists_count', {
      track_ids: trackIdValues,
      start_date: startDate,
      end_date: endDate
    });

    if (playlistsError) throw playlistsError;

    // Get total play count for save rate calculation
    const { data: playsData, error: playsError } = await db.rpc('get_tracks_play_count', {
      track_ids: trackIdValues,
      start_date: startDate,
      end_date: endDate
    });

    if (playsError) throw playsError;

    // Get average play duration and completion rate using RPC
    const { data: durationData, error: durationError } = await db.rpc('get_play_duration_stats', {
      track_ids: trackIdValues,
      start_date: startDate,
      end_date: endDate
    });

    if (durationError) throw durationError;

    // Calculate metrics
    const saves = parseInt(savesData?.toString() || '0');
    const playlists = parseInt(playlistsData?.toString() || '0');
    const totalPlays = parseInt(playsData?.toString() || '0');
    const saveRate = totalPlays > 0 ? Math.round((saves / totalPlays) * 100) : 0;
    
    // Extract values from duration data
    // durationData is expected to be an array with a single row
    const durationRow = durationData && durationData.length > 0 ? durationData[0] : null;
    
    const avgDuration = durationRow?.avg_duration 
      ? parseFloat(durationRow.avg_duration.toString()) 
      : 0;
      
    const completedCount = durationRow?.completed_count 
      ? parseInt(durationRow.completed_count.toString()) 
      : 0;
      
    const totalCount = durationRow?.total_count 
      ? parseInt(durationRow.total_count.toString()) 
      : 0;
      
    const completionRate = totalCount > 0 
      ? Math.round((completedCount / totalCount) * 100) 
      : 0;

    // For shares, we don't have actual data yet, so use a placeholder
    const shares = Math.floor(totalPlays * 0.05); // Placeholder: assume ~5% share rate

    return {
      saves,
      shares,
      playlists,
      saveRate,
      averageDuration: Math.round(avgDuration),
      completionRate
    };
  } catch (error) {
    console.error('Error fetching engagement metrics:', error);
    throw error;
  }
};

/**
 * Compare current period with previous period
 */
export const getPeriodComparison = async (
  artistId: string,
  period: AnalyticsPeriod = 'month'
): Promise<ComparisonData> => {
  const { startDate, endDate } = getDateRange(period);

  // Calculate previous period dates
  const currentStart = new Date(startDate);
  const currentEnd = new Date(endDate);
  const periodDuration = currentEnd.getTime() - currentStart.getTime();

  const previousStart = new Date(currentStart.getTime() - periodDuration);
  const previousEnd = new Date(currentStart);

  try {
    // Get data for current period
    const currentPlaysData = await getPlayCounts(artistId, period);
    const followerData = await getFollowerStats(artistId, period);
    const earningsData = await getEarningsData(artistId, period);
    
    // Create custom period for previous time range
    const customPreviousPeriod: AnalyticsPeriod = 'all'; // We'll filter manually with dates
    
    // Get data for previous period
    const db = getClient();
    
    // Get previous plays
    const { data: previousPlaysCount, error: previousPlaysError } = await db.rpc('get_plays_for_period', {
      artist_id: artistId,
      start_date: previousStart.toISOString(),
      end_date: previousEnd.toISOString()
    });
    
    if (previousPlaysError) throw previousPlaysError;
    
    // Get previous followers
    const { data: previousFollowersCount, error: previousFollowersError } = await db.rpc('get_followers_count_for_period', {
      artist_id: artistId,
      start_date: previousStart.toISOString(),
      end_date: previousEnd.toISOString()
    });
    
    if (previousFollowersError) throw previousFollowersError;
    
    // Get previous earnings
    const { data: previousEarningsData, error: previousEarningsError } = await db.rpc('get_earnings_for_period', {
      artist_id: artistId,
      start_date: previousStart.toISOString(),
      end_date: previousEnd.toISOString()
    });
    
    if (previousEarningsError) throw previousEarningsError;

    // Extract values
    const currentPlays = currentPlaysData.total;
    const currentFollowers = followerData.totalFollowers;
    const currentEarnings = earningsData.totalEarnings;
    
    const previousPlays = parseInt(previousPlaysCount?.toString() || '0');
    const previousFollowers = parseInt(previousFollowersCount?.toString() || '0');
    const previousEarnings = parseFloat(previousEarningsData?.toString() || '0');

    // Calculate percent changes
    const playsChange = calculatePercentChange(currentPlays, previousPlays);
    const followersChange = calculatePercentChange(currentFollowers, previousFollowers);
    const earningsChange = calculatePercentChange(currentEarnings, previousEarnings);

    return {
      currentPeriod: {
        plays: currentPlays,
        followers: currentFollowers,
        earnings: currentEarnings
      },
      previousPeriod: {
        plays: previousPlays,
        followers: previousFollowers,
        earnings: previousEarnings
      },
      percentChange: {
        plays: playsChange,
        followers: followersChange,
        earnings: earningsChange
      }
    };
  } catch (error) {
    console.error('Error calculating period comparison:', error);
    throw error;
  }
};
