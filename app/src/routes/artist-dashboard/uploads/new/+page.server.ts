import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import { trackCreationSchema } from '$lib/schemas/trackSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';


export const load: PageServerLoad = async ({ locals }) => {
  // Get the current user ID from the session
  const userId = locals.user?.id;
  if (!userId) {
    return {
      albums: []
    };
  }

  try {
    const { db } = locals;
    
    // Fetch albums created by the current artist
    // Note: This is a placeholder - adjust to match your actual database client
    const albums = await db.query.albums.findMany({
      where: (albums, { eq }) => eq(albums.artist_id, userId),
      columns: {
        id: true,
        title: true
      }
    });
    
    return {
      albums
    };
  } catch (error) {
    console.error('Error fetching albums:', error);
    return {
      albums: []
    };
  }
};



export const actions: Actions = {
  default: async(event) => {
    const form = await superValidate(event, zod(trackCreationSchema));
    


    if (!form.valid) {
			return fail(400, {
				form
			});
		}
    // TODO: implement saving track to database


    

  }
}
