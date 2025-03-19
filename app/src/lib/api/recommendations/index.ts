// server/src/controllers/recommendations/index.ts
import { Hono } from 'hono';
import { tracksRouter } from './tracks';

export const recommendationsRouter = new Hono().route('/tracks', tracksRouter);
