// server/src/repositories/tracks.ts
import { v4 as uuidv4 } from 'uuid';
import type { Track } from '$lib/types';
import { mockTracks, mockAlbums, mockUsers } from '$lib/data/mocks';

/**
 * Track repository using mock data for development
 */
export class TrackRepository {
  /**
   * Get all tracks with pagination
   */
  async getAll(page = 1, limit = 20): Promise<{ tracks: Track[], total: number }> {
    const offset = (page - 1) * limit;
    const paginatedTracks = mockTracks.slice(offset, offset + limit);
    
    return {
      tracks: paginatedTracks,
      total: mockTracks.length
    };
  }
  
  /**
   * Get track by ID
   */
  async getById(id: string): Promise<Track | null> {
    const track = mockTracks.find(t => t.id === id);
    
    if (!track) return null;
    
    return track;
  }
  
  /**
   * Get tracks by artist ID
   */
  async getByArtistId(artistId: string, page = 1, limit = 20): Promise<{
    tracks: Track[];
    total: number;
  }> {
    const artistTracks = mockTracks.filter(track => track.artist_id === artistId);
    const offset = (page - 1) * limit;
    const paginatedTracks = artistTracks
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(offset, offset + limit);
    
    return {
      tracks: paginatedTracks,
      total: artistTracks.length
    };
  }
  
  /**
   * Get tracks by album ID
   */
  async getByAlbumId(albumId: string, page = 1, limit = 20): Promise<{
    tracks: Track[];
    total: number;
  }> {
    const albumTracks = mockTracks.filter(track => track.album_id === albumId);
    const offset = (page - 1) * limit;
    const paginatedTracks = albumTracks.slice(offset, offset + limit);
    
    return {
      tracks: paginatedTracks,
      total: albumTracks.length
    };
  }
  
  /**
   * Get featured tracks
   */
  async getFeatured(limit = 10): Promise<Track[]> {
    // In a real app, this would have more sophisticated logic
    // For mock data, sort by play count for "popular" tracks
    return [...mockTracks]
      .sort((a, b) => b.play_count - a.play_count)
      .slice(0, limit);
  }
  
