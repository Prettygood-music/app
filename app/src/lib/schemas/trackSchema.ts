import { z } from 'zod';

export const trackCreationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // Duration will be extracted from the file itself
  album_id: z.string().optional().nullable(),
  track_number: z.number().int().positive().optional().nullable(),
  genre: z.array(z.string()).default([]),
  explicit: z.boolean().default(false),
  release_date: z.string().optional().nullable(),
  isrc: z.string().optional().nullable(),
  lyrics: z.string().optional().nullable(),
  duration: z.number(),
  // These will be file uploads
  audio_file: z.instanceof(File, { message: "Audio file is required" }),
  cover_image: z.instanceof(File).optional().nullable(),
});

export type TrackCreationSchema = z.infer<typeof trackCreationSchema>;
