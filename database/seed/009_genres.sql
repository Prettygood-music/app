-- Seed file for genres
-- This file populates the genres table with common music genres and assigns nice colors and descriptions

-- First, clear any existing genre data to avoid duplicates
DELETE FROM prettygood.track_genres;
DELETE FROM prettygood.artist_genres;
DELETE FROM prettygood.album_genres;
DELETE FROM prettygood.genres;

-- Reset genre popularity
UPDATE prettygood.genres SET popularity = 0;

-- Insert main music genres
INSERT INTO prettygood.genres (name, slug, description, color, popularity) VALUES
-- Electronic
('Electronic', 'electronic', 'Umbrella term for music that employs electronic musical instruments, digital instruments, or circuitry-based music technology.', '#3498db', 1000),
('House', 'house', 'Genre characterized by a repetitive four-on-the-floor beat and a tempo of 120 to 130 beats per minute.', '#2980b9', 800),
('Techno', 'techno', 'Form of electronic dance music that emerged in Detroit, Michigan, in the United States during the mid-to-late 1980s.', '#1abc9c', 700),
('Drum and Bass', 'drum-and-bass', 'Genre characterized by fast breakbeats with heavy bass and sub-bass lines, sampled sources, and synthesizers.', '#16a085', 600),
('Dubstep', 'dubstep', 'Electronic dance music characterized by emphasizing the bass and sub-bass frequencies, sparse arrangements, and a distinctive wobble sound.', '#27ae60', 500),
('Trance', 'trance', 'Genre of electronic dance music that developed in the 1990s, characterized by a tempo of between 125 and 150 BPM.', '#3498db', 450),
('Ambient', 'ambient', 'Genre of music that emphasizes tone and atmosphere over traditional musical structure or rhythm.', '#9b59b6', 300),
('Breakbeat', 'breakbeat', 'Style of electronic music characterized by the use of broken beats and samples from funk, jazz, and soul recordings.', '#8e44ad', 250),
('Chillout', 'chillout', 'Broad category of electronic music characterized by mid-tempo beats and relaxed, atmospheric sounds.', '#2c3e50', 200),

-- Hip-Hop/R&B
('Hip Hop', 'hip-hop', 'Music genre consisting of stylized rhythmic music that commonly accompanies rapping, a rhythmic and rhyming speech.', '#e74c3c', 950),
('R&B', 'r-and-b', 'Genre of popular music that originated in African-American communities in the 1940s.', '#c0392b', 850),
('Trap', 'trap', 'Style of hip hop music that originated in the Southern United States during the early 2000s.', '#d35400', 700),
('Soul', 'soul', 'Music genre that originated in the United States and combines elements of African-American gospel music, rhythm and blues, and jazz.', '#e67e22', 600),
('Neo-Soul', 'neo-soul', 'Genre of popular music that emerged from soul and contemporary R&B in the 1990s.', '#f39c12', 400),
('Funk', 'funk', 'Music genre that originated in African-American communities in the mid-1960s.', '#f1c40f', 350),

-- Rock
('Rock', 'rock', 'Broad genre of popular music that evolved from rock and roll and pop music during the mid and late 1960s.', '#e74c3c', 900),
('Alternative Rock', 'alternative-rock', 'Rock music produced primarily in the 1980s and 1990s that used approaches different from those of mainstream rock music.', '#c0392b', 800),
('Indie Rock', 'indie-rock', 'Genre of rock music that originated in the United Kingdom in the 1970s and is characterized by a do-it-yourself attitude.', '#d35400', 750),
('Hard Rock', 'hard-rock', 'Genre of rock music that developed in the late 1960s and early 1970s, primarily in the United Kingdom and the United States.', '#e67e22', 650),
('Metal', 'metal', 'Genre of rock music that developed in the late 1960s and early 1970s, primarily in the United Kingdom and the United States.', '#f39c12', 600),
('Punk Rock', 'punk-rock', 'Rock music genre that emerged in the mid-1970s, characterized by a DIY ethic, stripped-down instrumentation, and anti-establishment lyrics.', '#f1c40f', 450),
('Grunge', 'grunge', 'Rock music genre and subculture that emerged in the mid-1980s in the American state of Washington, particularly in Seattle and nearby towns.', '#2ecc71', 400),
('Progressive Rock', 'progressive-rock', 'Rock music subgenre that originated in the United Kingdom with further developments in Germany, Italy, and France.', '#27ae60', 300),
('Classic Rock', 'classic-rock', 'Rock music made between the mid-1960s and the late 1980s, emphasizing instrumental performance and often incorporating musical influence from blues, jazz, and classical music.', '#16a085', 550),

