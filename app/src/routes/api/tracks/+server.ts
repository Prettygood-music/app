import { json } from '@sveltejs/kit';
import { storeFile } from '$lib/server/services/fileStorage';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Get the current user ID from the session
    const userId = locals.user?.id;
    if (!userId) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Extract files
    const audioFile = formData.get('audio_file') as File;
    const coverFile = formData.get('cover_image') as File | null;
    
    // Validate required files
    if (!audioFile) {
      return json({ error: 'Audio file is required' }, { status: 400 });
    }
    
    // Extract and prepare form data
    const trackData = {
      title: formData.get('title') as string,
      album_id: formData.get('album_id') as string || null,
      track_number: formData.get('track_number') ? Number(formData.get('track_number')) : null,
      genre: formData.get('genre') ? JSON.parse(formData.get('genre') as string) : [],
      explicit: formData.get('explicit') === 'true',
      release_date: formData.get('release_date') as string || null,
      isrc: formData.get('isrc') as string || null,
      lyrics: formData.get('lyrics') as string || null,
    };
    
    // Store the audio file
    const audioBuffer = await audioFile.arrayBuffer();
    const audioPath = await storeFile(
      new Uint8Array(audioBuffer),
      'audio',
      audioFile.name
    );
    
    // Store the cover image if provided
    let coverPath = null;
    if (coverFile) {
      const imageBuffer = await coverFile.arrayBuffer();
      coverPath = await storeFile(
        new Uint8Array(imageBuffer),
        'image',
        coverFile.name
      );
    }
    
    // Get the database client from locals
    const { db } = locals;
    
    // Insert the track into the database
    // Note: This is a placeholder - you'll need to adjust this to match your actual database client
    const newTrack = await db.insert('prettygood.tracks').values({
      title: trackData.title,
      artist_id: userId,
      album_id: trackData.album_id,
      duration: 0, // This should be updated with the actual duration after processing
      audio_url: audioPath,
      cover_url: coverPath,
      track_number: trackData.track_number,
      lyrics: trackData.lyrics,
      genre: trackData.genre,
      explicit: trackData.explicit,
      release_date: trackData.release_date ? new Date(trackData.release_date) : null,
      isrc: trackData.isrc,
    }).returning().execute();
    
    return json({ 
      success: true, 
      track: newTrack[0]
    });
  } catch (error) {
    console.error('Error uploading track:', error);
    return json({ 
      error: 'Failed to upload track' 
    }, { status: 500 });
  }
};
