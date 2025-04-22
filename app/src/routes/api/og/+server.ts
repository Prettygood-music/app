import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import NotoSans from '$lib/assets/fonts/NotoSans-Regular.ttf';
import { read } from '$app/server';
import { html as toReactNode } from 'satori-html';
import { render } from 'svelte/server';

import BaseOg from '$lib/components/app/templates/og/Base/BaseOG.svelte';
import type { SvelteComponent } from 'svelte';

const fontData = read(NotoSans).arrayBuffer();

const height = 630;
const width = 1200;

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
	const result = render(BaseOg, {
		props: {
			message: 'Pretty Good.Music'
		}
	});
	//console.log(Object.keys(result));
	//const element = toReactNode(`${result.html}<style>${result.css.code}</style>`);

	const markup = toReactNode(`${result.body}`);

	const svg = await satori(markup, {
		fonts: [
			{
				name: 'Noto Sans',
				data: await fontData,
				style: 'normal'
			}
		],
		height,
		width
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width
		}
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png'
		}
	});
};
