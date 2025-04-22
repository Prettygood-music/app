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

const fakeUUID = "00000000-0000-0000-0000-000000000000";

function generateUser() {
  const email = faker.internet.email();
  const password = "password";

  return {
    email,
    password,
  };
}

function generateArtist(
  id: string
): Database["public"]["Tables"]["artists"]["Insert"] {
  return {
    id,
    artist_name: faker.person.fullName(),
    bio: faker.lorem.paragraph(),
  };
}

const genres: Database["public"]["Tables"]["genres"]["Insert"][] = [
  ...new Set(new Array(10).fill(0).map((_) => faker.music.genre())),
].map((g) => {
  return {
    name: g,
    description: faker.lorem.sentence(),
  };
});

const main = async () => {
  const seed = await createSeedClient({
    // dryRun: true
  });

  // Delete all existing users in the database
  const { data: existingUsers, error } =
    await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    console.error("Error fetching users:", error);
  }
  for (const user of existingUsers.users) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      console.error("Error deleting user:", error);
      process.exit(1);
    }
  }

  const users = new Array(10).fill(0).map(() => generateUser());
  for (const user of users) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (error) {
      console.error("Error creating user:", error);
      process.exit(1);
    }
  }

  const { data: dbUsers } = await supabaseAdmin.auth.admin.listUsers();

  {
    const { error } = await supabaseAdmin
      .from("genres")
      .delete()
      .neq("id", fakeUUID);
    if (error) {
      console.error("Error deleting genres:", error);
    }
  }

  const { data: genresInsert, error: genresError } = await supabaseAdmin
    .from("genres")
    .insert(genres)
    .select("*");
  if (genresError) {
    console.error("Error creating genres:", genresError);
  }

  // NOTE: we're expecting a single user to only own one artist.
  const { data: artists, error: artistsError } = await supabaseAdmin
    .from("artists")
    .insert(
      new Array(3)
        .fill(0)
        .map((_, i) =>
          generateArtist(faker.helpers.arrayElement(dbUsers.users).id)
        )
    )
    .select("*");
  if (artistsError) {
    console.error("Error creating artists:", artistsError);
  }

  const { data: albums, error: albumsError } = await supabaseAdmin
    .from("albums")
    .insert([
      {
        artist_id: artists![0].id,
        title: faker.music.songName(),
        release_date: faker.date.past().toISOString(),
        cover_url: faker.image.url(),
        description: faker.lorem.paragraph(),
        genre: [faker.helpers.arrayElement(genresInsert!).id],
        type: "album",
      },
    ]);
  if (albumsError) {
    console.error("Error creating albums:", albumsError);
  }

  // TODO: use supabase client to seed

  // Truncate all tables in the database
  //await seed.$resetDatabase(["auth.users", "public.users"]);
  //await seed.auth_users((x) => x(10, {}));

  // Seed the database with 10 users
  //await seed.users((x) => x(10));

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log("Database seeded successfully!");

  process.exit();
};

main();