-- Pop
('Pop', 'pop', 'Genre of popular music that originated in its modern form during the mid-1950s in the United States and the United Kingdom.', '#9b59b6', 950),
('Synth-Pop', 'synth-pop', 'Subgenre of pop music that first became prominent in the late 1970s and emphasizes the use of synthesizers.', '#8e44ad', 550),
('K-Pop', 'k-pop', 'Popular music originating from South Korea that is characterized by a wide variety of audiovisual elements.', '#2c3e50', 800),
('J-Pop', 'j-pop', 'Popular music originating from Japan that is characterized by a wide variety of audiovisual elements.', '#34495e', 700),
('Dance-Pop', 'dance-pop', 'Pop music subgenre that originated in the early 1980s and is generally uptempo music intended for nightclubs with the intention of being danceable.', '#1abc9c', 650),
('Electropop', 'electropop', 'Music genre incorporating elements of electronic and pop genres, with primary usage of synthesizers and various electronic and pop musical instruments.', '#16a085', 450),

-- Classical
('Classical', 'classical', 'Art music produced or rooted in the traditions of Western culture, including both liturgical and secular music.', '#3498db', 400),
('Opera', 'opera', 'Art form in which singers and musicians perform a dramatic work combining text and musical score.', '#2980b9', 250),
('Chamber Music', 'chamber-music', 'Form of classical music, written for a small group of instruments, traditionally a palace chamber.', '#1abc9c', 200),
('Orchestral', 'orchestral', 'Music composed for symphony orchestra, such as symphonies and concertos.', '#16a085', 300),

-- Jazz
('Jazz', 'jazz', 'Music genre that originated in the African-American communities of New Orleans, Louisiana, in the late 19th and early 20th centuries.', '#27ae60', 500),
('Bebop', 'bebop', 'Style of jazz developed in the early to mid-1940s in the United States, which features compositions characterized by a fast tempo, virtuosic technique, and improvisation.', '#2ecc71', 300),
('Smooth Jazz', 'smooth-jazz', 'Genre of jazz with roots in jazz, R&B, and pop.', '#f1c40f', 350),
('Fusion', 'fusion', 'Music genre that developed in the late 1960s when musicians combined jazz harmony and improvisation with rock music, funk, and rhythm and blues.', '#f39c12', 250),
('Big Band', 'big-band', 'Type of musical ensemble associated with playing jazz music that became popular during the Swing Era from the early 1930s until the late 1940s.', '#e67e22', 200),

-- Folk
('Folk', 'folk', 'Genre of traditional music, which has existed since the beginning of culture.', '#d35400', 400),
('Acoustic', 'acoustic', 'Music that solely or primarily uses instruments which produce sound through entirely acoustic means, as opposed to electric or electronic means.', '#c0392b', 350),
('Country', 'country', 'Genre of popular music that originated with blues, old-time music, and various types of American folk music.', '#e74c3c', 500),
('Bluegrass', 'bluegrass', 'Form of American roots music. It was named after the band called Bill Monroe and the Blue Grass Boys.', '#9b59b6', 250),
('Singer-Songwriter', 'singer-songwriter', 'Musicians who write, compose, and perform their own musical material, including lyrics and melodies.', '#8e44ad', 400),

-- World
('Reggae', 'reggae', 'Music genre that originated in Jamaica in the late 1960s, characterized by a heavy backbeat and prominent basslines.', '#2c3e50', 450),
('Afrobeat', 'afrobeat', 'Music genre which involves the combination of elements of West African musical styles and American funk and jazz.', '#34495e', 350),
('Latin', 'latin', 'The umbrella term for a wide variety of music originating in Latin America and the Iberian Peninsula.', '#3498db', 500),
('Salsa', 'salsa', 'Popular dance music genre that initially arose in New York City during the 1960s.', '#2980b9', 300),
('Reggaeton', 'reggaeton', 'Music style that originated in Puerto Rico during the late 1990s, heavily influenced by American hip hop, Latin American, and Caribbean music.', '#1abc9c', 450),
('Bossa Nova', 'bossa-nova', 'Style of Brazilian music, which was developed and popularized in the 1950s and 1960s.', '#16a085', 250),

