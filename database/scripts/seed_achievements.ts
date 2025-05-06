/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";
import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import { Database } from "../src/types/database";

export const supabaseAdmin = createClient<Database>(
  "http://127.0.0.1:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
  {}
);

// Reproducible random data
faker.seed(1337);

type Achievement = Database["public"]["Tables"]["achievements"]["Insert"];
const ACHIEVEMENTS: Achievement[] = [
  {
    category: "Community",
    description: "Created or contributed to 10 collaborative playlists",
    image: "/media/achievements/collaboration_master.svg",
    rarity: "Common",
    title: "Collaboration Master",
  },
  {
    category: "Community",
    description: "Added valuable music recommendations that received 50+ likes",
    image: "/media/achievements/community_curator.svg",
    rarity: "Common",
    title: "Community Curator",
  },
  {
    category: "Listening",
    description: "Streamed a single artist for over 100 hours",
    image: "/media/achievements/diamond_record.svg",
    rarity: "Common",
    title: "Diamond Record",
  },
  {
    category: "Support",
    description: "Joined during the platform's beta phase",
    image: "/media/achievements/early_supporter.svg",
    rarity: "Common",
    title: "Early Supporter",
  },
  {
    category: "Community",
    description: "Provided helpful feedback that was implemented",
    image: "/media/achievements/feedback_champion.svg",
    rarity: "Common",
    title: "Feedback Champion",
  },
  {
    category: "Commerce",
    description: "Made your first purchase of digital music",
    image: "/media/achievements/first_sale.svg",
    rarity: "Common",
    title: "First Sale",
  },
  {
    category: "Content",
    description: "Uploaded your first original track",
    image: "/media/achievements/first_upload.svg",
    rarity: "Common",
    title: "First Upload",
  },
  {
    category: "Discovery",
    description: "Discovered and played 20 tracks from an emerging genre",
    image: "/media/achievements/genre_pioneer.svg",
    rarity: "Common",
    title: "Genre Pioneer",
  },
  {
    category: "Listening",
    description: "Listened to 500 unique tracks",
    image: "/media/achievements/gold_record.svg",
    rarity: "Common",
    title: "Gold Record",
  },
  {
    category: "Events",
    description: "Participated in a 24-hour music creation challenge",
    image: "/media/achievements/hackathon_hero.svg",
    rarity: "Common",
    title: "Hackathon Hero",
  },
  {
    category: "Listening",
    description: "Maintained a daily listening streak for 30 days",
    image: "/media/achievements/loyal_listener.svg",
    rarity: "Common",
    title: "Loyal Listener",
  },
  {
    category: "Discovery",
    description: "Discovered and played 100 tracks across 10 different genres",
    image: "/media/achievements/music_maven.svg",
    rarity: "Common",
    title: "Music Maven",
  },
  {
    category: "Listening",
    description: "Listened to 1,000 unique tracks",
    image: "/media/achievements/platinum_record.svg",
    rarity: "Common",
    title: "Platinum Record",
  },
  {
    category: "Creation",
    description: "Earned royalties from your remixed tracks",
    image: "/media/achievements/remix_royalty.svg",
    rarity: "Common",
    title: "Remix Royalty",
  },
  {
    category: "Growth",
    description: "Gained 100 followers for your profile",
    image: "/media/achievements/rising_star.svg",
    rarity: "Common",
    title: "Rising Star",
  },
  {
    category: "Listening",
    description: "Listened to 250 unique tracks",
    image: "/media/achievements/silver_record.svg",
    rarity: "Common",
    title: "Silver Record",
  },
  {
    category: "Popularity",
    description: "Had one of your tracks reach the top 100 charts",
    image: "/media/achievements/top_charts.svg",
    rarity: "Common",
    title: "Top Charts",
  },
  {
    category: "Influence",
    description: "Created a playlist that was shared by 50+ users",
    image: "/media/achievements/trendsetter.svg",
    rarity: "Common",
    title: "Trendsetter",
  },
  {
    category: "Verification",
    description: "Completed the artist verification process",
    image: "/media/achievements/verified_artist.svg",
    rarity: "Common",
    title: "Verified Artist",
  },
];

const main = async () => {
  const seed = await createSeedClient({
    // dryRun: true
  });

  const achievements = await supabaseAdmin
    .from("achievements")
    .insert(ACHIEVEMENTS);
  console.dir(achievements);

  console.log("Database seeded successfully!");

  process.exit();
};

main();
