import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "public"."enum_releases_artist_role" AS ENUM('main', 'featured', 'collaborator'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_releases_cover_status" AS ENUM('confirmed', 'pending', 'placeholder'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_releases_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__releases_v_version_artist_role" AS ENUM('main', 'featured', 'collaborator'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__releases_v_version_cover_status" AS ENUM('confirmed', 'pending', 'placeholder'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__releases_v_version_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_tracks_artist_role" AS ENUM('main', 'featured', 'collaborator'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_tracks_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_videos_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__videos_v_version_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_events_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__events_v_version_ticket_status" AS ENUM('available', 'sold_out', 'presale', 'free', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__events_v_version_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_articles_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__articles_v_version_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_artist_profile_bio_status" AS ENUM('editorial_draft', 'approved'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_artist_profile_translations_en_status" AS ENUM('draft_pending_review', 'approved'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_artist_profile_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_site_settings_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal'); EXCEPTION WHEN duplicate_object THEN null; END $$;

  ALTER TYPE "public"."enum_videos_type" ADD VALUE IF NOT EXISTS 'trailer' BEFORE 'live_session';
  ALTER TYPE "public"."enum__videos_v_version_type" ADD VALUE IF NOT EXISTS 'trailer' BEFORE 'live_session';

  CREATE TABLE IF NOT EXISTS "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_event_name" varchar,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_city" varchar DEFAULT 'Pasto',
  	"version_country" varchar DEFAULT 'Colombia',
  	"version_venue" varchar,
  	"version_ticket_status" "enum__events_v_version_ticket_status" DEFAULT 'available',
  	"version_ticket_url" varchar,
  	"version_vip_package_url" varchar,
  	"version_poster_image_id" integer,
  	"version_related_video_url" varchar,
  	"version_instagram_post_url" varchar,
  	"version_additional_info" varchar,
  	"version_verification_status" "enum__events_v_version_verification_status" DEFAULT 'to_confirm',
  	"version_verification_source_url" varchar,
  	"version_verification_consulted_at" timestamp(3) with time zone,
  	"version_verification_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "events" ALTER COLUMN "event_name" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "date" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "city" SET DEFAULT 'Pasto';
  ALTER TABLE "events" ALTER COLUMN "city" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "country" SET DEFAULT 'Colombia';
  ALTER TABLE "events" ALTER COLUMN "country" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "venue" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "ticket_status" DROP NOT NULL;
  ALTER TABLE "contacts" ALTER COLUMN "status" DROP NOT NULL;
  ALTER TABLE "artist_profile" ALTER COLUMN "manifesto" SET DEFAULT 'La música urbana como cinematografía sonora: una narrativa nocturna nacida en el sur de Colombia y proyectada a la escena global.';
  ALTER TABLE "artist_profile" ALTER COLUMN "short_bio" SET DEFAULT 'Dany Glock es un artista de música urbana originario de Pasto, Nariño, Colombia. Su propuesta combina trap contemporáneo, identidad lírica y una estética visual nocturna de alto impacto cinematográfico.';
  ALTER TABLE "artist_profile" ALTER COLUMN "medium_bio" SET DEFAULT 'Originario de Pasto, Nariño, Colombia, Dany Glock ha consolidado una propuesta musical y visual que redefine el género urbano latino. A través de una estética oscura, elegante y editorial, su trabajo fusiona letras introspectivas con producción de primer nivel.';
  ALTER TABLE "artist_profile" ALTER COLUMN "origin_city" SET DEFAULT 'Pasto';
  ALTER TABLE "artist_profile" ALTER COLUMN "origin_country" SET DEFAULT 'Colombia';
  ALTER TABLE "site_settings" ALTER COLUMN "social_links_instagram" SET DEFAULT 'https://www.instagram.com/danyglock_/';
  ALTER TABLE "site_settings" ALTER COLUMN "social_links_youtube" SET DEFAULT 'https://www.youtube.com/@danyglock';
  ALTER TABLE "site_settings" ALTER COLUMN "social_links_apple_music" SET DEFAULT 'https://music.apple.com/us/artist/dany-glock/1739565666';

  ALTER TABLE "releases" ADD COLUMN IF NOT EXISTS "artist_role" "enum_releases_artist_role" DEFAULT 'main';
  ALTER TABLE "releases" ADD COLUMN IF NOT EXISTS "cover_status" "enum_releases_cover_status" DEFAULT 'confirmed';
  ALTER TABLE "releases" ADD COLUMN IF NOT EXISTS "streaming_links_spotify_embed_url" varchar;
  ALTER TABLE "releases" ADD COLUMN IF NOT EXISTS "streaming_links_amazon_music" varchar;
  ALTER TABLE "releases" ADD COLUMN IF NOT EXISTS "verification_status" "enum_releases_verification_status" DEFAULT 'to_confirm';
  ALTER TABLE "releases" ADD COLUMN IF NOT EXISTS "verification_source_url" varchar;
  ALTER TABLE "releases" ADD COLUMN IF NOT EXISTS "verification_consulted_at" timestamp(3) with time zone;
  ALTER TABLE "releases" ADD COLUMN IF NOT EXISTS "verification_notes" varchar;

  ALTER TABLE "_releases_v" ADD COLUMN IF NOT EXISTS "version_artist_role" "enum__releases_v_version_artist_role" DEFAULT 'main';
  ALTER TABLE "_releases_v" ADD COLUMN IF NOT EXISTS "version_cover_status" "enum__releases_v_version_cover_status" DEFAULT 'confirmed';
  ALTER TABLE "_releases_v" ADD COLUMN IF NOT EXISTS "version_streaming_links_spotify_embed_url" varchar;
  ALTER TABLE "_releases_v" ADD COLUMN IF NOT EXISTS "version_streaming_links_amazon_music" varchar;
  ALTER TABLE "_releases_v" ADD COLUMN IF NOT EXISTS "version_verification_status" "enum__releases_v_version_verification_status" DEFAULT 'to_confirm';
  ALTER TABLE "_releases_v" ADD COLUMN IF NOT EXISTS "version_verification_source_url" varchar;
  ALTER TABLE "_releases_v" ADD COLUMN IF NOT EXISTS "version_verification_consulted_at" timestamp(3) with time zone;
  ALTER TABLE "_releases_v" ADD COLUMN IF NOT EXISTS "version_verification_notes" varchar;

  ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "artist_role" "enum_tracks_artist_role" DEFAULT 'main';
  ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "apple_music_url" varchar;
  ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "verification_status" "enum_tracks_verification_status" DEFAULT 'to_confirm';
  ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "verification_source_url" varchar;
  ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "verification_consulted_at" timestamp(3) with time zone;
  ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "verification_notes" varchar;

  ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "youtube_id" varchar;
  ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "duration" varchar;
  ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "verification_status" "enum_videos_verification_status" DEFAULT 'to_confirm';
  ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "verification_source_url" varchar;
  ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "verification_consulted_at" timestamp(3) with time zone;
  ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "verification_notes" varchar;

  ALTER TABLE "_videos_v" ADD COLUMN IF NOT EXISTS "version_youtube_id" varchar;
  ALTER TABLE "_videos_v" ADD COLUMN IF NOT EXISTS "version_duration" varchar;
  ALTER TABLE "_videos_v" ADD COLUMN IF NOT EXISTS "version_verification_status" "enum__videos_v_version_verification_status" DEFAULT 'to_confirm';
  ALTER TABLE "_videos_v" ADD COLUMN IF NOT EXISTS "version_verification_source_url" varchar;
  ALTER TABLE "_videos_v" ADD COLUMN IF NOT EXISTS "version_verification_consulted_at" timestamp(3) with time zone;
  ALTER TABLE "_videos_v" ADD COLUMN IF NOT EXISTS "version_verification_notes" varchar;

  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "slug" varchar;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "related_video_url" varchar;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "instagram_post_url" varchar;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "verification_status" "enum_events_verification_status" DEFAULT 'to_confirm';
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "verification_source_url" varchar;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "verification_consulted_at" timestamp(3) with time zone;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "verification_notes" varchar;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "_status" "enum_events_status" DEFAULT 'draft';

  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "verification_status" "enum_articles_verification_status" DEFAULT 'to_confirm';
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "verification_source_url" varchar;
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "verification_consulted_at" timestamp(3) with time zone;
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "verification_notes" varchar;

  ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_verification_status" "enum__articles_v_version_verification_status" DEFAULT 'to_confirm';
  ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_verification_source_url" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_verification_consulted_at" timestamp(3) with time zone;
  ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_verification_notes" varchar;

  ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "bio_status" "enum_artist_profile_bio_status" DEFAULT 'editorial_draft';
  ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "translations_en_status" "enum_artist_profile_translations_en_status" DEFAULT 'draft_pending_review';
  ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "translations_en_short_bio" varchar DEFAULT 'Dany Glock is an urban music and Latin trap artist from Pasto, Colombia. His sonic vision merges nocturnal storytelling with a dark, high-impact cinematic editorial aesthetic.';
  ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "translations_en_medium_bio" varchar DEFAULT 'Hailing from Pasto, Nariño, Colombia, Dany Glock brings a distinct and sophisticated perspective to contemporary Latin urban music. Anchored by heavy atmospheric beats and introspective lyrics, his work defines a dark cinematic visual and sonic experience.';
  ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "verification_status" "enum_artist_profile_verification_status" DEFAULT 'to_confirm';
  ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "verification_source_url" varchar;
  ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "verification_consulted_at" timestamp(3) with time zone;
  ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "verification_notes" varchar;

  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "social_links_youtube_channel_id" varchar DEFAULT 'UCf-4AJMV8QZz1jj4OVBzaxg';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "verification_status" "enum_site_settings_verification_status" DEFAULT 'to_confirm';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "verification_source_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "verification_consulted_at" timestamp(3) with time zone;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "verification_notes" varchar;

  DO $$ BEGIN ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_poster_image_id_media_id_fk" FOREIGN KEY ("version_poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_poster_image_idx" ON "_events_v" USING btree ("version_poster_image_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_events_v_rels_media_id_idx" ON "_events_v_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "events__status_idx" ON "events" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "events_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "events_rels" CASCADE;
  DROP TABLE IF EXISTS "_events_v" CASCADE;
  DROP TABLE IF EXISTS "_events_v_rels" CASCADE;
  ALTER TABLE "videos" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "videos" ALTER COLUMN "type" SET DEFAULT 'official_music_video'::text;
  DROP TYPE IF EXISTS "public"."enum_videos_type";
  CREATE TYPE "public"."enum_videos_type" AS ENUM('official_music_video', 'live_session', 'visualizer', 'behind_the_scenes');
  ALTER TABLE "videos" ALTER COLUMN "type" SET DEFAULT 'official_music_video'::"public"."enum_videos_type";
  ALTER TABLE "videos" ALTER COLUMN "type" SET DATA TYPE "public"."enum_videos_type" USING "type"::"public"."enum_videos_type";
  ALTER TABLE "_videos_v" ALTER COLUMN "version_type" SET DATA TYPE text;
  ALTER TABLE "_videos_v" ALTER COLUMN "version_type" SET DEFAULT 'official_music_video'::text;
  DROP TYPE IF EXISTS "public"."enum__videos_v_version_type";
  CREATE TYPE "public"."enum__videos_v_version_type" AS ENUM('official_music_video', 'live_session', 'visualizer', 'behind_the_scenes');
  ALTER TABLE "_videos_v" ALTER COLUMN "version_type" SET DEFAULT 'official_music_video'::"public"."enum__videos_v_version_type";
  ALTER TABLE "_videos_v" ALTER COLUMN "version_type" SET DATA TYPE "public"."enum__videos_v_version_type" USING "version_type"::"public"."enum__videos_v_version_type";
  DROP INDEX IF EXISTS "events_slug_idx";
  DROP INDEX IF EXISTS "events__status_idx";
  ALTER TABLE "events" ALTER COLUMN "event_name" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "city" DROP DEFAULT;
  ALTER TABLE "events" ALTER COLUMN "city" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "country" SET DEFAULT 'Guatemala';
  ALTER TABLE "events" ALTER COLUMN "country" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "venue" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "ticket_status" SET NOT NULL;
  ALTER TABLE "contacts" ALTER COLUMN "status" SET NOT NULL;
  ALTER TABLE "artist_profile" ALTER COLUMN "manifesto" SET DEFAULT 'La música urbana como cinematografía sonora: una narrativa nocturna nacida en el altiplano de Guatemala y proyectada a la escena global.';
  ALTER TABLE "artist_profile" ALTER COLUMN "short_bio" SET DEFAULT 'Dany Glock es un artista de música urbana originario de Quetzaltenango, Guatemala. Su propuesta combina trap contemporáneo, reggaetón de autor y una estética visual nocturna de alto impacto cinematográfico.';
  ALTER TABLE "artist_profile" ALTER COLUMN "medium_bio" SET DEFAULT 'Originario de Quetzaltenango, Guatemala, Dany Glock ha consolidado una propuesta musical y visual que redefine el género urbano centroamericano. A través de una estética oscura, elegante y editorial, su trabajo fusiona letras introspectivas con producción de clase mundial.';
  ALTER TABLE "artist_profile" ALTER COLUMN "origin_city" SET DEFAULT 'Quetzaltenango';
  ALTER TABLE "artist_profile" ALTER COLUMN "origin_country" SET DEFAULT 'Guatemala';
  ALTER TABLE "site_settings" ALTER COLUMN "social_links_instagram" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "social_links_youtube" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "social_links_apple_music" DROP DEFAULT;
  ALTER TABLE "releases" DROP COLUMN IF EXISTS "artist_role";
  ALTER TABLE "releases" DROP COLUMN IF EXISTS "cover_status";
  ALTER TABLE "releases" DROP COLUMN IF EXISTS "streaming_links_spotify_embed_url";
  ALTER TABLE "releases" DROP COLUMN IF EXISTS "streaming_links_amazon_music";
  ALTER TABLE "releases" DROP COLUMN IF EXISTS "verification_status";
  ALTER TABLE "releases" DROP COLUMN IF EXISTS "verification_source_url";
  ALTER TABLE "releases" DROP COLUMN IF EXISTS "verification_consulted_at";
  ALTER TABLE "releases" DROP COLUMN IF EXISTS "verification_notes";
  ALTER TABLE "_releases_v" DROP COLUMN IF EXISTS "version_artist_role";
  ALTER TABLE "_releases_v" DROP COLUMN IF EXISTS "version_cover_status";
  ALTER TABLE "_releases_v" DROP COLUMN IF EXISTS "version_streaming_links_spotify_embed_url";
  ALTER TABLE "_releases_v" DROP COLUMN IF EXISTS "version_streaming_links_amazon_music";
  ALTER TABLE "_releases_v" DROP COLUMN IF EXISTS "version_verification_status";
  ALTER TABLE "_releases_v" DROP COLUMN IF EXISTS "version_verification_source_url";
  ALTER TABLE "_releases_v" DROP COLUMN IF EXISTS "version_verification_consulted_at";
  ALTER TABLE "_releases_v" DROP COLUMN IF EXISTS "version_verification_notes";
  ALTER TABLE "tracks" DROP COLUMN IF EXISTS "artist_role";
  ALTER TABLE "tracks" DROP COLUMN IF EXISTS "apple_music_url";
  ALTER TABLE "tracks" DROP COLUMN IF EXISTS "verification_status";
  ALTER TABLE "tracks" DROP COLUMN IF EXISTS "verification_source_url";
  ALTER TABLE "tracks" DROP COLUMN IF EXISTS "verification_consulted_at";
  ALTER TABLE "tracks" DROP COLUMN IF EXISTS "verification_notes";
  ALTER TABLE "videos" DROP COLUMN IF EXISTS "youtube_id";
  ALTER TABLE "videos" DROP COLUMN IF EXISTS "duration";
  ALTER TABLE "videos" DROP COLUMN IF EXISTS "verification_status";
  ALTER TABLE "videos" DROP COLUMN IF EXISTS "verification_source_url";
  ALTER TABLE "videos" DROP COLUMN IF EXISTS "verification_consulted_at";
  ALTER TABLE "videos" DROP COLUMN IF EXISTS "verification_notes";
  ALTER TABLE "_videos_v" DROP COLUMN IF EXISTS "version_youtube_id";
  ALTER TABLE "_videos_v" DROP COLUMN IF EXISTS "version_duration";
  ALTER TABLE "_videos_v" DROP COLUMN IF EXISTS "version_verification_status";
  ALTER TABLE "_videos_v" DROP COLUMN IF EXISTS "version_verification_source_url";
  ALTER TABLE "_videos_v" DROP COLUMN IF EXISTS "version_verification_consulted_at";
  ALTER TABLE "_videos_v" DROP COLUMN IF EXISTS "version_verification_notes";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "slug";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "related_video_url";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "instagram_post_url";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "verification_status";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "verification_source_url";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "verification_consulted_at";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "verification_notes";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "_status";
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "verification_status";
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "verification_source_url";
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "verification_consulted_at";
  ALTER TABLE "articles" DROP COLUMN IF EXISTS "verification_notes";
  ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_verification_status";
  ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_verification_source_url";
  ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_verification_consulted_at";
  ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_verification_notes";
  ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "bio_status";
  ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "translations_en_status";
  ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "translations_en_short_bio";
  ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "translations_en_medium_bio";
  ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "verification_status";
  ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "verification_source_url";
  ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "verification_consulted_at";
  ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "verification_notes";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "social_links_youtube_channel_id";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "verification_status";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "verification_source_url";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "verification_consulted_at";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "verification_notes";
  DROP TYPE IF EXISTS "public"."enum_releases_artist_role";
  DROP TYPE IF EXISTS "public"."enum_releases_cover_status";
  DROP TYPE IF EXISTS "public"."enum_releases_verification_status";
  DROP TYPE IF EXISTS "public"."enum__releases_v_version_artist_role";
  DROP TYPE IF EXISTS "public"."enum__releases_v_version_cover_status";
  DROP TYPE IF EXISTS "public"."enum__releases_v_version_verification_status";
  DROP TYPE IF EXISTS "public"."enum_tracks_artist_role";
  DROP TYPE IF EXISTS "public"."enum_tracks_verification_status";
  DROP TYPE IF EXISTS "public"."enum_videos_verification_status";
  DROP TYPE IF EXISTS "public"."enum__videos_v_version_verification_status";
  DROP TYPE IF EXISTS "public"."enum_events_verification_status";
  DROP TYPE IF EXISTS "public"."enum_events_status";
  DROP TYPE IF EXISTS "public"."enum__events_v_version_ticket_status";
  DROP TYPE IF EXISTS "public"."enum__events_v_version_verification_status";
  DROP TYPE IF EXISTS "public"."enum__events_v_version_status";
  DROP TYPE IF EXISTS "public"."enum_articles_verification_status";
  DROP TYPE IF EXISTS "public"."enum__articles_v_version_verification_status";
  DROP TYPE IF EXISTS "public"."enum_artist_profile_bio_status";
  DROP TYPE IF EXISTS "public"."enum_artist_profile_translations_en_status";
  DROP TYPE IF EXISTS "public"."enum_artist_profile_verification_status";
  DROP TYPE IF EXISTS "public"."enum_site_settings_verification_status";`)
}
