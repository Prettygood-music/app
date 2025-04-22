import { z } from 'zod';
import { Json } from './types/database';
export declare const jsonSchema: z.ZodSchema<Json>;
export declare const publicAlbumGenresRowSchemaSchema: z.ZodObject<{
    album_id: z.ZodString;
    genre_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string;
    genre_id: string;
}, {
    album_id: string;
    genre_id: string;
}>;
export declare const publicAlbumGenresInsertSchemaSchema: z.ZodObject<{
    album_id: z.ZodString;
    genre_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string;
    genre_id: string;
}, {
    album_id: string;
    genre_id: string;
}>;
export declare const publicAlbumGenresUpdateSchemaSchema: z.ZodObject<{
    album_id: z.ZodOptional<z.ZodString>;
    genre_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    album_id?: string | undefined;
    genre_id?: string | undefined;
}, {
    album_id?: string | undefined;
    genre_id?: string | undefined;
}>;
export declare const publicAlbumGenresRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"album_genres_album_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"album_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"albums">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "album_genres_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "album_genres_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"album_genres_genre_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"genre_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"genres">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "album_genres_genre_id_fkey";
    columns: ["genre_id"];
    isOneToOne: false;
    referencedRelation: "genres";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "album_genres_genre_id_fkey";
    columns: ["genre_id"];
    isOneToOne: false;
    referencedRelation: "genres";
    referencedColumns: ["id"];
}>], null>;
export declare const publicAlbumLikesRowSchemaSchema: z.ZodObject<{
    album_id: z.ZodString;
    liked_at: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string;
    user_id: string;
    liked_at: string;
}, {
    album_id: string;
    user_id: string;
    liked_at: string;
}>;
export declare const publicAlbumLikesInsertSchemaSchema: z.ZodObject<{
    album_id: z.ZodString;
    liked_at: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string;
    user_id: string;
    liked_at?: string | undefined;
}, {
    album_id: string;
    user_id: string;
    liked_at?: string | undefined;
}>;
export declare const publicAlbumLikesUpdateSchemaSchema: z.ZodObject<{
    album_id: z.ZodOptional<z.ZodString>;
    liked_at: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    album_id?: string | undefined;
    user_id?: string | undefined;
    liked_at?: string | undefined;
}, {
    album_id?: string | undefined;
    user_id?: string | undefined;
    liked_at?: string | undefined;
}>;
export declare const publicAlbumLikesRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"album_likes_album_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"album_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"albums">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "album_likes_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "album_likes_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"album_likes_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "album_likes_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "album_likes_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicAlbumsRowSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
    cover_url: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    genre: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    id: z.ZodString;
    release_date: z.ZodNullable<z.ZodString>;
    title: z.ZodString;
    type: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    artist_id: string;
    type: string | null;
    cover_url: string | null;
    created_at: string;
    description: string | null;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
}, {
    id: string;
    artist_id: string;
    type: string | null;
    cover_url: string | null;
    created_at: string;
    description: string | null;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
}>;
export declare const publicAlbumsInsertSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
    cover_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    genre: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    id: z.ZodOptional<z.ZodString>;
    release_date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    title: z.ZodString;
    type: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    artist_id: string;
    title: string;
    id?: string | undefined;
    type?: string | null | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    updated_at?: string | undefined;
}, {
    artist_id: string;
    title: string;
    id?: string | undefined;
    type?: string | null | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    updated_at?: string | undefined;
}>;
export declare const publicAlbumsUpdateSchemaSchema: z.ZodObject<{
    artist_id: z.ZodOptional<z.ZodString>;
    cover_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    genre: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    id: z.ZodOptional<z.ZodString>;
    release_date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    artist_id?: string | undefined;
    type?: string | null | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    title?: string | undefined;
    updated_at?: string | undefined;
}, {
    id?: string | undefined;
    artist_id?: string | undefined;
    type?: string | null | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    title?: string | undefined;
    updated_at?: string | undefined;
}>;
export declare const publicAlbumsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"albums_artist_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"artist_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"artists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "albums_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "albums_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}>], null>;
export declare const publicArtistFollowersRowSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
    followed_at: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    artist_id: string;
    followed_at: string;
}, {
    user_id: string;
    artist_id: string;
    followed_at: string;
}>;
export declare const publicArtistFollowersInsertSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
    followed_at: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    artist_id: string;
    followed_at?: string | undefined;
}, {
    user_id: string;
    artist_id: string;
    followed_at?: string | undefined;
}>;
export declare const publicArtistFollowersUpdateSchemaSchema: z.ZodObject<{
    artist_id: z.ZodOptional<z.ZodString>;
    followed_at: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id?: string | undefined;
    artist_id?: string | undefined;
    followed_at?: string | undefined;
}, {
    user_id?: string | undefined;
    artist_id?: string | undefined;
    followed_at?: string | undefined;
}>;
export declare const publicArtistFollowersRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"artist_followers_artist_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"artist_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"artists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "artist_followers_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "artist_followers_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"artist_followers_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "artist_followers_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "artist_followers_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicArtistGenresRowSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
    genre_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    genre_id: string;
    artist_id: string;
}, {
    genre_id: string;
    artist_id: string;
}>;
export declare const publicArtistGenresInsertSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
    genre_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    genre_id: string;
    artist_id: string;
}, {
    genre_id: string;
    artist_id: string;
}>;
export declare const publicArtistGenresUpdateSchemaSchema: z.ZodObject<{
    artist_id: z.ZodOptional<z.ZodString>;
    genre_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    genre_id?: string | undefined;
    artist_id?: string | undefined;
}, {
    genre_id?: string | undefined;
    artist_id?: string | undefined;
}>;
export declare const publicArtistGenresRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"artist_genres_artist_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"artist_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"artists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "artist_genres_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "artist_genres_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"artist_genres_genre_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"genre_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"genres">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "artist_genres_genre_id_fkey";
    columns: ["genre_id"];
    isOneToOne: false;
    referencedRelation: "genres";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "artist_genres_genre_id_fkey";
    columns: ["genre_id"];
    isOneToOne: false;
    referencedRelation: "genres";
    referencedColumns: ["id"];
}>], null>;
export declare const publicArtistsRowSchemaSchema: z.ZodObject<{
    application_date: z.ZodNullable<z.ZodString>;
    application_notes: z.ZodNullable<z.ZodString>;
    approved: z.ZodNullable<z.ZodBoolean>;
    artist_name: z.ZodString;
    bio: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    genre: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    id: z.ZodString;
    location: z.ZodNullable<z.ZodString>;
    social_links: z.ZodNullable<z.ZodType<Json, z.ZodTypeDef, Json>>;
    updated_at: z.ZodString;
    verified: z.ZodNullable<z.ZodBoolean>;
    website: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    genre: string[] | null;
    updated_at: string;
    application_date: string | null;
    application_notes: string | null;
    approved: boolean | null;
    artist_name: string;
    bio: string | null;
    location: string | null;
    social_links: Json;
    verified: boolean | null;
    website: string | null;
}, {
    id: string;
    created_at: string;
    genre: string[] | null;
    updated_at: string;
    application_date: string | null;
    application_notes: string | null;
    approved: boolean | null;
    artist_name: string;
    bio: string | null;
    location: string | null;
    social_links: Json;
    verified: boolean | null;
    website: string | null;
}>;
export declare const publicArtistsInsertSchemaSchema: z.ZodObject<{
    application_date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    application_notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    approved: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    artist_name: z.ZodString;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    genre: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    id: z.ZodString;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    social_links: z.ZodNullable<z.ZodOptional<z.ZodType<Json, z.ZodTypeDef, Json>>>;
    updated_at: z.ZodOptional<z.ZodString>;
    verified: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    website: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    artist_name: string;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    updated_at?: string | undefined;
    application_date?: string | null | undefined;
    application_notes?: string | null | undefined;
    approved?: boolean | null | undefined;
    bio?: string | null | undefined;
    location?: string | null | undefined;
    social_links?: Json | undefined;
    verified?: boolean | null | undefined;
    website?: string | null | undefined;
}, {
    id: string;
    artist_name: string;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    updated_at?: string | undefined;
    application_date?: string | null | undefined;
    application_notes?: string | null | undefined;
    approved?: boolean | null | undefined;
    bio?: string | null | undefined;
    location?: string | null | undefined;
    social_links?: Json | undefined;
    verified?: boolean | null | undefined;
    website?: string | null | undefined;
}>;
export declare const publicArtistsUpdateSchemaSchema: z.ZodObject<{
    application_date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    application_notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    approved: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    artist_name: z.ZodOptional<z.ZodString>;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    genre: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    id: z.ZodOptional<z.ZodString>;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    social_links: z.ZodNullable<z.ZodOptional<z.ZodType<Json, z.ZodTypeDef, Json>>>;
    updated_at: z.ZodOptional<z.ZodString>;
    verified: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    website: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    updated_at?: string | undefined;
    application_date?: string | null | undefined;
    application_notes?: string | null | undefined;
    approved?: boolean | null | undefined;
    artist_name?: string | undefined;
    bio?: string | null | undefined;
    location?: string | null | undefined;
    social_links?: Json | undefined;
    verified?: boolean | null | undefined;
    website?: string | null | undefined;
}, {
    id?: string | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    updated_at?: string | undefined;
    application_date?: string | null | undefined;
    application_notes?: string | null | undefined;
    approved?: boolean | null | undefined;
    artist_name?: string | undefined;
    bio?: string | null | undefined;
    location?: string | null | undefined;
    social_links?: Json | undefined;
    verified?: boolean | null | undefined;
    website?: string | null | undefined;
}>;
export declare const publicArtistsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"artists_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
    isOneToOne: z.ZodLiteral<true>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "artists_id_fkey";
    columns: ["id"];
    isOneToOne: true;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "artists_id_fkey";
    columns: ["id"];
    isOneToOne: true;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicGenresRowSchemaSchema: z.ZodObject<{
    color: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    image_url: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
    popularity: z.ZodNullable<z.ZodNumber>;
    slug: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    description: string | null;
    updated_at: string;
    color: string | null;
    image_url: string | null;
    name: string;
    popularity: number | null;
    slug: string | null;
}, {
    id: string;
    created_at: string;
    description: string | null;
    updated_at: string;
    color: string | null;
    image_url: string | null;
    name: string;
    popularity: number | null;
    slug: string | null;
}>;
export declare const publicGenresInsertSchemaSchema: z.ZodObject<{
    color: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    image_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    name: z.ZodString;
    popularity: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    slug: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id?: string | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    updated_at?: string | undefined;
    color?: string | null | undefined;
    image_url?: string | null | undefined;
    popularity?: number | null | undefined;
    slug?: string | null | undefined;
}, {
    name: string;
    id?: string | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    updated_at?: string | undefined;
    color?: string | null | undefined;
    image_url?: string | null | undefined;
    popularity?: number | null | undefined;
    slug?: string | null | undefined;
}>;
export declare const publicGenresUpdateSchemaSchema: z.ZodObject<{
    color: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    image_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    name: z.ZodOptional<z.ZodString>;
    popularity: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    slug: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    updated_at?: string | undefined;
    color?: string | null | undefined;
    image_url?: string | null | undefined;
    name?: string | undefined;
    popularity?: number | null | undefined;
    slug?: string | null | undefined;
}, {
    id?: string | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    updated_at?: string | undefined;
    color?: string | null | undefined;
    image_url?: string | null | undefined;
    name?: string | undefined;
    popularity?: number | null | undefined;
    slug?: string | null | undefined;
}>;
export declare const publicPaymentStatusHistoryRowSchemaSchema: z.ZodObject<{
    changed_at: z.ZodString;
    changed_by: z.ZodString;
    id: z.ZodString;
    new_status: z.ZodString;
    notes: z.ZodNullable<z.ZodString>;
    old_status: z.ZodNullable<z.ZodString>;
    payment_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    payment_id: string;
    changed_at: string;
    changed_by: string;
    new_status: string;
    notes: string | null;
    old_status: string | null;
}, {
    id: string;
    payment_id: string;
    changed_at: string;
    changed_by: string;
    new_status: string;
    notes: string | null;
    old_status: string | null;
}>;
export declare const publicPaymentStatusHistoryInsertSchemaSchema: z.ZodObject<{
    changed_at: z.ZodOptional<z.ZodString>;
    changed_by: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    new_status: z.ZodString;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    old_status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    payment_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    payment_id: string;
    new_status: string;
    id?: string | undefined;
    changed_at?: string | undefined;
    changed_by?: string | undefined;
    notes?: string | null | undefined;
    old_status?: string | null | undefined;
}, {
    payment_id: string;
    new_status: string;
    id?: string | undefined;
    changed_at?: string | undefined;
    changed_by?: string | undefined;
    notes?: string | null | undefined;
    old_status?: string | null | undefined;
}>;
export declare const publicPaymentStatusHistoryUpdateSchemaSchema: z.ZodObject<{
    changed_at: z.ZodOptional<z.ZodString>;
    changed_by: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    new_status: z.ZodOptional<z.ZodString>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    old_status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    payment_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    payment_id?: string | undefined;
    changed_at?: string | undefined;
    changed_by?: string | undefined;
    new_status?: string | undefined;
    notes?: string | null | undefined;
    old_status?: string | null | undefined;
}, {
    id?: string | undefined;
    payment_id?: string | undefined;
    changed_at?: string | undefined;
    changed_by?: string | undefined;
    new_status?: string | undefined;
    notes?: string | null | undefined;
    old_status?: string | null | undefined;
}>;
export declare const publicPaymentStatusHistoryRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"payment_status_history_payment_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"payment_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"payments">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "payment_status_history_payment_id_fkey";
    columns: ["payment_id"];
    isOneToOne: false;
    referencedRelation: "payments";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "payment_status_history_payment_id_fkey";
    columns: ["payment_id"];
    isOneToOne: false;
    referencedRelation: "payments";
    referencedColumns: ["id"];
}>], null>;
export declare const publicPaymentsRowSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodString>;
    amount: z.ZodNumber;
    created_at: z.ZodString;
    currency: z.ZodString;
    id: z.ZodString;
    message: z.ZodNullable<z.ZodString>;
    payment_type: z.ZodString;
    recipient_id: z.ZodString;
    sender_id: z.ZodString;
    status: z.ZodString;
    track_id: z.ZodNullable<z.ZodString>;
    transaction_hash: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string | null;
    id: string;
    recipient_id: string;
    sender_id: string;
    track_id: string | null;
    status: string;
    message: string | null;
    created_at: string;
    updated_at: string;
    amount: number;
    currency: string;
    payment_type: string;
    transaction_hash: string | null;
}, {
    album_id: string | null;
    id: string;
    recipient_id: string;
    sender_id: string;
    track_id: string | null;
    status: string;
    message: string | null;
    created_at: string;
    updated_at: string;
    amount: number;
    currency: string;
    payment_type: string;
    transaction_hash: string | null;
}>;
export declare const publicPaymentsInsertSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    amount: z.ZodNumber;
    created_at: z.ZodOptional<z.ZodString>;
    currency: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    message: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    payment_type: z.ZodString;
    recipient_id: z.ZodString;
    sender_id: z.ZodString;
    status: z.ZodString;
    track_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    transaction_hash: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    recipient_id: string;
    sender_id: string;
    status: string;
    amount: number;
    payment_type: string;
    album_id?: string | null | undefined;
    id?: string | undefined;
    track_id?: string | null | undefined;
    message?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    currency?: string | undefined;
    transaction_hash?: string | null | undefined;
}, {
    recipient_id: string;
    sender_id: string;
    status: string;
    amount: number;
    payment_type: string;
    album_id?: string | null | undefined;
    id?: string | undefined;
    track_id?: string | null | undefined;
    message?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    currency?: string | undefined;
    transaction_hash?: string | null | undefined;
}>;
export declare const publicPaymentsUpdateSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    amount: z.ZodOptional<z.ZodNumber>;
    created_at: z.ZodOptional<z.ZodString>;
    currency: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    message: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    payment_type: z.ZodOptional<z.ZodString>;
    recipient_id: z.ZodOptional<z.ZodString>;
    sender_id: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    track_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    transaction_hash: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    album_id?: string | null | undefined;
    id?: string | undefined;
    recipient_id?: string | undefined;
    sender_id?: string | undefined;
    track_id?: string | null | undefined;
    status?: string | undefined;
    message?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    amount?: number | undefined;
    currency?: string | undefined;
    payment_type?: string | undefined;
    transaction_hash?: string | null | undefined;
}, {
    album_id?: string | null | undefined;
    id?: string | undefined;
    recipient_id?: string | undefined;
    sender_id?: string | undefined;
    track_id?: string | null | undefined;
    status?: string | undefined;
    message?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    amount?: number | undefined;
    currency?: string | undefined;
    payment_type?: string | undefined;
    transaction_hash?: string | null | undefined;
}>;
export declare const publicPaymentsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"payments_album_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"album_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"albums">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "payments_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "payments_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"payments_recipient_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"recipient_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"artists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "payments_recipient_id_fkey";
    columns: ["recipient_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "payments_recipient_id_fkey";
    columns: ["recipient_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"payments_sender_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"sender_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "payments_sender_id_fkey";
    columns: ["sender_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "payments_sender_id_fkey";
    columns: ["sender_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"payments_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "payments_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "payments_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"payments_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks_with_details">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "payments_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "payments_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}>], null>;
export declare const publicPlayHistoryRowSchemaSchema: z.ZodObject<{
    client_ip: z.ZodNullable<z.ZodString>;
    completed: z.ZodNullable<z.ZodBoolean>;
    context_id: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    play_duration: z.ZodNullable<z.ZodNumber>;
    played_at: z.ZodString;
    source: z.ZodNullable<z.ZodString>;
    track_id: z.ZodString;
    user_agent: z.ZodNullable<z.ZodString>;
    user_id: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string | null;
    track_id: string;
    client_ip: string | null;
    completed: boolean | null;
    context_id: string | null;
    play_duration: number | null;
    played_at: string;
    source: string | null;
    user_agent: string | null;
}, {
    id: string;
    user_id: string | null;
    track_id: string;
    client_ip: string | null;
    completed: boolean | null;
    context_id: string | null;
    play_duration: number | null;
    played_at: string;
    source: string | null;
    user_agent: string | null;
}>;
export declare const publicPlayHistoryInsertSchemaSchema: z.ZodObject<{
    client_ip: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    completed: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    context_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    play_duration: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    played_at: z.ZodOptional<z.ZodString>;
    source: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    track_id: z.ZodString;
    user_agent: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    user_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    track_id: string;
    id?: string | undefined;
    user_id?: string | null | undefined;
    client_ip?: string | null | undefined;
    completed?: boolean | null | undefined;
    context_id?: string | null | undefined;
    play_duration?: number | null | undefined;
    played_at?: string | undefined;
    source?: string | null | undefined;
    user_agent?: string | null | undefined;
}, {
    track_id: string;
    id?: string | undefined;
    user_id?: string | null | undefined;
    client_ip?: string | null | undefined;
    completed?: boolean | null | undefined;
    context_id?: string | null | undefined;
    play_duration?: number | null | undefined;
    played_at?: string | undefined;
    source?: string | null | undefined;
    user_agent?: string | null | undefined;
}>;
export declare const publicPlayHistoryUpdateSchemaSchema: z.ZodObject<{
    client_ip: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    completed: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    context_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    play_duration: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    played_at: z.ZodOptional<z.ZodString>;
    source: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    track_id: z.ZodOptional<z.ZodString>;
    user_agent: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    user_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    user_id?: string | null | undefined;
    track_id?: string | undefined;
    client_ip?: string | null | undefined;
    completed?: boolean | null | undefined;
    context_id?: string | null | undefined;
    play_duration?: number | null | undefined;
    played_at?: string | undefined;
    source?: string | null | undefined;
    user_agent?: string | null | undefined;
}, {
    id?: string | undefined;
    user_id?: string | null | undefined;
    track_id?: string | undefined;
    client_ip?: string | null | undefined;
    completed?: boolean | null | undefined;
    context_id?: string | null | undefined;
    play_duration?: number | null | undefined;
    played_at?: string | undefined;
    source?: string | null | undefined;
    user_agent?: string | null | undefined;
}>;
export declare const publicPlayHistoryRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"play_history_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "play_history_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "play_history_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"play_history_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks_with_details">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "play_history_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "play_history_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"play_history_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "play_history_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "play_history_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicPlaylistLikesRowSchemaSchema: z.ZodObject<{
    liked_at: z.ZodString;
    playlist_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    playlist_id: string;
    liked_at: string;
}, {
    user_id: string;
    playlist_id: string;
    liked_at: string;
}>;
export declare const publicPlaylistLikesInsertSchemaSchema: z.ZodObject<{
    liked_at: z.ZodOptional<z.ZodString>;
    playlist_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    playlist_id: string;
    liked_at?: string | undefined;
}, {
    user_id: string;
    playlist_id: string;
    liked_at?: string | undefined;
}>;
export declare const publicPlaylistLikesUpdateSchemaSchema: z.ZodObject<{
    liked_at: z.ZodOptional<z.ZodString>;
    playlist_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id?: string | undefined;
    playlist_id?: string | undefined;
    liked_at?: string | undefined;
}, {
    user_id?: string | undefined;
    playlist_id?: string | undefined;
    liked_at?: string | undefined;
}>;
export declare const publicPlaylistLikesRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"playlist_likes_playlist_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"playlist_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"playlists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "playlist_likes_playlist_id_fkey";
    columns: ["playlist_id"];
    isOneToOne: false;
    referencedRelation: "playlists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "playlist_likes_playlist_id_fkey";
    columns: ["playlist_id"];
    isOneToOne: false;
    referencedRelation: "playlists";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"playlist_likes_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "playlist_likes_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "playlist_likes_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicPlaylistTracksRowSchemaSchema: z.ZodObject<{
    added_at: z.ZodString;
    added_by: z.ZodString;
    playlist_id: z.ZodString;
    position: z.ZodNumber;
    track_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    track_id: string;
    playlist_id: string;
    added_by: string;
    added_at: string;
    position: number;
}, {
    track_id: string;
    playlist_id: string;
    added_by: string;
    added_at: string;
    position: number;
}>;
export declare const publicPlaylistTracksInsertSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    added_by: z.ZodString;
    playlist_id: z.ZodString;
    position: z.ZodNumber;
    track_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    track_id: string;
    playlist_id: string;
    added_by: string;
    position: number;
    added_at?: string | undefined;
}, {
    track_id: string;
    playlist_id: string;
    added_by: string;
    position: number;
    added_at?: string | undefined;
}>;
export declare const publicPlaylistTracksUpdateSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    added_by: z.ZodOptional<z.ZodString>;
    playlist_id: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodNumber>;
    track_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    track_id?: string | undefined;
    playlist_id?: string | undefined;
    added_by?: string | undefined;
    added_at?: string | undefined;
    position?: number | undefined;
}, {
    track_id?: string | undefined;
    playlist_id?: string | undefined;
    added_by?: string | undefined;
    added_at?: string | undefined;
    position?: number | undefined;
}>;
export declare const publicPlaylistTracksRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"playlist_tracks_added_by_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"added_by">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "playlist_tracks_added_by_fkey";
    columns: ["added_by"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "playlist_tracks_added_by_fkey";
    columns: ["added_by"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"playlist_tracks_playlist_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"playlist_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"playlists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "playlist_tracks_playlist_id_fkey";
    columns: ["playlist_id"];
    isOneToOne: false;
    referencedRelation: "playlists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "playlist_tracks_playlist_id_fkey";
    columns: ["playlist_id"];
    isOneToOne: false;
    referencedRelation: "playlists";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"playlist_tracks_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "playlist_tracks_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "playlist_tracks_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"playlist_tracks_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks_with_details">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "playlist_tracks_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "playlist_tracks_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}>], null>;
export declare const publicPlaylistsRowSchemaSchema: z.ZodObject<{
    cover_url: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    is_public: z.ZodNullable<z.ZodBoolean>;
    name: z.ZodString;
    updated_at: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
    cover_url: string | null;
    created_at: string;
    description: string | null;
    updated_at: string;
    name: string;
    is_public: boolean | null;
}, {
    id: string;
    user_id: string;
    cover_url: string | null;
    created_at: string;
    description: string | null;
    updated_at: string;
    name: string;
    is_public: boolean | null;
}>;
export declare const publicPlaylistsInsertSchemaSchema: z.ZodObject<{
    cover_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    is_public: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    name: z.ZodString;
    updated_at: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    name: string;
    id?: string | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    updated_at?: string | undefined;
    is_public?: boolean | null | undefined;
}, {
    user_id: string;
    name: string;
    id?: string | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    updated_at?: string | undefined;
    is_public?: boolean | null | undefined;
}>;
export declare const publicPlaylistsUpdateSchemaSchema: z.ZodObject<{
    cover_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    is_public: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    name: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    user_id?: string | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    updated_at?: string | undefined;
    name?: string | undefined;
    is_public?: boolean | null | undefined;
}, {
    id?: string | undefined;
    user_id?: string | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    description?: string | null | undefined;
    updated_at?: string | undefined;
    name?: string | undefined;
    is_public?: boolean | null | undefined;
}>;
export declare const publicPlaylistsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"playlists_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "playlists_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "playlists_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicRelatedGenresRowSchemaSchema: z.ZodObject<{
    genre_id: z.ZodString;
    related_genre_id: z.ZodString;
    weight: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    genre_id: string;
    related_genre_id: string;
    weight: number | null;
}, {
    genre_id: string;
    related_genre_id: string;
    weight: number | null;
}>;
export declare const publicRelatedGenresInsertSchemaSchema: z.ZodObject<{
    genre_id: z.ZodString;
    related_genre_id: z.ZodString;
    weight: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    genre_id: string;
    related_genre_id: string;
    weight?: number | null | undefined;
}, {
    genre_id: string;
    related_genre_id: string;
    weight?: number | null | undefined;
}>;
export declare const publicRelatedGenresUpdateSchemaSchema: z.ZodObject<{
    genre_id: z.ZodOptional<z.ZodString>;
    related_genre_id: z.ZodOptional<z.ZodString>;
    weight: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    genre_id?: string | undefined;
    related_genre_id?: string | undefined;
    weight?: number | null | undefined;
}, {
    genre_id?: string | undefined;
    related_genre_id?: string | undefined;
    weight?: number | null | undefined;
}>;
export declare const publicRelatedGenresRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"related_genres_genre_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"genre_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"genres">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "related_genres_genre_id_fkey";
    columns: ["genre_id"];
    isOneToOne: false;
    referencedRelation: "genres";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "related_genres_genre_id_fkey";
    columns: ["genre_id"];
    isOneToOne: false;
    referencedRelation: "genres";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"related_genres_related_genre_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"related_genre_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"genres">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "related_genres_related_genre_id_fkey";
    columns: ["related_genre_id"];
    isOneToOne: false;
    referencedRelation: "genres";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "related_genres_related_genre_id_fkey";
    columns: ["related_genre_id"];
    isOneToOne: false;
    referencedRelation: "genres";
    referencedColumns: ["id"];
}>], null>;
export declare const publicTrackGenresRowSchemaSchema: z.ZodObject<{
    genre_id: z.ZodString;
    track_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    genre_id: string;
    track_id: string;
}, {
    genre_id: string;
    track_id: string;
}>;
export declare const publicTrackGenresInsertSchemaSchema: z.ZodObject<{
    genre_id: z.ZodString;
    track_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    genre_id: string;
    track_id: string;
}, {
    genre_id: string;
    track_id: string;
}>;
export declare const publicTrackGenresUpdateSchemaSchema: z.ZodObject<{
    genre_id: z.ZodOptional<z.ZodString>;
    track_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    genre_id?: string | undefined;
    track_id?: string | undefined;
}, {
    genre_id?: string | undefined;
    track_id?: string | undefined;
}>;
export declare const publicTrackGenresRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"track_genres_genre_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"genre_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"genres">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "track_genres_genre_id_fkey";
    columns: ["genre_id"];
    isOneToOne: false;
    referencedRelation: "genres";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "track_genres_genre_id_fkey";
    columns: ["genre_id"];
    isOneToOne: false;
    referencedRelation: "genres";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"track_genres_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "track_genres_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "track_genres_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"track_genres_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks_with_details">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "track_genres_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "track_genres_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}>], null>;
