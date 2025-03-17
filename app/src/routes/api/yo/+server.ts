import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({locals,params}) => {
    console.dir(params)
    //return new Response();
    return json({ message: 'hello world', locals });
};