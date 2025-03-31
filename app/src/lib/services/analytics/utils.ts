/**
 * Analytics Service - Utility Functions
 * 
 * This file contains helper functions used by the analytics service.
 */

import { createClient } from '@prettygood/database';
import type { AnalyticsPeriod } from './types';

/**
 * Gets a PostgREST client instance
 */
export const getClient = () => {
  const postgrestUrl = import.meta.env.VITE_POSTGREST_URL;
  if (!postgrestUrl) {
    throw new Error('PostgREST URL not defined in environment variables');
  }
  return createClient(postgrestUrl);
};

/**
 * Formats a date as a "time ago" string (e.g., "5 minutes ago")
 */
export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

/**
 * Calculates start and end dates based on a time period
 */
export const getDateRange = (period: AnalyticsPeriod): { startDate: string; endDate: string } => {
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
 * Converts country codes to full country names
 */
export const getCountryName = (countryCode: string): string => {
  const countryMap: Record<string, string> = {
    US: 'United States',
    GB: 'United Kingdom',
    DE: 'Germany',
    CA: 'Canada',
    FR: 'France',
    JP: 'Japan',
    AU: 'Australia',
    IT: 'Italy',
    ES: 'Spain',
    BR: 'Brazil',
    MX: 'Mexico',
    IN: 'India',
    CN: 'China',
    RU: 'Russia',
    NL: 'Netherlands',
    SE: 'Sweden',
    NO: 'Norway',
    DK: 'Denmark',
    FI: 'Finland',
    PT: 'Portugal',
    CH: 'Switzerland',
    AT: 'Austria',
    BE: 'Belgium',
    IE: 'Ireland',
    NZ: 'New Zealand',
    SG: 'Singapore',
    HK: 'Hong Kong',
    KR: 'South Korea',
    ZA: 'South Africa',
    AE: 'United Arab Emirates'
  };
  
  return countryMap[countryCode] || countryCode;
};

/**
 * Calculates the percentage change between two values
 */
export const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Format a percentage change as a string with + or - sign
 */
export const formatPercentChange = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value}%`;
};
