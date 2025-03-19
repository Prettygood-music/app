import { Hono } from 'hono';
import { artistsRouter } from './artists';
import { albumsRouter } from './albums';
import { tracksRouter } from './tracks';
import { recommendationsRouter } from './recommendations';

type LocalsEnv = {
	Bindings: Record<string, unknown>;
	Variables: { locals: App.Locals };
};

export const router = new Hono<LocalsEnv>().get('/hello', (c) => {
	console.log(c.req.header());
	return c.json({ message: 'hello world', env: c.env.locals || 'no locals' });
});
export const api = new Hono()
	.basePath('/api')
	.route('/artists', artistsRouter)
	.route('/albums', albumsRouter)
	.route('/tracks', tracksRouter)
	.route('/recommendations', recommendationsRouter);

export type Router = typeof api;