export declare const publicTrackLikesRowSchemaSchema: z.ZodObject<{
    liked_at: z.ZodString;
    track_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    track_id: string;
    liked_at: string;
}, {
    user_id: string;
    track_id: string;
    liked_at: string;
}>;
export declare const publicTrackLikesInsertSchemaSchema: z.ZodObject<{
    liked_at: z.ZodOptional<z.ZodString>;
    track_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    track_id: string;
    liked_at?: string | undefined;
}, {
    user_id: string;
    track_id: string;
    liked_at?: string | undefined;
}>;
export declare const publicTrackLikesUpdateSchemaSchema: z.ZodObject<{
    liked_at: z.ZodOptional<z.ZodString>;
    track_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id?: string | undefined;
    track_id?: string | undefined;
    liked_at?: string | undefined;
}, {
    user_id?: string | undefined;
    track_id?: string | undefined;
    liked_at?: string | undefined;
}>;
export declare const publicTrackLikesRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"track_likes_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "track_likes_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "track_likes_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"track_likes_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks_with_details">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "track_likes_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "track_likes_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"track_likes_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "track_likes_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "track_likes_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicTracksRowSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodString>;
    artist_id: z.ZodString;
    audio_url: z.ZodString;
    cover_url: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    duration: z.ZodNumber;
    explicit: z.ZodNullable<z.ZodBoolean>;
    genre: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    id: z.ZodString;
    isrc: z.ZodNullable<z.ZodString>;
    lyrics: z.ZodNullable<z.ZodString>;
    release_date: z.ZodNullable<z.ZodString>;
    title: z.ZodString;
    track_number: z.ZodNullable<z.ZodNumber>;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string | null;
    id: string;
    artist_id: string;
    cover_url: string | null;
    created_at: string;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
    audio_url: string;
    duration: number;
    explicit: boolean | null;
    isrc: string | null;
    lyrics: string | null;
    track_number: number | null;
}, {
    album_id: string | null;
    id: string;
    artist_id: string;
    cover_url: string | null;
    created_at: string;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
    audio_url: string;
    duration: number;
    explicit: boolean | null;
    isrc: string | null;
    lyrics: string | null;
    track_number: number | null;
}>;
export declare const publicTracksInsertSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    artist_id: z.ZodString;
    audio_url: z.ZodString;
    cover_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    duration: z.ZodNumber;
    explicit: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    genre: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    id: z.ZodOptional<z.ZodString>;
    isrc: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    lyrics: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    release_date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    title: z.ZodString;
    track_number: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    artist_id: string;
    title: string;
    audio_url: string;
    duration: number;
    album_id?: string | null | undefined;
    id?: string | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    updated_at?: string | undefined;
    explicit?: boolean | null | undefined;
    isrc?: string | null | undefined;
    lyrics?: string | null | undefined;
    track_number?: number | null | undefined;
}, {
    artist_id: string;
    title: string;
    audio_url: string;
    duration: number;
    album_id?: string | null | undefined;
    id?: string | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    updated_at?: string | undefined;
    explicit?: boolean | null | undefined;
    isrc?: string | null | undefined;
    lyrics?: string | null | undefined;
    track_number?: number | null | undefined;
}>;
export declare const publicTracksUpdateSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    artist_id: z.ZodOptional<z.ZodString>;
    audio_url: z.ZodOptional<z.ZodString>;
    cover_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    duration: z.ZodOptional<z.ZodNumber>;
    explicit: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    genre: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    id: z.ZodOptional<z.ZodString>;
    isrc: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    lyrics: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    release_date: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    title: z.ZodOptional<z.ZodString>;
    track_number: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    album_id?: string | null | undefined;
    id?: string | undefined;
    artist_id?: string | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    title?: string | undefined;
    updated_at?: string | undefined;
    audio_url?: string | undefined;
    duration?: number | undefined;
    explicit?: boolean | null | undefined;
    isrc?: string | null | undefined;
    lyrics?: string | null | undefined;
    track_number?: number | null | undefined;
}, {
    album_id?: string | null | undefined;
    id?: string | undefined;
    artist_id?: string | undefined;
    cover_url?: string | null | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    title?: string | undefined;
    updated_at?: string | undefined;
    audio_url?: string | undefined;
    duration?: number | undefined;
    explicit?: boolean | null | undefined;
    isrc?: string | null | undefined;
    lyrics?: string | null | undefined;
    track_number?: number | null | undefined;
}>;
export declare const publicTracksRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"tracks_album_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"album_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"albums">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "tracks_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "tracks_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"tracks_artist_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"artist_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"artists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "tracks_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "tracks_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}>], null>;
export declare const publicUserLibraryAlbumsRowSchemaSchema: z.ZodObject<{
    added_at: z.ZodString;
    album_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string;
    user_id: string;
    added_at: string;
}, {
    album_id: string;
    user_id: string;
    added_at: string;
}>;
export declare const publicUserLibraryAlbumsInsertSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    album_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string;
    user_id: string;
    added_at?: string | undefined;
}, {
    album_id: string;
    user_id: string;
    added_at?: string | undefined;
}>;
export declare const publicUserLibraryAlbumsUpdateSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    album_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    album_id?: string | undefined;
    user_id?: string | undefined;
    added_at?: string | undefined;
}, {
    album_id?: string | undefined;
    user_id?: string | undefined;
    added_at?: string | undefined;
}>;
export declare const publicUserLibraryAlbumsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_library_albums_album_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"album_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"albums">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_library_albums_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_library_albums_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_library_albums_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_library_albums_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_library_albums_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicUserLibraryTracksRowSchemaSchema: z.ZodObject<{
    added_at: z.ZodString;
    track_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    track_id: string;
    added_at: string;
}, {
    user_id: string;
    track_id: string;
    added_at: string;
}>;
export declare const publicUserLibraryTracksInsertSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    track_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    track_id: string;
    added_at?: string | undefined;
}, {
    user_id: string;
    track_id: string;
    added_at?: string | undefined;
}>;
export declare const publicUserLibraryTracksUpdateSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    track_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id?: string | undefined;
    track_id?: string | undefined;
    added_at?: string | undefined;
}, {
    user_id?: string | undefined;
    track_id?: string | undefined;
    added_at?: string | undefined;
}>;
export declare const publicUserLibraryTracksRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_library_tracks_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_library_tracks_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_library_tracks_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_library_tracks_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks_with_details">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_library_tracks_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_library_tracks_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_library_tracks_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_library_tracks_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_library_tracks_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicUserRecentlyPlayedRowSchemaSchema: z.ZodObject<{
    context_id: z.ZodNullable<z.ZodString>;
    context_type: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    played_at: z.ZodString;
    track_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
    track_id: string;
    context_id: string | null;
    played_at: string;
    context_type: string | null;
}, {
    id: string;
    user_id: string;
    track_id: string;
    context_id: string | null;
    played_at: string;
    context_type: string | null;
}>;
export declare const publicUserRecentlyPlayedInsertSchemaSchema: z.ZodObject<{
    context_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    context_type: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    played_at: z.ZodOptional<z.ZodString>;
    track_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    track_id: string;
    id?: string | undefined;
    context_id?: string | null | undefined;
    played_at?: string | undefined;
    context_type?: string | null | undefined;
}, {
    user_id: string;
    track_id: string;
    id?: string | undefined;
    context_id?: string | null | undefined;
    played_at?: string | undefined;
    context_type?: string | null | undefined;
}>;
export declare const publicUserRecentlyPlayedUpdateSchemaSchema: z.ZodObject<{
    context_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    context_type: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    played_at: z.ZodOptional<z.ZodString>;
    track_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    user_id?: string | undefined;
    track_id?: string | undefined;
    context_id?: string | null | undefined;
    played_at?: string | undefined;
    context_type?: string | null | undefined;
}, {
    id?: string | undefined;
    user_id?: string | undefined;
    track_id?: string | undefined;
    context_id?: string | null | undefined;
    played_at?: string | undefined;
    context_type?: string | null | undefined;
}>;
export declare const publicUserRecentlyPlayedRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_recently_played_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_recently_played_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_recently_played_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_recently_played_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks_with_details">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_recently_played_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_recently_played_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_recently_played_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_recently_played_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_recently_played_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicUserSettingsRowSchemaSchema: z.ZodObject<{
    audio_quality: z.ZodNullable<z.ZodString>;
    auto_add_to_library: z.ZodNullable<z.ZodBoolean>;
    crossfade_duration: z.ZodNullable<z.ZodNumber>;
    enable_autoplay: z.ZodNullable<z.ZodBoolean>;
    enable_crossfade: z.ZodNullable<z.ZodBoolean>;
    enable_equalizer: z.ZodNullable<z.ZodBoolean>;
    enable_explicit_content: z.ZodNullable<z.ZodBoolean>;
    enable_gapless_playback: z.ZodNullable<z.ZodBoolean>;
    enable_notifications: z.ZodNullable<z.ZodBoolean>;
    equalizer_settings: z.ZodNullable<z.ZodType<Json, z.ZodTypeDef, Json>>;
    notification_settings: z.ZodNullable<z.ZodType<Json, z.ZodTypeDef, Json>>;
    preferred_language: z.ZodNullable<z.ZodString>;
    privacy_level: z.ZodNullable<z.ZodString>;
    theme: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
    user_id: z.ZodString;
    volume_level: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    updated_at: string;
    audio_quality: string | null;
    auto_add_to_library: boolean | null;
    crossfade_duration: number | null;
    enable_autoplay: boolean | null;
    enable_crossfade: boolean | null;
    enable_equalizer: boolean | null;
    enable_explicit_content: boolean | null;
    enable_gapless_playback: boolean | null;
    enable_notifications: boolean | null;
    equalizer_settings: Json;
    notification_settings: Json;
    preferred_language: string | null;
    privacy_level: string | null;
    theme: string | null;
    volume_level: number | null;
}, {
    user_id: string;
    updated_at: string;
    audio_quality: string | null;
    auto_add_to_library: boolean | null;
    crossfade_duration: number | null;
    enable_autoplay: boolean | null;
    enable_crossfade: boolean | null;
    enable_equalizer: boolean | null;
    enable_explicit_content: boolean | null;
    enable_gapless_playback: boolean | null;
    enable_notifications: boolean | null;
    equalizer_settings: Json;
    notification_settings: Json;
    preferred_language: string | null;
    privacy_level: string | null;
    theme: string | null;
    volume_level: number | null;
}>;
export declare const publicUserSettingsInsertSchemaSchema: z.ZodObject<{
    audio_quality: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    auto_add_to_library: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    crossfade_duration: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    enable_autoplay: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    enable_crossfade: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    enable_equalizer: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    enable_explicit_content: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    enable_gapless_playback: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    enable_notifications: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    equalizer_settings: z.ZodNullable<z.ZodOptional<z.ZodType<Json, z.ZodTypeDef, Json>>>;
    notification_settings: z.ZodNullable<z.ZodOptional<z.ZodType<Json, z.ZodTypeDef, Json>>>;
    preferred_language: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    privacy_level: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    theme: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
    volume_level: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    updated_at?: string | undefined;
    audio_quality?: string | null | undefined;
    auto_add_to_library?: boolean | null | undefined;
    crossfade_duration?: number | null | undefined;
    enable_autoplay?: boolean | null | undefined;
    enable_crossfade?: boolean | null | undefined;
    enable_equalizer?: boolean | null | undefined;
    enable_explicit_content?: boolean | null | undefined;
    enable_gapless_playback?: boolean | null | undefined;
    enable_notifications?: boolean | null | undefined;
    equalizer_settings?: Json | undefined;
    notification_settings?: Json | undefined;
    preferred_language?: string | null | undefined;
    privacy_level?: string | null | undefined;
    theme?: string | null | undefined;
    volume_level?: number | null | undefined;
}, {
    user_id: string;
    updated_at?: string | undefined;
    audio_quality?: string | null | undefined;
    auto_add_to_library?: boolean | null | undefined;
    crossfade_duration?: number | null | undefined;
    enable_autoplay?: boolean | null | undefined;
    enable_crossfade?: boolean | null | undefined;
    enable_equalizer?: boolean | null | undefined;
    enable_explicit_content?: boolean | null | undefined;
    enable_gapless_playback?: boolean | null | undefined;
    enable_notifications?: boolean | null | undefined;
    equalizer_settings?: Json | undefined;
    notification_settings?: Json | undefined;
    preferred_language?: string | null | undefined;
    privacy_level?: string | null | undefined;
    theme?: string | null | undefined;
    volume_level?: number | null | undefined;
}>;
export declare const publicUserSettingsUpdateSchemaSchema: z.ZodObject<{
    audio_quality: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    auto_add_to_library: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    crossfade_duration: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    enable_autoplay: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    enable_crossfade: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    enable_equalizer: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    enable_explicit_content: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    enable_gapless_playback: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    enable_notifications: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    equalizer_settings: z.ZodNullable<z.ZodOptional<z.ZodType<Json, z.ZodTypeDef, Json>>>;
    notification_settings: z.ZodNullable<z.ZodOptional<z.ZodType<Json, z.ZodTypeDef, Json>>>;
    preferred_language: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    privacy_level: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    theme: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
    volume_level: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    user_id?: string | undefined;
    updated_at?: string | undefined;
    audio_quality?: string | null | undefined;
    auto_add_to_library?: boolean | null | undefined;
    crossfade_duration?: number | null | undefined;
    enable_autoplay?: boolean | null | undefined;
    enable_crossfade?: boolean | null | undefined;
    enable_equalizer?: boolean | null | undefined;
    enable_explicit_content?: boolean | null | undefined;
    enable_gapless_playback?: boolean | null | undefined;
    enable_notifications?: boolean | null | undefined;
    equalizer_settings?: Json | undefined;
    notification_settings?: Json | undefined;
    preferred_language?: string | null | undefined;
    privacy_level?: string | null | undefined;
    theme?: string | null | undefined;
    volume_level?: number | null | undefined;
}, {
    user_id?: string | undefined;
    updated_at?: string | undefined;
    audio_quality?: string | null | undefined;
    auto_add_to_library?: boolean | null | undefined;
    crossfade_duration?: number | null | undefined;
    enable_autoplay?: boolean | null | undefined;
    enable_crossfade?: boolean | null | undefined;
    enable_equalizer?: boolean | null | undefined;
    enable_explicit_content?: boolean | null | undefined;
    enable_gapless_playback?: boolean | null | undefined;
    enable_notifications?: boolean | null | undefined;
    equalizer_settings?: Json | undefined;
    notification_settings?: Json | undefined;
    preferred_language?: string | null | undefined;
    privacy_level?: string | null | undefined;
    theme?: string | null | undefined;
    volume_level?: number | null | undefined;
}>;
export declare const publicUserSettingsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_settings_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<true>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_settings_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: true;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_settings_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: true;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const publicUsersRowSchemaSchema: z.ZodObject<{
    created_at: z.ZodString;
    display_name: z.ZodNullable<z.ZodString>;
    email: z.ZodString;
    email_verified: z.ZodNullable<z.ZodBoolean>;
    id: z.ZodString;
    profile_url: z.ZodNullable<z.ZodString>;
    role: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
    username: z.ZodString;
    wallet_address: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    display_name: string | null;
    email: string;
    email_verified: boolean | null;
    profile_url: string | null;
    role: string | null;
    username: string;
    wallet_address: string | null;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    display_name: string | null;
    email: string;
    email_verified: boolean | null;
    profile_url: string | null;
    role: string | null;
    username: string;
    wallet_address: string | null;
}>;
export declare const publicUsersInsertSchemaSchema: z.ZodObject<{
    created_at: z.ZodOptional<z.ZodString>;
    display_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodString;
    email_verified: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    id: z.ZodString;
    profile_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    role: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
    username: z.ZodString;
    wallet_address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    username: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    display_name?: string | null | undefined;
    email_verified?: boolean | null | undefined;
    profile_url?: string | null | undefined;
    role?: string | null | undefined;
    wallet_address?: string | null | undefined;
}, {
    id: string;
    email: string;
    username: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    display_name?: string | null | undefined;
    email_verified?: boolean | null | undefined;
    profile_url?: string | null | undefined;
    role?: string | null | undefined;
    wallet_address?: string | null | undefined;
}>;
export declare const publicUsersUpdateSchemaSchema: z.ZodObject<{
    created_at: z.ZodOptional<z.ZodString>;
    display_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodString>;
    email_verified: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    id: z.ZodOptional<z.ZodString>;
    profile_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    role: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    wallet_address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    display_name?: string | null | undefined;
    email?: string | undefined;
    email_verified?: boolean | null | undefined;
    profile_url?: string | null | undefined;
    role?: string | null | undefined;
    username?: string | undefined;
    wallet_address?: string | null | undefined;
}, {
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    display_name?: string | null | undefined;
    email?: string | undefined;
    email_verified?: boolean | null | undefined;
    profile_url?: string | null | undefined;
    role?: string | null | undefined;
    username?: string | undefined;
    wallet_address?: string | null | undefined;
}>;
export declare const publicAlbumPlayCountsRowSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodString>;
    last_played_at: z.ZodNullable<z.ZodString>;
    play_count: z.ZodNullable<z.ZodNumber>;
    tracks_played: z.ZodNullable<z.ZodNumber>;
    unique_listeners: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    album_id: string | null;
    last_played_at: string | null;
    play_count: number | null;
    tracks_played: number | null;
    unique_listeners: number | null;
}, {
    album_id: string | null;
    last_played_at: string | null;
    play_count: number | null;
    tracks_played: number | null;
    unique_listeners: number | null;
}>;
export declare const publicAlbumPlayCountsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"tracks_album_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"album_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"albums">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "tracks_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "tracks_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}>], null>;
export declare const publicArtistPlayCountsRowSchemaSchema: z.ZodObject<{
    artist_id: z.ZodNullable<z.ZodString>;
    last_played_at: z.ZodNullable<z.ZodString>;
    play_count: z.ZodNullable<z.ZodNumber>;
    tracks_played: z.ZodNullable<z.ZodNumber>;
    unique_listeners: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    artist_id: string | null;
    last_played_at: string | null;
    play_count: number | null;
    tracks_played: number | null;
    unique_listeners: number | null;
}, {
    artist_id: string | null;
    last_played_at: string | null;
    play_count: number | null;
    tracks_played: number | null;
    unique_listeners: number | null;
}>;
export declare const publicArtistPlayCountsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"tracks_artist_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"artist_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"artists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "tracks_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "tracks_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}>], null>;
export declare const publicTrackPlayCountsRowSchemaSchema: z.ZodObject<{
    last_played_at: z.ZodNullable<z.ZodString>;
    play_count: z.ZodNullable<z.ZodNumber>;
    track_id: z.ZodNullable<z.ZodString>;
    unique_listeners: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    track_id: string | null;
    last_played_at: string | null;
    play_count: number | null;
    unique_listeners: number | null;
}, {
    track_id: string | null;
    last_played_at: string | null;
    play_count: number | null;
    unique_listeners: number | null;
}>;
export declare const publicTrackPlayCountsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"play_history_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "play_history_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "play_history_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"play_history_track_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"track_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"tracks_with_details">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "play_history_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "play_history_track_id_fkey";
    columns: ["track_id"];
    isOneToOne: false;
    referencedRelation: "tracks_with_details";
    referencedColumns: ["id"];
}>], null>;
export declare const publicTracksWithDetailsRowSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodString>;
    album_release_date: z.ZodNullable<z.ZodString>;
    album_title: z.ZodNullable<z.ZodString>;
    artist_id: z.ZodNullable<z.ZodString>;
    artist_name: z.ZodNullable<z.ZodString>;
    artist_verified: z.ZodNullable<z.ZodBoolean>;
    audio_url: z.ZodNullable<z.ZodString>;
    cover_url: z.ZodNullable<z.ZodString>;
    created_at: z.ZodNullable<z.ZodString>;
    duration: z.ZodNullable<z.ZodNumber>;
    explicit: z.ZodNullable<z.ZodBoolean>;
    genre: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    id: z.ZodNullable<z.ZodString>;
    isrc: z.ZodNullable<z.ZodString>;
    lyrics: z.ZodNullable<z.ZodString>;
    play_count: z.ZodNullable<z.ZodNumber>;
    release_date: z.ZodNullable<z.ZodString>;
    title: z.ZodNullable<z.ZodString>;
    track_number: z.ZodNullable<z.ZodNumber>;
    unique_listeners: z.ZodNullable<z.ZodNumber>;
    updated_at: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    album_id: string | null;
    id: string | null;
    artist_id: string | null;
    cover_url: string | null;
    created_at: string | null;
    genre: string[] | null;
    release_date: string | null;
    title: string | null;
    updated_at: string | null;
    artist_name: string | null;
    audio_url: string | null;
    duration: number | null;
    explicit: boolean | null;
    isrc: string | null;
    lyrics: string | null;
    track_number: number | null;
    play_count: number | null;
    unique_listeners: number | null;
    album_release_date: string | null;
    album_title: string | null;
    artist_verified: boolean | null;
}, {
    album_id: string | null;
    id: string | null;
    artist_id: string | null;
    cover_url: string | null;
    created_at: string | null;
    genre: string[] | null;
    release_date: string | null;
    title: string | null;
    updated_at: string | null;
    artist_name: string | null;
    audio_url: string | null;
    duration: number | null;
    explicit: boolean | null;
    isrc: string | null;
    lyrics: string | null;
    track_number: number | null;
    play_count: number | null;
    unique_listeners: number | null;
    album_release_date: string | null;
    album_title: string | null;
    artist_verified: boolean | null;
}>;
export declare const publicTracksWithDetailsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"tracks_album_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"album_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"albums">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "tracks_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "tracks_album_id_fkey";
    columns: ["album_id"];
    isOneToOne: false;
    referencedRelation: "albums";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"tracks_artist_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"artist_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"artists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "tracks_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "tracks_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}>], null>;
