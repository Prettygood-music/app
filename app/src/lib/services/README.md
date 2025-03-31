# Services

This directory contains service modules that handle data fetching, processing, and business logic for the application.

## Available Services

### Analytics Service

The Analytics Service (`analytics/`) provides functions to fetch and analyze data for the artist dashboard, including play counts, follower stats, earnings data, and aggregated metrics.

#### Structure

The analytics service is split into modular files:

- `types.ts` - Type definitions and interfaces
- `utils.ts` - Utility functions and helpers
- `play-analytics.ts` - Functions for track play data
- `follower-analytics.ts` - Functions for follower statistics
- `earnings-analytics.ts` - Functions for earnings and financial data
- `engagement-analytics.ts` - Functions for engagement and audience metrics
- `dashboard-analytics.ts` - Functions for the dashboard overview
- `index.ts` - Main export file

#### Usage

```typescript
import { 
  getPlayCounts, 
  getFollowerStats, 
  getEarningsData, 
  getDashboardData,
  getTracksPerformance,
  getGeoDistribution,
  getTrafficSources,
  getEngagementMetrics,
  getPeriodComparison,
  type AnalyticsPeriod
} from '$lib/services';

// Example: Get dashboard overview data
const artistId = 'your-artist-id';
const period: AnalyticsPeriod = 'week'; // 'day', 'week', 'month', 'year', or 'all'

try {
  const dashboardData = await getDashboardData(artistId, period);
  
  // Use the data in your component
  console.log('Total plays:', dashboardData.totalPlays);
  console.log('Total followers:', dashboardData.followers);
  console.log('Recent activity:', dashboardData.recentActivity);
} catch (error) {
  console.error('Error fetching dashboard data:', error);
}
```

#### Available Functions

| Function | Description |
|----------|-------------|
| `getPlayCounts` | Get play count data for an artist within a date range |
| `getFollowerStats` | Get follower statistics for an artist |
| `getEarningsData` | Get earnings data for an artist within a date range |
| `getDashboardData` | Get aggregated data for the dashboard overview page |
| `getTracksPerformance` | Get performance data for an artist's tracks |
| `getGeoDistribution` | Get geographic distribution of listeners |
| `getTrafficSources` | Get sources of traffic (where plays originate from) |
| `getEngagementMetrics` | Get engagement metrics for artist content |
| `getPeriodComparison` | Compare current period with previous period |

#### Data Interfaces

The service exports several TypeScript interfaces that define the shape of the data:

- `PlayCountData` - Play count statistics
- `FollowerStats` - Follower statistics
- `EarningsData` - Earnings and financial data
- `DashboardData` - Aggregated dashboard overview data
- `TrackPerformanceData` - Track performance statistics
- `GeoData` - Geographic distribution data
- `TrafficSourceData` - Traffic source statistics
- `EngagementData` - Engagement metrics
- `ComparisonData` - Period comparison data

#### Period Parameter

All functions accept an optional `period` parameter that determines the time range for the data:

- `'day'` - Past 24 hours
- `'week'` - Past 7 days
- `'month'` - Past 30 days
- `'year'` - Past 12 months
- `'all'` - All time (default for most functions)

## Future Services

- Content Management Service - For managing tracks, albums, and uploads
- Wallet Service - For blockchain and wallet functionality
- User Service - For user profile and settings management
