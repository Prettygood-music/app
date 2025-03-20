// server/src/controllers/recommendations/index.ts
import { Hono } from 'hono';
import { tracksRouter } from './tracks';
import { albumsRouter } from './albums';

export const recommendationsRouter = new Hono()
	.route('/tracks', tracksRouter)
	.route('/albums', albumsRouter);
