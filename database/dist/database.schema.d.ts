import { z } from 'zod';
import { Json } from './types/database';
export declare const jsonSchema: z.ZodSchema<Json>;
export declare const prettygoodAlbumLikesRowSchemaSchema: z.ZodObject<{
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
export declare const prettygoodAlbumLikesInsertSchemaSchema: z.ZodObject<{
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
export declare const prettygoodAlbumLikesUpdateSchemaSchema: z.ZodObject<{
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
export declare const prettygoodAlbumLikesRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodAlbumsRowSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
    cover_image: z.ZodNullable<z.ZodString>;
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
    description: string | null;
    type: string | null;
    cover_image: string | null;
    created_at: string;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
}, {
    id: string;
    artist_id: string;
    description: string | null;
    type: string | null;
    cover_image: string | null;
    created_at: string;
    genre: string[] | null;
    release_date: string | null;
    title: string;
    updated_at: string;
}>;
export declare const prettygoodAlbumsInsertSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
    cover_image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
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
    description?: string | null | undefined;
    type?: string | null | undefined;
    cover_image?: string | null | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    updated_at?: string | undefined;
}, {
    artist_id: string;
    title: string;
    id?: string | undefined;
    description?: string | null | undefined;
    type?: string | null | undefined;
    cover_image?: string | null | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    updated_at?: string | undefined;
}>;
export declare const prettygoodAlbumsUpdateSchemaSchema: z.ZodObject<{
    artist_id: z.ZodOptional<z.ZodString>;
    cover_image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
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
    description?: string | null | undefined;
    type?: string | null | undefined;
    cover_image?: string | null | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    title?: string | undefined;
    updated_at?: string | undefined;
}, {
    id?: string | undefined;
    artist_id?: string | undefined;
    description?: string | null | undefined;
    type?: string | null | undefined;
    cover_image?: string | null | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    title?: string | undefined;
    updated_at?: string | undefined;
}>;
export declare const prettygoodAlbumsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodArtistFollowersRowSchemaSchema: z.ZodObject<{
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
export declare const prettygoodArtistFollowersInsertSchemaSchema: z.ZodObject<{
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
export declare const prettygoodArtistFollowersUpdateSchemaSchema: z.ZodObject<{
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
export declare const prettygoodArtistFollowersRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodArtistsRowSchemaSchema: z.ZodObject<{
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
    artist_name: string;
    bio: string | null;
    location: string | null;
    social_links: Json;
    verified: boolean | null;
    website: string | null;
}>;
export declare const prettygoodArtistsInsertSchemaSchema: z.ZodObject<{
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
    bio?: string | null | undefined;
    location?: string | null | undefined;
    social_links?: Json | undefined;
    verified?: boolean | null | undefined;
    website?: string | null | undefined;
}>;
export declare const prettygoodArtistsUpdateSchemaSchema: z.ZodObject<{
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
    artist_name?: string | undefined;
    bio?: string | null | undefined;
    location?: string | null | undefined;
    social_links?: Json | undefined;
    verified?: boolean | null | undefined;
    website?: string | null | undefined;
}>;
export declare const prettygoodArtistsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodPaymentsRowSchemaSchema: z.ZodObject<{
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
export declare const prettygoodPaymentsInsertSchemaSchema: z.ZodObject<{
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
export declare const prettygoodPaymentsUpdateSchemaSchema: z.ZodObject<{
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
export declare const prettygoodPaymentsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
}>], null>;
export declare const prettygoodPlayHistoryRowSchemaSchema: z.ZodObject<{
    client_ip: z.ZodNullable<z.ZodString>;
    completed: z.ZodNullable<z.ZodBoolean>;
    id: z.ZodString;
    play_duration: z.ZodNullable<z.ZodNumber>;
    played_at: z.ZodString;
    source: z.ZodNullable<z.ZodString>;
    track_id: z.ZodString;
    user_agent: z.ZodNullable<z.ZodString>;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
    track_id: string;
    client_ip: string | null;
    completed: boolean | null;
    play_duration: number | null;
    played_at: string;
    source: string | null;
    user_agent: string | null;
}, {
    id: string;
    user_id: string;
    track_id: string;
    client_ip: string | null;
    completed: boolean | null;
    play_duration: number | null;
    played_at: string;
    source: string | null;
    user_agent: string | null;
}>;
export declare const prettygoodPlayHistoryInsertSchemaSchema: z.ZodObject<{
    client_ip: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    completed: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    id: z.ZodOptional<z.ZodString>;
    play_duration: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    played_at: z.ZodOptional<z.ZodString>;
    source: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    track_id: z.ZodString;
    user_agent: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    track_id: string;
    id?: string | undefined;
    client_ip?: string | null | undefined;
    completed?: boolean | null | undefined;
    play_duration?: number | null | undefined;
    played_at?: string | undefined;
    source?: string | null | undefined;
    user_agent?: string | null | undefined;
}, {
    user_id: string;
    track_id: string;
    id?: string | undefined;
    client_ip?: string | null | undefined;
    completed?: boolean | null | undefined;
    play_duration?: number | null | undefined;
    played_at?: string | undefined;
    source?: string | null | undefined;
    user_agent?: string | null | undefined;
}>;
export declare const prettygoodPlayHistoryUpdateSchemaSchema: z.ZodObject<{
    client_ip: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    completed: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    id: z.ZodOptional<z.ZodString>;
    play_duration: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    played_at: z.ZodOptional<z.ZodString>;
    source: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    track_id: z.ZodOptional<z.ZodString>;
    user_agent: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    user_id?: string | undefined;
    track_id?: string | undefined;
    client_ip?: string | null | undefined;
    completed?: boolean | null | undefined;
    play_duration?: number | null | undefined;
    played_at?: string | undefined;
    source?: string | null | undefined;
    user_agent?: string | null | undefined;
}, {
    id?: string | undefined;
    user_id?: string | undefined;
    track_id?: string | undefined;
    client_ip?: string | null | undefined;
    completed?: boolean | null | undefined;
    play_duration?: number | null | undefined;
    played_at?: string | undefined;
    source?: string | null | undefined;
    user_agent?: string | null | undefined;
}>;
export declare const prettygoodPlayHistoryRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodPlaylistCollaboratorsRowSchemaSchema: z.ZodObject<{
    added_at: z.ZodString;
    added_by: z.ZodString;
    playlist_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    added_by: string;
    playlist_id: string;
    added_at: string;
}, {
    user_id: string;
    added_by: string;
    playlist_id: string;
    added_at: string;
}>;
export declare const prettygoodPlaylistCollaboratorsInsertSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    added_by: z.ZodString;
    playlist_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    added_by: string;
    playlist_id: string;
    added_at?: string | undefined;
}, {
    user_id: string;
    added_by: string;
    playlist_id: string;
    added_at?: string | undefined;
}>;
export declare const prettygoodPlaylistCollaboratorsUpdateSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    added_by: z.ZodOptional<z.ZodString>;
    playlist_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id?: string | undefined;
    added_by?: string | undefined;
    playlist_id?: string | undefined;
    added_at?: string | undefined;
}, {
    user_id?: string | undefined;
    added_by?: string | undefined;
    playlist_id?: string | undefined;
    added_at?: string | undefined;
}>;
export declare const prettygoodPlaylistCollaboratorsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"playlist_collaborators_added_by_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"added_by">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "playlist_collaborators_added_by_fkey";
    columns: ["added_by"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "playlist_collaborators_added_by_fkey";
    columns: ["added_by"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"playlist_collaborators_playlist_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"playlist_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"playlists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "playlist_collaborators_playlist_id_fkey";
    columns: ["playlist_id"];
    isOneToOne: false;
    referencedRelation: "playlists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "playlist_collaborators_playlist_id_fkey";
    columns: ["playlist_id"];
    isOneToOne: false;
    referencedRelation: "playlists";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"playlist_collaborators_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "playlist_collaborators_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "playlist_collaborators_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const prettygoodPlaylistLikesRowSchemaSchema: z.ZodObject<{
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
export declare const prettygoodPlaylistLikesInsertSchemaSchema: z.ZodObject<{
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
export declare const prettygoodPlaylistLikesUpdateSchemaSchema: z.ZodObject<{
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
export declare const prettygoodPlaylistLikesRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodPlaylistTracksRowSchemaSchema: z.ZodObject<{
    added_at: z.ZodString;
    added_by: z.ZodString;
    playlist_id: z.ZodString;
    position: z.ZodNumber;
    track_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    track_id: string;
    added_by: string;
    playlist_id: string;
    added_at: string;
    position: number;
}, {
    track_id: string;
    added_by: string;
    playlist_id: string;
    added_at: string;
    position: number;
}>;
export declare const prettygoodPlaylistTracksInsertSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    added_by: z.ZodString;
    playlist_id: z.ZodString;
    position: z.ZodNumber;
    track_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    track_id: string;
    added_by: string;
    playlist_id: string;
    position: number;
    added_at?: string | undefined;
}, {
    track_id: string;
    added_by: string;
    playlist_id: string;
    position: number;
    added_at?: string | undefined;
}>;
export declare const prettygoodPlaylistTracksUpdateSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    added_by: z.ZodOptional<z.ZodString>;
    playlist_id: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodNumber>;
    track_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    track_id?: string | undefined;
    added_by?: string | undefined;
    playlist_id?: string | undefined;
    added_at?: string | undefined;
    position?: number | undefined;
}, {
    track_id?: string | undefined;
    added_by?: string | undefined;
    playlist_id?: string | undefined;
    added_at?: string | undefined;
    position?: number | undefined;
}>;
export declare const prettygoodPlaylistTracksRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
}>], null>;
export declare const prettygoodPlaylistsRowSchemaSchema: z.ZodObject<{
    collaborative: z.ZodNullable<z.ZodBoolean>;
    cover_image: z.ZodNullable<z.ZodString>;
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
    description: string | null;
    cover_image: string | null;
    created_at: string;
    updated_at: string;
    collaborative: boolean | null;
    is_public: boolean | null;
    name: string;
}, {
    id: string;
    user_id: string;
    description: string | null;
    cover_image: string | null;
    created_at: string;
    updated_at: string;
    collaborative: boolean | null;
    is_public: boolean | null;
    name: string;
}>;
export declare const prettygoodPlaylistsInsertSchemaSchema: z.ZodObject<{
    collaborative: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    cover_image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
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
    description?: string | null | undefined;
    cover_image?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    collaborative?: boolean | null | undefined;
    is_public?: boolean | null | undefined;
}, {
    user_id: string;
    name: string;
    id?: string | undefined;
    description?: string | null | undefined;
    cover_image?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    collaborative?: boolean | null | undefined;
    is_public?: boolean | null | undefined;
}>;
export declare const prettygoodPlaylistsUpdateSchemaSchema: z.ZodObject<{
    collaborative: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    cover_image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
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
    description?: string | null | undefined;
    cover_image?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    collaborative?: boolean | null | undefined;
    is_public?: boolean | null | undefined;
    name?: string | undefined;
}, {
    id?: string | undefined;
    user_id?: string | undefined;
    description?: string | null | undefined;
    cover_image?: string | null | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    collaborative?: boolean | null | undefined;
    is_public?: boolean | null | undefined;
    name?: string | undefined;
}>;
export declare const prettygoodPlaylistsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodSearchHistoryRowSchemaSchema: z.ZodObject<{
    id: z.ZodString;
    query: z.ZodString;
    searched_at: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
    query: string;
    searched_at: string;
}, {
    id: string;
    user_id: string;
    query: string;
    searched_at: string;
}>;
export declare const prettygoodSearchHistoryInsertSchemaSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    query: z.ZodString;
    searched_at: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    query: string;
    id?: string | undefined;
    searched_at?: string | undefined;
}, {
    user_id: string;
    query: string;
    id?: string | undefined;
    searched_at?: string | undefined;
}>;
export declare const prettygoodSearchHistoryUpdateSchemaSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    searched_at: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    user_id?: string | undefined;
    query?: string | undefined;
    searched_at?: string | undefined;
}, {
    id?: string | undefined;
    user_id?: string | undefined;
    query?: string | undefined;
    searched_at?: string | undefined;
}>;
export declare const prettygoodSearchHistoryRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"search_history_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "search_history_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "search_history_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const prettygoodTrackLikesRowSchemaSchema: z.ZodObject<{
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
export declare const prettygoodTrackLikesInsertSchemaSchema: z.ZodObject<{
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
export declare const prettygoodTrackLikesUpdateSchemaSchema: z.ZodObject<{
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
export declare const prettygoodTrackLikesRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodTracksRowSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodString>;
    artist_id: z.ZodString;
    audio_url: z.ZodString;
    cover_image: z.ZodNullable<z.ZodString>;
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
    cover_image: string | null;
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
    cover_image: string | null;
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
export declare const prettygoodTracksInsertSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    artist_id: z.ZodString;
    audio_url: z.ZodString;
    cover_image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
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
    cover_image?: string | null | undefined;
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
    cover_image?: string | null | undefined;
    created_at?: string | undefined;
    genre?: string[] | null | undefined;
    release_date?: string | null | undefined;
    updated_at?: string | undefined;
    explicit?: boolean | null | undefined;
    isrc?: string | null | undefined;
    lyrics?: string | null | undefined;
    track_number?: number | null | undefined;
}>;
export declare const prettygoodTracksUpdateSchemaSchema: z.ZodObject<{
    album_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    artist_id: z.ZodOptional<z.ZodString>;
    audio_url: z.ZodOptional<z.ZodString>;
    cover_image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
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
    cover_image?: string | null | undefined;
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
    cover_image?: string | null | undefined;
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
export declare const prettygoodTracksRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodUserLibraryAlbumsRowSchemaSchema: z.ZodObject<{
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
export declare const prettygoodUserLibraryAlbumsInsertSchemaSchema: z.ZodObject<{
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
export declare const prettygoodUserLibraryAlbumsUpdateSchemaSchema: z.ZodObject<{
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
export declare const prettygoodUserLibraryAlbumsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodUserLibraryArtistsRowSchemaSchema: z.ZodObject<{
    added_at: z.ZodString;
    artist_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    artist_id: string;
    added_at: string;
}, {
    user_id: string;
    artist_id: string;
    added_at: string;
}>;
export declare const prettygoodUserLibraryArtistsInsertSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    artist_id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    artist_id: string;
    added_at?: string | undefined;
}, {
    user_id: string;
    artist_id: string;
    added_at?: string | undefined;
}>;
export declare const prettygoodUserLibraryArtistsUpdateSchemaSchema: z.ZodObject<{
    added_at: z.ZodOptional<z.ZodString>;
    artist_id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id?: string | undefined;
    artist_id?: string | undefined;
    added_at?: string | undefined;
}, {
    user_id?: string | undefined;
    artist_id?: string | undefined;
    added_at?: string | undefined;
}>;
export declare const prettygoodUserLibraryArtistsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_library_artists_artist_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"artist_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"artists">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_library_artists_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_library_artists_artist_id_fkey";
    columns: ["artist_id"];
    isOneToOne: false;
    referencedRelation: "artists";
    referencedColumns: ["id"];
}>, z.ZodObject<{
    foreignKeyName: z.ZodLiteral<"user_library_artists_user_id_fkey">;
    columns: z.ZodTuple<[z.ZodLiteral<"user_id">], null>;
    isOneToOne: z.ZodLiteral<false>;
    referencedRelation: z.ZodLiteral<"users">;
    referencedColumns: z.ZodTuple<[z.ZodLiteral<"id">], null>;
}, "strip", z.ZodTypeAny, {
    foreignKeyName: "user_library_artists_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}, {
    foreignKeyName: "user_library_artists_user_id_fkey";
    columns: ["user_id"];
    isOneToOne: false;
    referencedRelation: "users";
    referencedColumns: ["id"];
}>], null>;
export declare const prettygoodUserLibraryTracksRowSchemaSchema: z.ZodObject<{
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
export declare const prettygoodUserLibraryTracksInsertSchemaSchema: z.ZodObject<{
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
export declare const prettygoodUserLibraryTracksUpdateSchemaSchema: z.ZodObject<{
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
export declare const prettygoodUserLibraryTracksRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodUserRecentlyPlayedRowSchemaSchema: z.ZodObject<{
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
    played_at: string;
    context_id: string | null;
    context_type: string | null;
}, {
    id: string;
    user_id: string;
    track_id: string;
    played_at: string;
    context_id: string | null;
    context_type: string | null;
}>;
export declare const prettygoodUserRecentlyPlayedInsertSchemaSchema: z.ZodObject<{
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
    played_at?: string | undefined;
    context_id?: string | null | undefined;
    context_type?: string | null | undefined;
}, {
    user_id: string;
    track_id: string;
    id?: string | undefined;
    played_at?: string | undefined;
    context_id?: string | null | undefined;
    context_type?: string | null | undefined;
}>;
export declare const prettygoodUserRecentlyPlayedUpdateSchemaSchema: z.ZodObject<{
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
    played_at?: string | undefined;
    context_id?: string | null | undefined;
    context_type?: string | null | undefined;
}, {
    id?: string | undefined;
    user_id?: string | undefined;
    track_id?: string | undefined;
    played_at?: string | undefined;
    context_id?: string | null | undefined;
    context_type?: string | null | undefined;
}>;
export declare const prettygoodUserRecentlyPlayedRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodUserSettingsRowSchemaSchema: z.ZodObject<{
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
export declare const prettygoodUserSettingsInsertSchemaSchema: z.ZodObject<{
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
export declare const prettygoodUserSettingsUpdateSchemaSchema: z.ZodObject<{
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
export declare const prettygoodUserSettingsRelationshipsSchemaSchema: z.ZodTuple<[z.ZodObject<{
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
export declare const prettygoodUsersRowSchemaSchema: z.ZodObject<{
    created_at: z.ZodString;
    display_name: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    profile_image: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
    username: z.ZodString;
    wallet_address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    display_name: string | null;
    email: string | null;
    profile_image: string | null;
    username: string;
    wallet_address: string;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    display_name: string | null;
    email: string | null;
    profile_image: string | null;
    username: string;
    wallet_address: string;
}>;
export declare const prettygoodUsersInsertSchemaSchema: z.ZodObject<{
    created_at: z.ZodOptional<z.ZodString>;
    display_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    profile_image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
    username: z.ZodString;
    wallet_address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    wallet_address: string;
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    display_name?: string | null | undefined;
    email?: string | null | undefined;
    profile_image?: string | null | undefined;
}, {
    username: string;
    wallet_address: string;
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    display_name?: string | null | undefined;
    email?: string | null | undefined;
    profile_image?: string | null | undefined;
}>;
export declare const prettygoodUsersUpdateSchemaSchema: z.ZodObject<{
    created_at: z.ZodOptional<z.ZodString>;
    display_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    profile_image: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    wallet_address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    display_name?: string | null | undefined;
    email?: string | null | undefined;
    profile_image?: string | null | undefined;
    username?: string | undefined;
    wallet_address?: string | undefined;
}, {
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    display_name?: string | null | undefined;
    email?: string | null | undefined;
    profile_image?: string | null | undefined;
    username?: string | undefined;
    wallet_address?: string | undefined;
}>;
export declare const prettygoodAddAlbumToLibraryArgsSchemaSchema: z.ZodObject<{
    album_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    album_id: string;
}, {
    album_id: string;
}>;
export declare const prettygoodAddAlbumToLibraryReturnsSchemaSchema: z.ZodBoolean;
export declare const prettygoodAddArtistToLibraryArgsSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    artist_id: string;
}, {
    artist_id: string;
}>;
export declare const prettygoodAddArtistToLibraryReturnsSchemaSchema: z.ZodBoolean;
export declare const prettygoodAddTrackToLibraryArgsSchemaSchema: z.ZodObject<{
    track_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    track_id: string;
}, {
    track_id: string;
}>;
export declare const prettygoodAddTrackToLibraryReturnsSchemaSchema: z.ZodBoolean;
export declare const prettygoodAddTrackToPlaylistArgsSchemaSchema: z.ZodObject<{
    playlist_id: z.ZodString;
    track_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    track_id: string;
    playlist_id: string;
}, {
    track_id: string;
    playlist_id: string;
}>;
export declare const prettygoodAddTrackToPlaylistReturnsSchemaSchema: z.ZodUndefined;
export declare const prettygoodAuthenticateWalletArgsSchemaSchema: z.ZodObject<{
    wallet_address: z.ZodString;
    signature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    wallet_address: string;
    signature: string;
}, {
    wallet_address: string;
    signature: string;
}>;
export declare const prettygoodAuthenticateWalletReturnsSchemaSchema: z.ZodString;
export declare const prettygoodCreatePlaylistArgsSchemaSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    is_public: z.ZodOptional<z.ZodBoolean>;
    collaborative: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    collaborative?: boolean | undefined;
    is_public?: boolean | undefined;
}, {
    name: string;
    description?: string | undefined;
    collaborative?: boolean | undefined;
    is_public?: boolean | undefined;
}>;
export declare const prettygoodCreatePlaylistReturnsSchemaSchema: z.ZodObject<{
    collaborative: z.ZodNullable<z.ZodBoolean>;
    cover_image: z.ZodNullable<z.ZodString>;
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
    description: string | null;
    cover_image: string | null;
    created_at: string;
    updated_at: string;
    collaborative: boolean | null;
    is_public: boolean | null;
    name: string;
}, {
    id: string;
    user_id: string;
    description: string | null;
    cover_image: string | null;
    created_at: string;
    updated_at: string;
    collaborative: boolean | null;
    is_public: boolean | null;
    name: string;
}>;
export declare const prettygoodGenerateNonceArgsSchemaSchema: z.ZodObject<{
    wallet_address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    wallet_address: string;
}, {
    wallet_address: string;
}>;
export declare const prettygoodGenerateNonceReturnsSchemaSchema: z.ZodString;
export declare const prettygoodGetArtistPaymentStatsArgsSchemaSchema: z.ZodObject<{
    artist_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    artist_id: string;
}, {
    artist_id: string;
}>;
export declare const prettygoodGetArtistPaymentStatsReturnsSchemaSchema: z.ZodArray<z.ZodObject<{
    total_payments: z.ZodNumber;
    total_amount: z.ZodNumber;
    avg_amount: z.ZodNumber;
    payment_type: z.ZodString;
    month_year: z.ZodString;
}, "strip", z.ZodTypeAny, {
    payment_type: string;
    total_payments: number;
    total_amount: number;
    avg_amount: number;
    month_year: string;
}, {
    payment_type: string;
    total_payments: number;
    total_amount: number;
    avg_amount: number;
    month_year: string;
}>, "many">;
export declare const prettygoodGetRecommendationsArgsSchemaSchema: z.ZodObject<{
    limit_count: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit_count?: number | undefined;
}, {
    limit_count?: number | undefined;
}>;
export declare const prettygoodGetRecommendationsReturnsSchemaSchema: z.ZodArray<z.ZodObject<{
    album_id: z.ZodNullable<z.ZodString>;
    artist_id: z.ZodString;
    audio_url: z.ZodString;
    cover_image: z.ZodNullable<z.ZodString>;
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
    cover_image: string | null;
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
    cover_image: string | null;
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
export declare const prettygoodRecordPlayArgsSchemaSchema: z.ZodObject<{
    track_id: z.ZodString;
    play_duration: z.ZodOptional<z.ZodNumber>;
    completed: z.ZodOptional<z.ZodBoolean>;
    source: z.ZodOptional<z.ZodString>;
    context_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    track_id: string;
    completed?: boolean | undefined;
    play_duration?: number | undefined;
    source?: string | undefined;
    context_id?: string | undefined;
}, {
    track_id: string;
    completed?: boolean | undefined;
    play_duration?: number | undefined;
    source?: string | undefined;
    context_id?: string | undefined;
}>;
export declare const prettygoodRecordPlayReturnsSchemaSchema: z.ZodUndefined;
export declare const prettygoodRecordSearchArgsSchemaSchema: z.ZodObject<{
    query: z.ZodString;
}, "strip", z.ZodTypeAny, {
    query: string;
}, {
    query: string;
}>;
export declare const prettygoodRecordSearchReturnsSchemaSchema: z.ZodUndefined;
export declare const prettygoodRefreshTokenArgsSchemaSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const prettygoodRefreshTokenReturnsSchemaSchema: z.ZodString;
export declare const prettygoodRegisterAsArtistArgsSchemaSchema: z.ZodObject<{
    artist_name: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    genre: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    location: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    social_links: z.ZodOptional<z.ZodType<Json, z.ZodTypeDef, Json>>;
}, "strip", z.ZodTypeAny, {
    artist_name: string;
    genre?: string[] | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    social_links?: Json | undefined;
    website?: string | undefined;
}, {
    artist_name: string;
    genre?: string[] | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    social_links?: Json | undefined;
    website?: string | undefined;
}>;
export declare const prettygoodRegisterAsArtistReturnsSchemaSchema: z.ZodObject<{
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
    artist_name: string;
    bio: string | null;
    location: string | null;
    social_links: Json;
    verified: boolean | null;
    website: string | null;
}>;
export declare const prettygoodRegisterUserArgsSchemaSchema: z.ZodObject<{
    wallet_address: z.ZodString;
    username: z.ZodString;
    display_name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username: string;
    wallet_address: string;
    display_name?: string | undefined;
}, {
    username: string;
    wallet_address: string;
    display_name?: string | undefined;
}>;
export declare const prettygoodRegisterUserReturnsSchemaSchema: z.ZodObject<{
    created_at: z.ZodString;
    display_name: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    profile_image: z.ZodNullable<z.ZodString>;
    updated_at: z.ZodString;
    username: z.ZodString;
    wallet_address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    updated_at: string;
    display_name: string | null;
    email: string | null;
    profile_image: string | null;
    username: string;
    wallet_address: string;
}, {
    id: string;
    created_at: string;
    updated_at: string;
    display_name: string | null;
    email: string | null;
    profile_image: string | null;
    username: string;
    wallet_address: string;
}>;
export declare const prettygoodTipArtistArgsSchemaSchema: z.ZodObject<{
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
export declare const prettygoodTipArtistReturnsSchemaSchema: z.ZodObject<{
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
export declare const prettygoodVerifySignatureArgsSchemaSchema: z.ZodObject<{
    wallet_address: z.ZodString;
    signature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    wallet_address: string;
    signature: string;
}, {
    wallet_address: string;
    signature: string;
}>;
export declare const prettygoodVerifySignatureReturnsSchemaSchema: z.ZodString;