-- Electronic Subgenres
('EDM', 'edm', 'Broad range of percussive electronic music genres made primarily for nightclubs, raves and festivals.', '#27ae60', 700),
('Downtempo', 'downtempo', 'Electronic music style similar to ambient music, but usually with a beat or groove unlike the beatless forms of Ambient music.', '#2ecc71', 250),
('IDM', 'idm', 'Experimental form of electronic music that emerged in the early 1990s, characterized by unusual rhythmic structures and/or atonality.', '#f1c40f', 200),
('Synthwave', 'synthwave', 'Electronic music genre influenced by 1980s film soundtracks and video games, attempting to capture the era''s atmosphere and celebrate it.', '#f39c12', 350),
('Lo-Fi', 'lo-fi', 'Music with imperfections that are perceived as adding warmth and texture to the sound.', '#e67e22', 400),

-- Experimental
('Experimental', 'experimental', 'Music that pushes existing boundaries and genre definitions.', '#d35400', 200),
('Noise', 'noise', 'Category of music that is characterized by the expressive use of noise within a musical context.', '#c0392b', 150),
('Avant-Garde', 'avant-garde', 'Music that is considered to be at the forefront of innovation in its field, with the term often implying a critique of existing aesthetic conventions.', '#e74c3c', 100),

-- Mood-based
('Chill', 'chill', 'Relaxed and laid-back electronic music perfect for unwinding.', '#9b59b6', 600),
('Upbeat', 'upbeat', 'Energetic and positive music that lifts the spirits.', '#8e44ad', 500),
('Melancholic', 'melancholic', 'Music with a sorrowful or pensive mood.', '#2c3e50', 400),
('Romantic', 'romantic', 'Music that conveys love and emotional intimacy.', '#34495e', 300),
('Cinematic', 'cinematic', 'Music that evokes the feeling of a film soundtrack.', '#3498db', 350),
('Epic', 'epic', 'Grand, sweeping music often used in trailers and intense moments.', '#2980b9', 250);

-- Execute query to update genre popularity based on track count
UPDATE prettygood.genres g
SET popularity = (
  SELECT COUNT(*) 
  FROM prettygood.tracks t
  WHERE g.name = ANY(t.genre)
);

-- Migrate the genre data from the old array format to the new relational model
-- This creates the appropriate entries in the junction tables
DO $$
DECLARE
  genre_name TEXT;
  genre_id UUID;
  track_id UUID;
  artist_id UUID;
  album_id UUID;