  /**
   * Get new releases (recent tracks)
   */
  async getNewReleases(limit = 10): Promise<Track[]> {
    return [...mockTracks]
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, limit);
  }
  
  /**
   * Search tracks by title, artist, or album
   */
  async search(query: string, limit = 20): Promise<Track[]> {
    const searchQuery = query.toLowerCase();
    
    return mockTracks
      .filter(track => 
        track.title.toLowerCase().includes(searchQuery) || 
        track.artist_name.toLowerCase().includes(searchQuery) ||
        (track.album_name && track.album_name.toLowerCase().includes(searchQuery))
      )
      .slice(0, limit);
  }
  
  /**
   * Create a new track
   */
  async create(trackData: {
    title: string;
    artistId: string;
    albumId?: string | null;
    coverUrl?: string | null;
    playbackUrl: string;
    duration: number;
    genres: string[];
  }): Promise<Track> {
    const { title, artistId, albumId, coverUrl, playbackUrl, duration, genres } = trackData;
    
    // Get artist information
    const artist = mockUsers.find(user => user.id === artistId && user.is_artist);
    if (!artist) {
      throw new Error('Artist not found');
    }
    
    // Get album information if provided
    let albumName = null;
    if (albumId) {
      const album = mockAlbums.find(album => album.id === albumId);
      if (!album) {
        throw new Error('Album not found');
      }
      albumName = album.title;
    }
    
    // Create new track
    const newTrack: Track = {
      id: uuidv4(),
      title,
      artist_id: artistId,
      artist_name: artist.display_name,
      album_id: albumId || null,
      album_name: albumName,
      cover_url: coverUrl || null,
      duration,
      playback_url: playbackUrl,
      published_at: new Date().toISOString(),
      genres,
      play_count: 0
    };
    
    // Add to mock database
    mockTracks.push(newTrack);
    
    // Update album track count if applicable
    if (albumId) {
      const albumIndex = mockAlbums.findIndex(album => album.id === albumId);
      if (albumIndex !== -1) {
        mockAlbums[albumIndex].tracks.push(newTrack);
        mockAlbums[albumIndex].track_count = mockAlbums[albumIndex].tracks.length;
      }
    }
    
    return newTrack;
  }
  
  /**
   * Update an existing track
   */
  async update(id: string, trackData: {
    title?: string;
    albumId?: string | null;
    coverUrl?: string | null;
    playbackUrl?: string;
    duration?: number;
    genres?: string[];
  }): Promise<Track | null> {
    const { title, albumId, coverUrl, playbackUrl, duration, genres } = trackData;
    
    // Find track
    const trackIndex = mockTracks.findIndex(track => track.id === id);
    if (trackIndex === -1) return null;
    
    const track = mockTracks[trackIndex];
    
    // Handle album change
    let albumName = track.album_name;
    if (albumId !== undefined) {
      // Remove from old album if it exists
      if (track.album_id) {
        const oldAlbumIndex = mockAlbums.findIndex(album => album.id === track.album_id);
        if (oldAlbumIndex !== -1) {
          mockAlbums[oldAlbumIndex].tracks = mockAlbums[oldAlbumIndex].tracks.filter(t => t.id !== id);
          mockAlbums[oldAlbumIndex].track_count = mockAlbums[oldAlbumIndex].tracks.length;
        }
      }
      
      // Add to new album if provided
      if (albumId) {
        const newAlbumIndex = mockAlbums.findIndex(album => album.id === albumId);
        if (newAlbumIndex !== -1) {
          albumName = mockAlbums[newAlbumIndex].title;
          mockAlbums[newAlbumIndex].tracks.push({
            ...track,
            title: title || track.title,
            album_id: albumId,
            album_name: albumName
          });
          mockAlbums[newAlbumIndex].track_count = mockAlbums[newAlbumIndex].tracks.length;
        } else {
          throw new Error('Album not found');
        }
      } else {
        albumName = null;
      }
    }
    
    // Update track
    const updatedTrack: Track = {
      ...track,
      title: title || track.title,
      album_id: albumId !== undefined ? albumId : track.album_id,
      album_name: albumName,
      cover_url: coverUrl !== undefined ? coverUrl : track.cover_url,
      playback_url: playbackUrl || track.playback_url,
      duration: duration || track.duration,
      genres: genres || track.genres
    };
    
    mockTracks[trackIndex] = updatedTrack;
    
    return updatedTrack;
  }
  
  /**
   * Delete a track
   */
  async delete(id: string): Promise<boolean> {
    const track = await this.getById(id);
    if (!track) return false;
    
    // Remove from album if it belongs to one
    if (track.album_id) {
      const albumIndex = mockAlbums.findIndex(album => album.id === track.album_id);
      if (albumIndex !== -1) {
        mockAlbums[albumIndex].tracks = mockAlbums[albumIndex].tracks.filter(t => t.id !== id);
        mockAlbums[albumIndex].track_count = mockAlbums[albumIndex].tracks.length;
      }
    }
    
    // Remove track from array
    const trackIndex = mockTracks.findIndex(t => t.id === id);
    if (trackIndex !== -1) {
      mockTracks.splice(trackIndex, 1);
      return true;
    }
    
    return false;
  }
  
  /**
   * Record a play for a track (increase play count)
   */
  async recordPlay(id: string): Promise<Track | null> {
    const trackIndex = mockTracks.findIndex(track => track.id === id);
    if (trackIndex === -1) return null;
    
    mockTracks[trackIndex] = {
      ...mockTracks[trackIndex],
      play_count: mockTracks[trackIndex].play_count + 1
    };
    
    return mockTracks[trackIndex];
  }
  
  /**
   * Get tracks by genre
   */
  async getByGenre(genre: string, page = 1, limit = 20): Promise<{
    tracks: Track[];
    total: number;
  }> {
    const genreTracks = mockTracks.filter(track => 
      track.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );
    
    const offset = (page - 1) * limit;
    const paginatedTracks = genreTracks
      .sort((a, b) => b.play_count - a.play_count)  // Sort by popularity
      .slice(offset, offset + limit);
    
    return {
      tracks: paginatedTracks,
      total: genreTracks.length
    };
  }
}

export const trackRepository = new TrackRepository();