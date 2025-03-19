// server/src/controllers/tracks.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { trackRepository } from '$lib/data/repositories/tracks';
import { authMiddleware } from '$lib/hono/middlewares/access';
import { PaginationSchema, SearchSchema } from '$lib/types/schemas';

// Define validation schemas
const TrackCreateSchema = z.object({
  title: z.string().min(1).max(100),
  albumId: z.string().uuid().nullable().optional(),
  coverUrl: z.string().url().nullable().optional(),
  playbackUrl: z.string().url(),
  duration: z.number().int().min(1),
  genres: z.array(z.string()).min(1).max(5),
});

const TrackUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  albumId: z.string().uuid().nullable().optional(),
  coverUrl: z.string().url().nullable().optional(),
  playbackUrl: z.string().url().optional(),
  duration: z.number().int().min(1).optional(),
  genres: z.array(z.string()).min(1).max(5).optional(),
});

// Create Hono router
export const tracksRouter = new Hono()
  // Get all tracks with pagination
  .get('/', zValidator('query', PaginationSchema), async (c) => {
    const { page, limit } = c.req.valid('query');
    
    try {
      const result = await trackRepository.getAll(page, limit);
      return c.json(result);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      return c.json({ error: 'Failed to fetch tracks' }, 500);
    }
  })
  
  // Get featured tracks
  .get('/featured', async (c) => {
    try {
      const tracks = await trackRepository.getFeatured();
      return c.json({ tracks });
    } catch (error) {
      console.error('Error fetching featured tracks:', error);
      return c.json({ error: 'Failed to fetch featured tracks' }, 500);
    }
  })
  
  // Get new releases
  .get('/new-releases', async (c) => {
    try {
      const tracks = await trackRepository.getNewReleases();
      return c.json({ tracks });
    } catch (error) {
      console.error('Error fetching new releases:', error);
      return c.json({ error: 'Failed to fetch new releases' }, 500);
    }
  })
  
  // Search tracks
  .get('/search', zValidator('query', SearchSchema), async (c) => {
    const { query, limit } = c.req.valid('query');
    
    try {
      const tracks = await trackRepository.search(query, limit);
      return c.json({ tracks });
    } catch (error) {
      console.error('Error searching tracks:', error);
      return c.json({ error: 'Failed to search tracks' }, 500);
    }
  })
  
  // Get tracks by genre
  .get('/genre/:genre', zValidator('query', PaginationSchema), async (c) => {
    const genre = c.req.param('genre');
    const { page, limit } = c.req.valid('query');
    
    try {
      const result = await trackRepository.getByGenre(genre, page, limit);
      return c.json(result);
    } catch (error) {
      console.error('Error fetching tracks by genre:', error);
      return c.json({ error: 'Failed to fetch tracks by genre' }, 500);
    }
  })
  
  // Get track by ID
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    
    try {
      const track = await trackRepository.getById(id);
      
      if (!track) {
        return c.json({ error: 'Track not found' }, 404);
      }
      
      return c.json({ track });
    } catch (error) {
      console.error('Error fetching track:', error);
      return c.json({ error: 'Failed to fetch track' }, 500);
    }
  })
  
  // Record a play for a track
  .post('/:id/play', async (c) => {
    const id = c.req.param('id');
    
    try {
      const track = await trackRepository.recordPlay(id);
      
      if (!track) {
        return c.json({ error: 'Track not found' }, 404);
      }
      
      return c.json({ success: true });
    } catch (error) {
      console.error('Error recording play:', error);
      return c.json({ error: 'Failed to record play' }, 500);
    }
  })
  
  // Create a new track (protected - requires artist)
  .post('/', authMiddleware({ requireArtist: true }), zValidator('json', TrackCreateSchema), async (c) => {
    const { title, albumId, coverUrl, playbackUrl, duration, genres } = c.req.valid('json');
    const user = c.get('user');
    
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }
    
    if (!user.is_artist) {
      return c.json({ error: 'Artist account required' }, 403);
    }
    
    try {
      const track = await trackRepository.create({
        title,
        artistId: user.id,
        albumId,
        coverUrl,
        playbackUrl,
        duration,
        genres
      });
      
      return c.json({ message: 'Track created successfully', track }, 201);
    } catch (error) {
      console.error('Error creating track:', error);
      
      if (error.message === 'Album not found' || error.message === 'Artist not found') {
        return c.json({ error: error.message }, 404);
      }
      
      return c.json({ error: 'Failed to create track' }, 500);
    }
  })
  
  // Update a track (protected - requires artist ownership)
  .patch('/:id', authMiddleware({ requireArtist: true }), zValidator('json', TrackUpdateSchema), async (c) => {
    const id = c.req.param('id');
    const updateData = c.req.valid('json');
    const user = c.get('user');
    
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }
    
    try {
      // Check if track exists and belongs to the artist
      const track = await trackRepository.getById(id);
      
      if (!track) {
        return c.json({ error: 'Track not found' }, 404);
      }
      
      if (track.artist_id !== user.id) {
        return c.json({ error: 'You can only update your own tracks' }, 403);
      }
      
      const updatedTrack = await trackRepository.update(id, updateData);
      
      return c.json({ 
        message: 'Track updated successfully', 
        track: updatedTrack 
      });
    } catch (error) {
      console.error('Error updating track:', error);
      
      if (error.message === 'Album not found') {
        return c.json({ error: error.message }, 404);
      }
      
      return c.json({ error: 'Failed to update track' }, 500);
    }
  })
  
  // Delete a track (protected - requires artist ownership)
  .delete('/:id', authMiddleware({ requireArtist: true }), async (c) => {
    const id = c.req.param('id');
    const user = c.get('user');
    
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }
    
    try {
      // Check if track exists and belongs to the artist
      const track = await trackRepository.getById(id);
      
      if (!track) {
        return c.json({ error: 'Track not found' }, 404);
      }
      
      if (track.artist_id !== user.id) {
        return c.json({ error: 'You can only delete your own tracks' }, 403);
      }
      
      const success = await trackRepository.delete(id);
      
      if (success) {
        return c.json({ message: 'Track deleted successfully' });
      } else {
        return c.json({ error: 'Failed to delete track' }, 500);
      }
    } catch (error) {
      console.error('Error deleting track:', error);
      return c.json({ error: 'Failed to delete track' }, 500);
    }
  });