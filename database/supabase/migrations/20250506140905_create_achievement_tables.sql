create table "public"."achievements" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "description" text not null,
    "image" text not null,
    "category" text not null,
    "rarity" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."achievements" enable row level security;

create table "public"."user_achievements" (
    "user_id" uuid not null,
    "achievement_id" uuid not null,
    "obtained_at" timestamp with time zone not null default now(),
    "blockchain_address" text not null
);


alter table "public"."user_achievements" enable row level security;

CREATE UNIQUE INDEX achievements_pkey ON public.achievements USING btree (id);

CREATE INDEX idx_achievements_category ON public.achievements USING btree (category);

CREATE INDEX idx_achievements_rarity ON public.achievements USING btree (rarity);

CREATE INDEX idx_user_achievements_achievement_id ON public.user_achievements USING btree (achievement_id);

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements USING btree (user_id);

CREATE UNIQUE INDEX user_achievements_pkey ON public.user_achievements USING btree (user_id, achievement_id);

alter table "public"."achievements" add constraint "achievements_pkey" PRIMARY KEY using index "achievements_pkey";

alter table "public"."user_achievements" add constraint "user_achievements_pkey" PRIMARY KEY using index "user_achievements_pkey";

alter table "public"."achievements" add constraint "achievements_rarity_check" CHECK ((rarity = ANY (ARRAY['Common'::text, 'Rare'::text, 'Legendary'::text]))) not valid;

alter table "public"."achievements" validate constraint "achievements_rarity_check";

alter table "public"."user_achievements" add constraint "user_achievements_achievement_id_fkey" FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE not valid;

alter table "public"."user_achievements" validate constraint "user_achievements_achievement_id_fkey";

alter table "public"."user_achievements" add constraint "user_achievements_blockchain_address_check" CHECK ((blockchain_address ~ '^0x[a-fA-F0-9]{64}$'::text)) not valid;

alter table "public"."user_achievements" validate constraint "user_achievements_blockchain_address_check";

alter table "public"."user_achievements" add constraint "user_achievements_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_achievements" validate constraint "user_achievements_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.award_achievement(user_id uuid, achievement_id uuid, blockchain_address text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  current_user_role TEXT;
  result JSONB;
BEGIN
  -- Check administrator privileges
  SELECT role INTO current_user_role FROM public.users WHERE id = current_user_id;
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Administrator privileges required';
  END IF;
  
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Check if achievement exists
  IF NOT EXISTS (SELECT 1 FROM public.achievements WHERE id = achievement_id) THEN
    RAISE EXCEPTION 'Achievement not found';
  END IF;
  
  -- Check if the address format is valid
  IF blockchain_address !~ '^0x[a-fA-F0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid SUI blockchain address format';
  END IF;
  
  -- Check if user already has this achievement
  IF EXISTS (SELECT 1 FROM public.user_achievements WHERE user_id = award_achievement.user_id AND achievement_id = award_achievement.achievement_id) THEN
    RAISE EXCEPTION 'User already has this achievement';
  END IF;
  
  -- Award the achievement
  INSERT INTO public.user_achievements (
    user_id,
    achievement_id,
    obtained_at,
    blockchain_address
  )
  VALUES (
    user_id,
    achievement_id,
    NOW(),
    blockchain_address
  );
  
  -- Return result
  SELECT 
    json_build_object(
      'user_id', user_id,
      'achievement_id', achievement_id,
      'title', a.title,
      'rarity', a.rarity,
      'awarded_at', NOW()
    ) INTO result
  FROM public.achievements a
  WHERE a.id = achievement_id;
  
  RETURN result;
END;
$function$
;

create or replace view "public"."user_achievement_details" as  SELECT ua.user_id,
    ua.achievement_id,
    a.title,
    a.description,
    a.image,
    a.category,
    a.rarity,
    ua.obtained_at,
    ua.blockchain_address
   FROM (user_achievements ua
     JOIN achievements a ON ((ua.achievement_id = a.id)));


grant delete on table "public"."achievements" to "anon";

grant insert on table "public"."achievements" to "anon";

grant references on table "public"."achievements" to "anon";

grant select on table "public"."achievements" to "anon";

grant trigger on table "public"."achievements" to "anon";

grant truncate on table "public"."achievements" to "anon";

grant update on table "public"."achievements" to "anon";

grant delete on table "public"."achievements" to "authenticated";

grant insert on table "public"."achievements" to "authenticated";

grant references on table "public"."achievements" to "authenticated";

grant select on table "public"."achievements" to "authenticated";

grant trigger on table "public"."achievements" to "authenticated";

grant truncate on table "public"."achievements" to "authenticated";

grant update on table "public"."achievements" to "authenticated";

grant delete on table "public"."achievements" to "service_role";

grant insert on table "public"."achievements" to "service_role";

grant references on table "public"."achievements" to "service_role";

grant select on table "public"."achievements" to "service_role";

grant trigger on table "public"."achievements" to "service_role";

grant truncate on table "public"."achievements" to "service_role";

grant update on table "public"."achievements" to "service_role";

grant delete on table "public"."user_achievements" to "anon";

grant insert on table "public"."user_achievements" to "anon";

grant references on table "public"."user_achievements" to "anon";

grant select on table "public"."user_achievements" to "anon";

grant trigger on table "public"."user_achievements" to "anon";

grant truncate on table "public"."user_achievements" to "anon";

grant update on table "public"."user_achievements" to "anon";

grant delete on table "public"."user_achievements" to "authenticated";

grant insert on table "public"."user_achievements" to "authenticated";

grant references on table "public"."user_achievements" to "authenticated";

grant select on table "public"."user_achievements" to "authenticated";

grant trigger on table "public"."user_achievements" to "authenticated";

grant truncate on table "public"."user_achievements" to "authenticated";

grant update on table "public"."user_achievements" to "authenticated";

grant delete on table "public"."user_achievements" to "service_role";

grant insert on table "public"."user_achievements" to "service_role";

grant references on table "public"."user_achievements" to "service_role";

grant select on table "public"."user_achievements" to "service_role";

grant trigger on table "public"."user_achievements" to "service_role";

grant truncate on table "public"."user_achievements" to "service_role";

grant update on table "public"."user_achievements" to "service_role";

create policy "Achievements are viewable by everyone"
on "public"."achievements"
as permissive
for select
to public
using (true);


create policy "Only admins can manage achievements"
on "public"."achievements"
as permissive
for all
to public
using ((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())) = 'admin'::text));


create policy "Only admins can award achievements"
on "public"."user_achievements"
as permissive
for insert
to public
with check ((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())) = 'admin'::text));


create policy "Only admins can delete user achievements"
on "public"."user_achievements"
as permissive
for delete
to public
using ((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())) = 'admin'::text));


create policy "Only admins can modify user achievements"
on "public"."user_achievements"
as permissive
for update
to public
using ((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())) = 'admin'::text));


create policy "User achievements are viewable by everyone"
on "public"."user_achievements"
as permissive
for select
to public
using (true);


CREATE TRIGGER set_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION set_updated_at();


