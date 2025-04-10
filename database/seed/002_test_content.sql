-- Seed file: 002_test_content.sql
-- Description: Creates test content (albums and tracks) for development and testing based on mock data

-- Create albums for our artists
INSERT INTO prettygood.albums (
    id,
    title,
    artist_id,
    release_date,
    cover_url,
    description,
    genre,
    type
  )
VALUES 
  -- Electric Symphony albums
  (
    '10000000-0000-0000-0000-000000000001',
    'Digital Horizons',
    '00000000-0000-0000-0000-000000000002',
    '2023-10-05',
    'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80',
    'A futuristic journey through electronic soundscapes.',
    ARRAY ['Electronic', 'Ambient'],
    'album'
  ),
  
  -- Vintage Echoes albums
  (
    '10000000-0000-0000-0000-000000000002',
    'Nostalgic Frequencies',
    '00000000-0000-0000-0000-000000000003',
    '2023-11-03',
    'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&dpr=2&q=80',
    'Lo-fi beats with nostalgic vibes.',
    ARRAY ['Lo-Fi', 'Chillwave', 'Downtempo'],
    'album'
  ),
  
  -- Sonic Wanderer albums
  (
    '10000000-0000-0000-0000-000000000003',
    'Experimental Soundscapes',
    '00000000-0000-0000-0000-000000000006',
    '2023-09-22',
    'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=300&dpr=2&q=80',
    'Pushing the boundaries of conventional music.',
    ARRAY ['Experimental', 'Ambient', 'Noise'],
    'album'
  ),
  
  -- Melodic Journey albums
  (
    '10000000-0000-0000-0000-000000000004',
    'Emotional Journeys',
    '00000000-0000-0000-0000-000000000007',
    '2023-12-01',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&dpr=2&q=80',
    'Ambient compositions that tell a story.',
    ARRAY ['Ambient', 'Cinematic', 'Melodic'],
    'album'
  ),
  
  -- Bass Architect albums
  (
    '10000000-0000-0000-0000-000000000005',
    'Bass Architecture',
    '00000000-0000-0000-0000-000000000008',
    '2023-08-15',
    'https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=300&dpr=2&q=80',
    'Deep bass explorations and innovative electronic structures.',
    ARRAY ['Bass', 'Electronic', 'Dubstep'],
    'album'
  ) 
ON CONFLICT (id) DO NOTHING;

-- Create tracks for our albums
INSERT INTO prettygood.tracks (
    id,
    title,
    artist_id,
    album_id,
    duration,
    audio_url,
    cover_url,
    track_number,
    lyrics,
    genre,
    explicit,
    release_date
  )
VALUES 
  -- Tracks for Digital Horizons (Electric Symphony)
  (
    '20000000-0000-0000-0000-000000000001',
    'Digital Dawn',
    '00000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    237,
    'https://example.com/audio/digital-dawn.mp3',
    'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80',
    1,
    'Instrumental track with subtle vocal samples.',
    ARRAY ['Electronic', 'Ambient'],
    FALSE,
    '2023-10-05'
  ),
  
  (
    '20000000-0000-0000-0000-000000000002',
    'Neon Nights',
    '00000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    195,
    'https://example.com/audio/neon-nights.mp3',
    'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80',
    2,
    'Instrumental with synthesizer melodies.',
    ARRAY ['Electronic', 'Synthwave'],
    FALSE,
    '2023-10-05'
  ),
  
  -- Tracks for Nostalgic Frequencies (Vintage Echoes)
  (
    '20000000-0000-0000-0000-000000000003',
    'Retro Recall',
    '00000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002',
    248,
    'https://example.com/audio/retro-recall.mp3',
    'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&dpr=2&q=80',
    1,
    'Lo-fi beats with vinyl crackle and nostalgic samples.',
    ARRAY ['Lo-Fi', 'Chillwave'],
    FALSE,
    '2023-11-03'
  ),
  
  (
    '20000000-0000-0000-0000-000000000004',
    'Analog Dreams',
    '00000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000002',
    312,
    'https://example.com/audio/analog-dreams.mp3',
    'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&dpr=2&q=80',
    2,
    'Downtempo beats with analog synthesizer melodies.',
    ARRAY ['Lo-Fi', 'Downtempo'],
    FALSE,
    '2023-11-03'
  ),
  
  -- Tracks for Experimental Soundscapes (Sonic Wanderer)
  (
    '20000000-0000-0000-0000-000000000005',
    'Sonic Exploration IV',
    '00000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000003',
    432,
    'https://example.com/audio/sonic-exploration-iv.mp3',
    'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=300&dpr=2&q=80',
    1,
    'Experimental sound design with field recordings.',
    ARRAY ['Experimental', 'Ambient'],
    FALSE,
    '2023-09-22'
  ),
  
  (
    '20000000-0000-0000-0000-000000000006',
    'Dissonant Harmony',
    '00000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000003',
    378,
    'https://example.com/audio/dissonant-harmony.mp3',
    'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=300&dpr=2&q=80',
    2,
    'Layers of noise that create unexpected harmonies.',
    ARRAY ['Experimental', 'Noise'],
    FALSE,
    '2023-09-22'
  ),
  
  -- Tracks for Emotional Journeys (Melodic Journey)
  (
    '20000000-0000-0000-0000-000000000007',
    'Emotional Voyage',
    '00000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000004',
    287,
    'https://example.com/audio/emotional-voyage.mp3',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&dpr=2&q=80',
    1,
    'Cinematic ambient composition with piano and strings.',
    ARRAY ['Ambient', 'Cinematic'],
    FALSE,
    '2023-12-01'
  ),
  
  (
    '20000000-0000-0000-0000-000000000008',
    'Melodic Sunset',
    '00000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000004',
    255,
    'https://example.com/audio/melodic-sunset.mp3',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&dpr=2&q=80',
    2,
    'Ambient melody that evokes the feeling of a sunset.',
    ARRAY ['Ambient', 'Melodic'],
    FALSE,
    '2023-12-01'
  ),
  
  -- Tracks for Bass Architecture (Bass Architect)
  (
    '20000000-0000-0000-0000-000000000009',
    'Deep Foundations',
    '00000000-0000-0000-0000-000000000008',
    '10000000-0000-0000-0000-000000000005',
    342,
    'https://example.com/audio/deep-foundations.mp3',
    'https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=300&dpr=2&q=80',
    1,
    'Deep sub-bass explorations with minimal percussion.',
    ARRAY ['Bass', 'Electronic'],
    FALSE,
    '2023-08-15'
  ),
  
  (
    '20000000-0000-0000-0000-000000000010',
    'Structural Bass',
    '00000000-0000-0000-0000-000000000008',
    '10000000-0000-0000-0000-000000000005',
    298,
    'https://example.com/audio/structural-bass.mp3',
    'https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=300&dpr=2&q=80',
    2,
    'Dubstep-influenced track with complex bass design.',
    ARRAY ['Bass', 'Dubstep'],
    TRUE,
    '2023-08-15'
  ) 
ON CONFLICT (id) DO NOTHING;

-- Print a message
DO $$
BEGIN
  RAISE NOTICE 'Albums and tracks created successfully';
  RAISE NOTICE '- 5 Albums added with full metadata';
  RAISE NOTICE '- 10 Tracks added with full metadata';
END $$;
