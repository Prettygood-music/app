import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { unknown, z } from 'zod';

type LocalsEnv = {
	Bindings: Record<string, unknown>;
	Variables: { locals: App.Locals };
};

//export const router = new Hono().get('/hello', (c) => c.json({ message: 'hello world' }));
export const router = new Hono<LocalsEnv>().get('/hello', (c) => {
	console.log(c.req.header());
	return c.json({ message: 'hello world', env: c.env.locals || 'no locals' });
});
export const api = new Hono().route('/api', router);

export type Router = typeof router;