export declare const publicAddAlbumToLibraryArgsSchemaSchema: z.ZodObject<{
    album_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string;
}, {
    album_id: string;
}>;
export declare const publicAddAlbumToLibraryReturnsSchemaSchema: z.ZodBoolean;
export declare const publicAddTrackToLibraryArgsSchemaSchema: z.ZodObject<{
    track_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    track_id: string;
}, {
    track_id: string;
}>;
export declare const publicAddTrackToLibraryReturnsSchemaSchema: z.ZodBoolean;
export declare const publicAddTrackToPlaylistArgsSchemaSchema: z.ZodObject<{
    playlist_id: z.ZodString;
    track_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    track_id: string;
    playlist_id: string;
}, {
    track_id: string;
    playlist_id: string;
}>;
export declare const publicAddTrackToPlaylistReturnsSchemaSchema: z.ZodUndefined;
export declare const publicApplyForArtistAccountArgsSchemaSchema: z.ZodObject<{
    artist_name: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    genre: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    location: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    social_links: z.ZodOptional<z.ZodType<Json, z.ZodTypeDef, Json>>;
    application_notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    artist_name: string;
    genre?: string[] | undefined;
    application_notes?: string | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    social_links?: Json | undefined;
    website?: string | undefined;
}, {
    artist_name: string;
    genre?: string[] | undefined;
    application_notes?: string | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    social_links?: Json | undefined;
    website?: string | undefined;
}>;
export declare const publicApplyForArtistAccountReturnsSchemaSchema: z.ZodType<Json, z.ZodTypeDef, Json>;
export declare const publicApproveArtistApplicationArgsSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
    approved: z.ZodBoolean;
    admin_notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    artist_id: string;
    approved: boolean;
    admin_notes?: string | undefined;
}, {
    artist_id: string;
    approved: boolean;
    admin_notes?: string | undefined;
}>;
export declare const publicApproveArtistApplicationReturnsSchemaSchema: z.ZodType<Json, z.ZodTypeDef, Json>;
export declare const publicCreatePlaylistArgsSchemaSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    is_public: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    is_public?: boolean | undefined;
}, {
    name: string;
    description?: string | undefined;
    is_public?: boolean | undefined;
}>;
export declare const publicCreatePlaylistReturnsSchemaSchema: z.ZodObject<{
    cover_url: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    is_public: z.ZodNullable<z.ZodBoolean>;
    name: z.ZodString;
    updated_at: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
    cover_url: string | null;
    created_at: string;
    description: string | null;
    updated_at: string;
    name: string;
    is_public: boolean | null;
}, {
    id: string;
    user_id: string;
    cover_url: string | null;
    created_at: string;
    description: string | null;
    updated_at: string;
    name: string;
    is_public: boolean | null;
}>;
export declare const publicCreateTrackArgsSchemaSchema: z.ZodObject<{
    title: z.ZodString;
    duration: z.ZodNumber;
    audio_url: z.ZodString;
    album_id: z.ZodOptional<z.ZodString>;
    cover_url: z.ZodOptional<z.ZodString>;
    track_number: z.ZodOptional<z.ZodNumber>;
    lyrics: z.ZodOptional<z.ZodString>;
    genre: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    explicit: z.ZodOptional<z.ZodBoolean>;
    release_date: z.ZodOptional<z.ZodString>;
    isrc: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    audio_url: string;
    duration: number;
    album_id?: string | undefined;
    cover_url?: string | undefined;
    genre?: string[] | undefined;
    release_date?: string | undefined;
    explicit?: boolean | undefined;
    isrc?: string | undefined;
    lyrics?: string | undefined;
    track_number?: number | undefined;
}, {
    title: string;
    audio_url: string;
    duration: number;
    album_id?: string | undefined;
    cover_url?: string | undefined;
    genre?: string[] | undefined;
    release_date?: string | undefined;
    explicit?: boolean | undefined;
    isrc?: string | undefined;
    lyrics?: string | undefined;
    track_number?: number | undefined;
}>;
export declare const publicCreateTrackReturnsSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodString>;
    artist_id: z.ZodString;
    audio_url: z.ZodString;
    cover_url: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    duration: z.ZodNumber;
    explicit: z.ZodNullable<z.ZodBoolean>;
    genre: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    id: z.ZodString;
    isrc: z.ZodNullable<z.ZodString>;
    lyrics: z.ZodNullable<z.ZodString>;
    release_date: z.ZodNullable<z.ZodString>;
    title: z.ZodString;
    track_number: z.ZodNullable<z.ZodNumber>;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string | null;
    id: string;
    artist_id: string;
    cover_url: string | null;
    created_at: string;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
    audio_url: string;
    duration: number;
    explicit: boolean | null;
    isrc: string | null;
    lyrics: string | null;
    track_number: number | null;
}, {
    album_id: string | null;
    id: string;
    artist_id: string;
    cover_url: string | null;
    created_at: string;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
    audio_url: string;
    duration: number;
    explicit: boolean | null;
    isrc: string | null;
    lyrics: string | null;
    track_number: number | null;
}>;
export declare const publicGetAlbumsByGenreArgsSchemaSchema: z.ZodObject<{
    p_genre_id: z.ZodString;
    p_limit: z.ZodOptional<z.ZodNumber>;
    p_offset: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    p_genre_id: string;
    p_limit?: number | undefined;
    p_offset?: number | undefined;
}, {
    p_genre_id: string;
    p_limit?: number | undefined;
    p_offset?: number | undefined;
}>;
export declare const publicGetAlbumsByGenreReturnsSchemaSchema: z.ZodArray<z.ZodObject<{
    artist_id: z.ZodString;
    cover_url: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    genre: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    id: z.ZodString;
    release_date: z.ZodNullable<z.ZodString>;
    title: z.ZodString;
    type: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    artist_id: string;
    type: string | null;
    cover_url: string | null;
    created_at: string;
    description: string | null;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
}, {
    id: string;
    artist_id: string;
    type: string | null;
    cover_url: string | null;
    created_at: string;
    description: string | null;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
}>, "many">;
export declare const publicGetArtistPaymentStatsArgsSchemaSchema: z.ZodObject<{
    time_period: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    time_period?: string | undefined;
}, {
    time_period?: string | undefined;
}>;
export declare const publicGetArtistPaymentStatsReturnsSchemaSchema: z.ZodArray<z.ZodObject<{
    total_payments: z.ZodNumber;
    total_amount: z.ZodNumber;
    avg_amount: z.ZodNumber;
    payment_type: z.ZodString;
    period: z.ZodString;
}, "strip", z.ZodTypeAny, {
    payment_type: string;
    total_payments: number;
    total_amount: number;
    avg_amount: number;
    period: string;
}, {
    payment_type: string;
    total_payments: number;
    total_amount: number;
    avg_amount: number;
    period: string;
}>, "many">;
export declare const publicGetArtistsByGenreArgsSchemaSchema: z.ZodObject<{
    p_genre_id: z.ZodString;
    p_limit: z.ZodOptional<z.ZodNumber>;
    p_offset: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    p_genre_id: string;
    p_limit?: number | undefined;
    p_offset?: number | undefined;
}, {
    p_genre_id: string;
    p_limit?: number | undefined;
    p_offset?: number | undefined;
}>;
export declare const publicGetArtistsByGenreReturnsSchemaSchema: z.ZodArray<z.ZodObject<{
    application_date: z.ZodNullable<z.ZodString>;
    application_notes: z.ZodNullable<z.ZodString>;
    approved: z.ZodNullable<z.ZodBoolean>;
    artist_name: z.ZodString;
    bio: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    genre: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    id: z.ZodString;
    location: z.ZodNullable<z.ZodString>;
    social_links: z.ZodNullable<z.ZodType<Json, z.ZodTypeDef, Json>>;
    updated_at: z.ZodString;
    verified: z.ZodNullable<z.ZodBoolean>;
    website: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    genre: string[] | null;
    updated_at: string;
    application_date: string | null;
    application_notes: string | null;
    approved: boolean | null;
    artist_name: string;
    bio: string | null;
    location: string | null;
    social_links: Json;
    verified: boolean | null;
    website: string | null;
}, {
    id: string;
    created_at: string;
    genre: string[] | null;
    updated_at: string;
    application_date: string | null;
    application_notes: string | null;
    approved: boolean | null;
    artist_name: string;
    bio: string | null;
    location: string | null;
    social_links: Json;
    verified: boolean | null;
    website: string | null;
}>, "many">;
export declare const publicGetMonthlyPaymentTrendsArgsSchemaSchema: z.ZodObject<{
    months_back: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    months_back?: number | undefined;
}, {
    months_back?: number | undefined;
}>;
export declare const publicGetMonthlyPaymentTrendsReturnsSchemaSchema: z.ZodArray<z.ZodObject<{
    month: z.ZodString;
    total_amount: z.ZodNumber;
    payment_count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total_amount: number;
    month: string;
    payment_count: number;
}, {
    total_amount: number;
    month: string;
    payment_count: number;
}>, "many">;
export declare const publicGetPopularGenresArgsSchemaSchema: z.ZodObject<{
    p_start_date: z.ZodString;
    p_end_date: z.ZodString;
    p_limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    p_start_date: string;
    p_end_date: string;
    p_limit?: number | undefined;
}, {
    p_start_date: string;
    p_end_date: string;
    p_limit?: number | undefined;
}>;
export declare const publicGetPopularGenresReturnsSchemaSchema: z.ZodArray<z.ZodObject<{
    color: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    image_url: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
    popularity: z.ZodNullable<z.ZodNumber>;
    slug: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    description: string | null;
    updated_at: string;
    color: string | null;
    image_url: string | null;
    name: string;
    popularity: number | null;
    slug: string | null;
}, {
    id: string;
    created_at: string;
    description: string | null;
    updated_at: string;
    color: string | null;
    image_url: string | null;
    name: string;
    popularity: number | null;
    slug: string | null;
}>, "many">;
export declare const publicGetRelatedGenresArgsSchemaSchema: z.ZodObject<{
    p_genre_id: z.ZodString;
    p_limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    p_genre_id: string;
    p_limit?: number | undefined;
}, {
    p_genre_id: string;
    p_limit?: number | undefined;
}>;
export declare const publicGetRelatedGenresReturnsSchemaSchema: z.ZodArray<z.ZodObject<{
    color: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    image_url: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
    popularity: z.ZodNullable<z.ZodNumber>;
    slug: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    description: string | null;
    updated_at: string;
    color: string | null;
    image_url: string | null;
    name: string;
    popularity: number | null;
    slug: string | null;
}, {
    id: string;
    created_at: string;
    description: string | null;
    updated_at: string;
    color: string | null;
    image_url: string | null;
    name: string;
    popularity: number | null;
    slug: string | null;
}>, "many">;
export declare const publicGetTracksByGenreArgsSchemaSchema: z.ZodObject<{
    p_genre_id: z.ZodString;
    p_limit: z.ZodOptional<z.ZodNumber>;
    p_offset: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    p_genre_id: string;
    p_limit?: number | undefined;
    p_offset?: number | undefined;
}, {
    p_genre_id: string;
    p_limit?: number | undefined;
    p_offset?: number | undefined;
}>;
export declare const publicGetTracksByGenreReturnsSchemaSchema: z.ZodArray<z.ZodObject<{
    album_id: z.ZodNullable<z.ZodString>;
    artist_id: z.ZodString;
    audio_url: z.ZodString;
    cover_url: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    duration: z.ZodNumber;
    explicit: z.ZodNullable<z.ZodBoolean>;
    genre: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    id: z.ZodString;
    isrc: z.ZodNullable<z.ZodString>;
    lyrics: z.ZodNullable<z.ZodString>;
    release_date: z.ZodNullable<z.ZodString>;
    title: z.ZodString;
    track_number: z.ZodNullable<z.ZodNumber>;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string | null;
    id: string;
    artist_id: string;
    cover_url: string | null;
    created_at: string;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
    audio_url: string;
    duration: number;
    explicit: boolean | null;
    isrc: string | null;
    lyrics: string | null;
    track_number: number | null;
}, {
    album_id: string | null;
    id: string;
    artist_id: string;
    cover_url: string | null;
    created_at: string;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
    audio_url: string;
    duration: number;
    explicit: boolean | null;
    isrc: string | null;
    lyrics: string | null;
    track_number: number | null;
}>, "many">;
export declare const publicRecordPlayArgsSchemaSchema: z.ZodObject<{
    track_id: z.ZodString;
    play_duration: z.ZodOptional<z.ZodNumber>;
    completed: z.ZodOptional<z.ZodBoolean>;
    source: z.ZodOptional<z.ZodString>;
    context_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    track_id: string;
    completed?: boolean | undefined;
    context_id?: string | undefined;
    play_duration?: number | undefined;
    source?: string | undefined;
}, {
    track_id: string;
    completed?: boolean | undefined;
    context_id?: string | undefined;
    play_duration?: number | undefined;
    source?: string | undefined;
}>;
export declare const publicRecordPlayReturnsSchemaSchema: z.ZodUndefined;
export declare const publicTipArtistArgsSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
    amount: z.ZodNumber;
    transaction_hash: z.ZodString;
    track_id: z.ZodOptional<z.ZodString>;
    album_id: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    artist_id: string;
    amount: number;
    transaction_hash: string;
    album_id?: string | undefined;
    track_id?: string | undefined;
    message?: string | undefined;
}, {
    artist_id: string;
    amount: number;
    transaction_hash: string;
    album_id?: string | undefined;
    track_id?: string | undefined;
    message?: string | undefined;
}>;
export declare const publicTipArtistReturnsSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodString>;
    amount: z.ZodNumber;
    created_at: z.ZodString;
    currency: z.ZodString;
    id: z.ZodString;
    message: z.ZodNullable<z.ZodString>;
    payment_type: z.ZodString;
    recipient_id: z.ZodString;
    sender_id: z.ZodString;
    status: z.ZodString;
    track_id: z.ZodNullable<z.ZodString>;
    transaction_hash: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string | null;
    id: string;
    recipient_id: string;
    sender_id: string;
    track_id: string | null;
    status: string;
    message: string | null;
    created_at: string;
    updated_at: string;
    amount: number;
    currency: string;
    payment_type: string;
    transaction_hash: string | null;
}, {
    album_id: string | null;
    id: string;
    recipient_id: string;
    sender_id: string;
    track_id: string | null;
    status: string;
    message: string | null;
    created_at: string;
    updated_at: string;
    amount: number;
    currency: string;
    payment_type: string;
    transaction_hash: string | null;
}>;
export declare const publicUpdateGenrePopularityArgsSchemaSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const publicUpdateGenrePopularityReturnsSchemaSchema: z.ZodUndefined;