BEGIN
  -- Process each genre name
  FOR genre_name IN 
    SELECT name FROM prettygood.genres
  LOOP
    -- Get the genre ID
    SELECT id INTO genre_id FROM prettygood.genres WHERE name = genre_name;
    
    -- Associate tracks with this genre
    FOR track_id IN 
      SELECT id FROM prettygood.tracks
      WHERE genre_name = ANY(genre)
    LOOP
      INSERT INTO prettygood.track_genres (track_id, genre_id)
      VALUES (track_id, genre_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Associate artists with this genre
    FOR artist_id IN 
      SELECT id FROM prettygood.artists
      WHERE genre_name = ANY(genre)
    LOOP
      INSERT INTO prettygood.artist_genres (artist_id, genre_id)
      VALUES (artist_id, genre_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Associate albums with this genre
    FOR album_id IN 
      SELECT id FROM prettygood.albums
      WHERE genre_name = ANY(genre)
    LOOP
      INSERT INTO prettygood.album_genres (album_id, genre_id)
      VALUES (album_id, genre_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

-- Create some related genres relationships for better browsing
CREATE TABLE IF NOT EXISTS prettygood_private.related_genres_seeds (
  genre_name TEXT,
  related_genre_name TEXT
);

-- Clear any existing seed data
DELETE FROM prettygood_private.related_genres_seeds;

-- Insert related genre pairs
INSERT INTO prettygood_private.related_genres_seeds (genre_name, related_genre_name) VALUES
-- Electronic relationships
('Electronic', 'Techno'),
('Electronic', 'House'),
('Electronic', 'Ambient'),
('Electronic', 'EDM'),
('House', 'Techno'),
('House', 'EDM'),
('House', 'Dance-Pop'),
('Techno', 'House'),
('Techno', 'Drum and Bass'),
('Techno', 'IDM'),
('Drum and Bass', 'Breakbeat'),
('Drum and Bass', 'Dubstep'),
('Dubstep', 'Trap'),
('Dubstep', 'EDM'),
('Trance', 'House'),
('Trance', 'Techno'),
('Ambient', 'Chillout'),
('Ambient', 'Downtempo'),
('Breakbeat', 'Drum and Bass'),
('Breakbeat', 'IDM'),
('Chillout', 'Ambient'),
('Chillout', 'Lo-Fi'),
('Chillout', 'Downtempo'),

-- Hip-Hop/R&B relationships
('Hip Hop', 'R&B'),
('Hip Hop', 'Trap'),
('Hip Hop', 'Soul'),
('R&B', 'Hip Hop'),
('R&B', 'Soul'),
('R&B', 'Neo-Soul'),
('Trap', 'Hip Hop'),
('Trap', 'Dubstep'),
('Soul', 'R&B'),
('Soul', 'Funk'),
('Neo-Soul', 'R&B'),
('Neo-Soul', 'Jazz'),
('Funk', 'Soul'),
('Funk', 'Disco'),

-- Rock relationships
('Rock', 'Alternative Rock'),
('Rock', 'Hard Rock'),
('Rock', 'Classic Rock'),
('Alternative Rock', 'Indie Rock'),
('Alternative Rock', 'Grunge'),
('Indie Rock', 'Alternative Rock'),
('Indie Rock', 'Pop'),
('Hard Rock', 'Metal'),
('Hard Rock', 'Rock'),
('Metal', 'Hard Rock'),
('Metal', 'Punk Rock'),
('Punk Rock', 'Alternative Rock'),
('Punk Rock', 'Indie Rock'),
('Grunge', 'Alternative Rock'),
('Grunge', 'Hard Rock'),
('Progressive Rock', 'Rock'),
('Progressive Rock', 'Metal'),
('Classic Rock', 'Rock'),
('Classic Rock', 'Hard Rock'),

-- Pop relationships
('Pop', 'Dance-Pop'),
('Pop', 'Synth-Pop'),
('Pop', 'Electropop'),
('Synth-Pop', 'Electropop'),
('Synth-Pop', 'Pop'),
('K-Pop', 'Pop'),
('K-Pop', 'J-Pop'),
('J-Pop', 'K-Pop'),
('J-Pop', 'Pop'),
('Dance-Pop', 'Pop'),
('Dance-Pop', 'EDM'),
('Electropop', 'Synth-Pop'),
('Electropop', 'Electronic'),

-- Classical relationships
('Classical', 'Opera'),
('Classical', 'Chamber Music'),
('Classical', 'Orchestral'),
('Opera', 'Classical'),
('Chamber Music', 'Classical'),
('Orchestral', 'Classical'),
('Orchestral', 'Cinematic'),

-- Jazz relationships
('Jazz', 'Bebop'),
('Jazz', 'Smooth Jazz'),
('Jazz', 'Fusion'),
('Jazz', 'Big Band'),
('Bebop', 'Jazz'),
('Smooth Jazz', 'Jazz'),
('Smooth Jazz', 'R&B'),
('Fusion', 'Jazz'),
('Fusion', 'Rock'),
('Big Band', 'Jazz'),
('Big Band', 'Swing'),

-- Folk relationships
('Folk', 'Acoustic'),
('Folk', 'Country'),
('Folk', 'Singer-Songwriter'),
('Acoustic', 'Folk'),
('Acoustic', 'Singer-Songwriter'),
('Country', 'Folk'),
('Country', 'Bluegrass'),
('Bluegrass', 'Country'),
('Bluegrass', 'Folk'),
('Singer-Songwriter', 'Acoustic'),
('Singer-Songwriter', 'Folk'),

-- World relationships
('Reggae', 'Dub'),
('Reggae', 'Reggaeton'),
('Afrobeat', 'Funk'),
('Afrobeat', 'Jazz'),
('Latin', 'Salsa'),
('Latin', 'Reggaeton'),
('Salsa', 'Latin'),
('Reggaeton', 'Latin'),
('Reggaeton', 'Hip Hop'),
('Bossa Nova', 'Jazz'),
('Bossa Nova', 'Latin'),

-- Electronic Subgenres relationships
('EDM', 'House'),
('EDM', 'Dubstep'),
('EDM', 'Techno'),
('Downtempo', 'Ambient'),
('Downtempo', 'Chillout'),
('IDM', 'Electronic'),
('IDM', 'Experimental'),
('Synthwave', 'Electronic'),
('Synthwave', 'Electropop'),
('Lo-Fi', 'Chillout'),
('Lo-Fi', 'Hip Hop'),

-- Experimental relationships
('Experimental', 'Noise'),
('Experimental', 'Avant-Garde'),
('Experimental', 'IDM'),
('Noise', 'Experimental'),
('Avant-Garde', 'Experimental'),
('Avant-Garde', 'Jazz'),

-- Mood-based relationships
('Chill', 'Chillout'),
('Chill', 'Lo-Fi'),
('Chill', 'Ambient'),
('Upbeat', 'Dance-Pop'),
('Upbeat', 'Pop'),
('Upbeat', 'EDM'),
('Melancholic', 'Ambient'),
('Melancholic', 'Singer-Songwriter'),
('Romantic', 'Classical'),
('Romantic', 'R&B'),
('Cinematic', 'Orchestral'),
('Cinematic', 'Epic'),
('Epic', 'Cinematic'),
('Epic', 'Orchestral');

-- Create the related genres connections using the seed data
DO $$
DECLARE
  genre1_id UUID;
  genre2_id UUID;
  rec RECORD;
BEGIN
  FOR rec IN SELECT * FROM prettygood_private.related_genres_seeds
  LOOP
    -- Get IDs for the genre pair
    SELECT id INTO genre1_id FROM prettygood.genres WHERE name = rec.genre_name;
    SELECT id INTO genre2_id FROM prettygood.genres WHERE name = rec.related_genre_name;
    
    -- Only proceed if both genres exist
    IF genre1_id IS NOT NULL AND genre2_id IS NOT NULL THEN
      -- Add a placeholder related_genres table if it doesn't exist
      -- (This would be replaced by the proper get_related_genres function in production)
      IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'prettygood_private' AND tablename = 'related_genres') THEN
        CREATE TABLE prettygood_private.related_genres (
          genre_id UUID REFERENCES prettygood.genres(id) ON DELETE CASCADE,
          related_genre_id UUID REFERENCES prettygood.genres(id) ON DELETE CASCADE,
          weight INTEGER DEFAULT 1,
          PRIMARY KEY (genre_id, related_genre_id)
        );
      END IF;
      
      -- Insert the relationship
      INSERT INTO prettygood_private.related_genres (genre_id, related_genre_id, weight)
      VALUES (genre1_id, genre2_id, 1)
      ON CONFLICT (genre_id, related_genre_id) DO UPDATE SET weight = prettygood_private.related_genres.weight + 1;
    END IF;
  END LOOP;
END;
$$;

-- Clean up temporary table
DROP TABLE IF EXISTS prettygood_private.related_genres_seeds;

-- Add image_url for some popular genres to enhance visual display
UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'Electronic';

UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1552117326-11052473a73e?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'Hip Hop';

UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1680694613737-cf5acfcaee6c?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'Rock';

UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'Pop';

UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'Classical';

UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'Jazz';

UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1537183012484-fc3f4b4e4244?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'Folk';

UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1558894410-a8f9761977b3?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'R&B';

UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'EDM';

UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1511335012058-8f1c2e2bf496?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'Reggae';

UPDATE prettygood.genres 
SET image_url = 'https://images.unsplash.com/photo-1616356082644-4c87930fdddb?q=80&w=1000&auto=format&fit=crop'
WHERE name = 'K-Pop';
