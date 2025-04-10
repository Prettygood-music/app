-- Seed file: 005_play_history.sql
-- Description: Creates play history records for users

-- Check if context_id column exists in play_history table
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'prettygood' 
        AND table_name = 'play_history' 
        AND column_name = 'context_id'
    ) INTO column_exists;
    
    IF column_exists THEN
        -- Add play history with context_id
        INSERT INTO prettygood.play_history (
            track_id,
            user_id,
            played_at,
            play_duration,
            completed,
            source,
            context_id,
            context_type
        )
        VALUES 
        -- Music Lover play history
        (
            '20000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '5 days',
            237,
            TRUE,
            'album',
            '10000000-0000-0000-0000-000000000001',
            'album'
        ),
        
        (
            '20000000-0000-0000-0000-000000000002',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '5 days',
            195,
            TRUE,
            'album',
            '10000000-0000-0000-0000-000000000001',
            'album'
        ),
        
        (
            '20000000-0000-0000-0000-000000000007',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '4 days',
            287,
            TRUE,
            'search',
            NULL,
            NULL
        ),
        
        (
            '20000000-0000-0000-0000-000000000008',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '4 days',
            255,
            TRUE,
            'search',
            NULL,
            NULL
        ),
        
        (
            '20000000-0000-0000-0000-000000000009',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '3 days',
            342,
            TRUE,
            'artist',
            '00000000-0000-0000-0000-000000000008',
            'artist'
        ),
        
        (
            '20000000-0000-0000-0000-000000000010',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '3 days',
            298,
            TRUE,
            'artist',
            '00000000-0000-0000-0000-000000000008',
            'artist'
        ),
        
        (
            '20000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '2 days',
            237,
            TRUE,
            'playlist',
            '30000000-0000-0000-0000-000000000001',
            'playlist'
        ),
        
        (
            '20000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '1 day',
            237,
            TRUE,
            'playlist',
            '30000000-0000-0000-0000-000000000001',
            'playlist'
        ),
        
        (
            '20000000-0000-0000-0000-000000000010',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '12 hours',
            298,
            TRUE,
            'playlist',
            '30000000-0000-0000-0000-000000000003',
            'playlist'
        ),
        
        -- Beat Enthusiast play history
        (
            '20000000-0000-0000-0000-000000000003',
            '00000000-0000-0000-0000-000000000005',
            NOW() - INTERVAL '6 days',
            248,
            TRUE,
            'album',
            '10000000-0000-0000-0000-000000000002',
            'album'
        ),
        
        (
            '20000000-0000-0000-0000-000000000004',
            '00000000-0000-0000-0000-000000000005',
            NOW() - INTERVAL '6 days',
            312,
            TRUE,
            'album',
            '10000000-0000-0000-0000-000000000002',
            'album'
        ),
        
        (
            '20000000-0000-0000-0000-000000000005',
            '00000000-0000-0000-0000-000000000005',
            NOW() - INTERVAL '5 days',
            432,
            TRUE,
            'search',
            NULL,
            NULL
        ),
        
        (
            '20000000-0000-0000-0000-000000000006',
            '00000000-0000-0000-0000-000000000005',
            NOW() - INTERVAL '5 days',
            378,
            TRUE,
            'search',
            NULL,
            NULL
        ),
        
        (
            '20000000-0000-0000-0000-000000000007',
            '00000000-0000-0000-0000-000000000005',
            NOW() - INTERVAL '2 days',
            287,
            TRUE,
            'playlist',
            '30000000-0000-0000-0000-000000000002',
            'playlist'
        ),
        
        (
            '20000000-0000-0000-0000-000000000008',
            '00000000-0000-0000-0000-000000000005',
            NOW() - INTERVAL '1 day',
            255,
            TRUE,
            'playlist',
            '30000000-0000-0000-0000-000000000002',
            'playlist'
        ),
        
        (
            '20000000-0000-0000-0000-000000000007',
            '00000000-0000-0000-0000-000000000005',
            NOW() - INTERVAL '6 hours',
            287,
            TRUE,
            'playlist',
            '30000000-0000-0000-0000-000000000002',
            'playlist'
        );
    ELSE
        -- Add play history without context_id (simplified version)
        INSERT INTO prettygood.play_history (
            track_id,
            user_id,
            played_at,
            play_duration,
            completed,
            source
        )
        VALUES 
        -- Music Lover play history (simplified)
        (
            '20000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '5 days',
            237,
            TRUE,
            'album'
        ),
        
        (
            '20000000-0000-0000-0000-000000000002',
            '00000000-0000-0000-0000-000000000004',
            NOW() - INTERVAL '4 days',
            195,
            TRUE,
            'album'
        ),
        
        -- Beat Enthusiast play history (simplified)
        (
            '20000000-0000-0000-0000-000000000003',
            '00000000-0000-0000-0000-000000000005',
            NOW() - INTERVAL '3 days',
            248,
            TRUE,
            'album'
        ),
        
        (
            '20000000-0000-0000-0000-000000000004',
            '00000000-0000-0000-0000-000000000005',
            NOW() - INTERVAL '2 days',
            312,
            TRUE,
            'album'
        );
    END IF;
END $$;

-- Print a message
DO $$
BEGIN
  RAISE NOTICE 'Play history created successfully';
  RAISE NOTICE '- Added play history entries for Music Lover';
  RAISE NOTICE '- Added play history entries for Beat Enthusiast';
  RAISE NOTICE '- Included various context types (album, playlist, search, artist)';
END $$;
