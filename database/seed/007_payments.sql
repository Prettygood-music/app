-- Seed file: 007_payments.sql
-- Description: Creates test payments/tips between users and artists

-- Create payments/tips
INSERT INTO prettygood.payments (
    id,
    sender_id,
    recipient_id,
    amount,
    currency,
    transaction_hash,
    status,
    payment_type,
    track_id,
    message,
    created_at
  )
VALUES 
  -- Music Lover tips to Electric Symphony
  (
    '40000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002',
    5.0,
    'SUI',
    '0x0000000000000000000000000000000000000000000000000000000000000abc',
    'completed',
    'tip',
    '20000000-0000-0000-0000-000000000001',
    'Love this track!',
    NOW() - INTERVAL '3 days'
  ),
  
  -- Music Lover tips to Melodic Journey
  (
    '40000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000007',
    10.0,
    'SUI',
    '0x0000000000000000000000000000000000000000000000000000000000000def',
    'completed',
    'tip',
    '20000000-0000-0000-0000-000000000007',
    'This is amazing work!',
    NOW() - INTERVAL '2 days'
  ),
  
  -- Music Lover tips to Bass Architect
  (
    '40000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000008',
    15.0,
    'SUI',
    '0x0000000000000000000000000000000000000000000000000000000000000123',
    'completed',
    'tip',
    '20000000-0000-0000-0000-000000000010',
    'The bass on this track is incredible!',
    NOW() - INTERVAL '1 day'
  ),
  
  -- Beat Enthusiast tips to Vintage Echoes
  (
    '40000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000003',
    8.5,
    'SUI',
    '0x0000000000000000000000000000000000000000000000000000000000000456',
    'completed',
    'tip',
    '20000000-0000-0000-0000-000000000003',
    'Nostalgic vibes!',
    NOW() - INTERVAL '5 days'
  ),
  
  -- Beat Enthusiast tips to Sonic Wanderer
  (
    '40000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006',
    12.0,
    'SUI',
    '0x0000000000000000000000000000000000000000000000000000000000000789',
    'completed',
    'tip',
    '20000000-0000-0000-0000-000000000005',
    'Mind-blowing experimental work!',
    NOW() - INTERVAL '4 days'
  ) 
ON CONFLICT (id) DO NOTHING;

-- Print a message
DO $$
BEGIN
  RAISE NOTICE 'Payments/tips created successfully';
  RAISE NOTICE '- 3 tips from Music Lover to different artists';
  RAISE NOTICE '- 2 tips from Beat Enthusiast to different artists';
  RAISE NOTICE '- All payment statuses set to "completed"';
END $$;
