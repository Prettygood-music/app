import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

//export const router = new Hono().get('/hello', (c) => c.json({ message: 'hello world' }));
export const router = new Hono().get('/hello', (c) => {
    console.log(c.req.header())
	return c.json({ message: 'hello world', env: c.env || 'no locals' });
});
export const api = new Hono().route('/api', router);

export type Router = typeof router;
