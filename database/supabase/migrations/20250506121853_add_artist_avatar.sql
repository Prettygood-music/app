drop function if exists "public"."apply_for_artist_account"(artist_name text, bio text, genre text[], location text, website text, social_links jsonb, application_notes text);

drop view if exists "public"."tracks_with_details";

alter table "public"."artists" add column "avatar" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.apply_for_artist_account(artist_name text, bio text DEFAULT NULL::text, avatar text DEFAULT NULL::text, genre text[] DEFAULT '{}'::text[], location text DEFAULT NULL::text, website text DEFAULT NULL::text, social_links jsonb DEFAULT NULL::jsonb, application_notes text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  artist_id UUID := auth.uid();
  result JSONB;
BEGIN
  -- Check authentication
  IF artist_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check if user is already an artist
  IF EXISTS (SELECT 1 FROM public.artists WHERE id = artist_id) THEN
    RAISE EXCEPTION 'User is already registered as an artist';
  END IF;
  
  -- Create pending artist application
  INSERT INTO public.artists (
    id,
    artist_name,
    bio,
    avatar,
    genre,
    location,
    website,
    social_links,
    verified,
    approved,
    application_date,
    application_notes
  )
  VALUES (
    artist_id,
    artist_name,
    bio,
    avatar,
    COALESCE(genre, '{}'),
    location,
    website,
    COALESCE(social_links, '{}'::jsonb),
    FALSE,           -- Not verified initially
    FALSE,           -- Not approved initially
    NOW(),           -- Application timestamp
    application_notes
  );
  
  -- Update user role to indicate pending artist status
  UPDATE public.users 
  SET role = 'pending_artist'
  WHERE id = artist_id;
  
  -- Return application status
  result := json_build_object(
    'artist_id', artist_id,
    'status', 'pending_approval',
    'application_date', NOW()
  );
  
  RETURN result;
END;
$function$
;

create or replace view "public"."tracks_with_details" as  SELECT t.id,
    t.title,
    t.artist_id,
    t.album_id,
    t.duration,
    t.audio_url,
    t.cover_url,
    t.track_number,
    t.lyrics,
    t.genre,
    t.explicit,
    t.release_date,
    t.isrc,
    t.created_at,
    t.updated_at,
    a.artist_name,
    a.verified AS artist_verified,
    al.title AS album_title,
    al.release_date AS album_release_date,
    COALESCE(pc.play_count, (0)::bigint) AS play_count,
    COALESCE(pc.unique_listeners, (0)::bigint) AS unique_listeners
   FROM (((tracks t
     JOIN artists a ON ((t.artist_id = a.id)))
     LEFT JOIN albums al ON ((t.album_id = al.id)))
     LEFT JOIN track_play_counts pc ON ((t.id = pc.track_id)));



