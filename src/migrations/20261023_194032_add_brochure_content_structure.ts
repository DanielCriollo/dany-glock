import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_gallery_rights_status" AS ENUM('pending', 'approved', 'third_party_consent');
  CREATE TYPE "public"."enum_career_highlights_category" AS ENUM('award', 'milestone', 'collaboration', 'shared_stage', 'social_impact');
  CREATE TYPE "public"."enum_career_highlights_source_type" AS ENUM('platform', 'press', 'artist_brochure', 'management');
  CREATE TYPE "public"."enum_career_highlights_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal');
  CREATE TYPE "public"."enum_career_highlights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__career_highlights_v_version_category" AS ENUM('award', 'milestone', 'collaboration', 'shared_stage', 'social_impact');
  CREATE TYPE "public"."enum__career_highlights_v_version_source_type" AS ENUM('platform', 'press', 'artist_brochure', 'management');
  CREATE TYPE "public"."enum__career_highlights_v_version_verification_status" AS ENUM('verified', 'to_confirm', 'editorial_proposal');
  CREATE TYPE "public"."enum__career_highlights_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_booking_specs_status" AS ENUM('declared', 'confirmed');
  CREATE TYPE "public"."enum_press_kit_bio_variant" AS ENUM('short', 'medium');
  CREATE TYPE "public"."enum_press_kit_download_status" AS ENUM('not_available', 'in_preparation', 'available');
  ALTER TYPE "public"."enum_media_category" ADD VALUE IF NOT EXISTS 'event_flyer';
  ALTER TYPE "public"."enum_media_category" ADD VALUE IF NOT EXISTS 'live_photo';
  CREATE TABLE "career_highlights_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"origin" varchar
  );
  
  CREATE TABLE "career_highlights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category" "enum_career_highlights_category",
  	"year" numeric,
  	"date_label" varchar,
  	"description" varchar,
  	"related_release_id" integer,
  	"external_url" varchar,
  	"source_type" "enum_career_highlights_source_type" DEFAULT 'artist_brochure',
  	"sort_order" numeric DEFAULT 100,
  	"verification_status" "enum_career_highlights_verification_status" DEFAULT 'to_confirm',
  	"verification_source_url" varchar,
  	"verification_consulted_at" timestamp(3) with time zone,
  	"verification_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_career_highlights_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_career_highlights_v_version_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"origin" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_career_highlights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category" "enum__career_highlights_v_version_category",
  	"version_year" numeric,
  	"version_date_label" varchar,
  	"version_description" varchar,
  	"version_related_release_id" integer,
  	"version_external_url" varchar,
  	"version_source_type" "enum__career_highlights_v_version_source_type" DEFAULT 'artist_brochure',
  	"version_sort_order" numeric DEFAULT 100,
  	"version_verification_status" "enum__career_highlights_v_version_verification_status" DEFAULT 'to_confirm',
  	"version_verification_source_url" varchar,
  	"version_verification_consulted_at" timestamp(3) with time zone,
  	"version_verification_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__career_highlights_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "booking_live_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "booking_event_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "booking" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_title" varchar DEFAULT 'Dany Glock en vivo',
  	"show_description" varchar,
  	"specs_status" "enum_booking_specs_status" DEFAULT 'declared' NOT NULL,
  	"specs_duration" varchar,
  	"specs_format" varchar,
  	"specs_genre" varchar,
  	"specs_audience" varchar,
  	"specs_includes_dancers" boolean DEFAULT false,
  	"base_location" varchar DEFAULT 'Pasto, Nariño, Colombia',
  	"availability_note" varchar,
  	"quote_note" varchar,
  	"technical_rider_id" integer,
  	"management_publish_contact" boolean DEFAULT false,
  	"management_name" varchar,
  	"management_role" varchar,
  	"management_email" varchar,
  	"management_whatsapp" varchar,
  	"management_confirmed_at" timestamp(3) with time zone,
  	"management_source_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "press_kit" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_public" boolean DEFAULT false,
  	"headline" varchar DEFAULT 'Electronic Press Kit',
  	"intro" varchar,
  	"bio_variant" "enum_press_kit_bio_variant" DEFAULT 'medium',
  	"include_show_info" boolean DEFAULT true,
  	"download_status" "enum_press_kit_download_status" DEFAULT 'not_available',
  	"downloadable_pdf_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "press_kit_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"releases_id" integer,
  	"videos_id" integer
  );
  
  ALTER TABLE "artist_profile" ALTER COLUMN "tagline" SET DEFAULT 'Música urbana, trap latino y estética nocturna desde Pasto, Colombia.';
  ALTER TABLE "media" ADD COLUMN "credit" varchar;
  ALTER TABLE "media" ADD COLUMN "gallery_visible" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "gallery_rights_status" "enum_media_gallery_rights_status" DEFAULT 'pending';
  ALTER TABLE "media" ADD COLUMN "gallery_event_label" varchar;
  ALTER TABLE "media" ADD COLUMN "gallery_date_label" varchar;
  ALTER TABLE "media" ADD COLUMN "gallery_venue_label" varchar;
  ALTER TABLE "media" ADD COLUMN "gallery_sort_order" numeric DEFAULT 100;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "career_highlights_id" integer;
  -- Columnas del hero creadas en 20261023_180000 (sin snapshot JSON): solo se alinean sus DEFAULT.
  ALTER TABLE "artist_profile" ALTER COLUMN "hero_title" SET DEFAULT 'Dany Glock';
  ALTER TABLE "artist_profile" ALTER COLUMN "hero_subtitle" SET DEFAULT 'Trap Latino & Sonido Nocturno';
  ALTER TABLE "artist_profile" ALTER COLUMN "hero_cta_primary" SET DEFAULT 'Explorar Discografía';
  ALTER TABLE "artist_profile" ALTER COLUMN "hero_cta_secondary" SET DEFAULT 'Videografía Oficial';
  ALTER TABLE "career_highlights_people" ADD CONSTRAINT "career_highlights_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."career_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_highlights" ADD CONSTRAINT "career_highlights_related_release_id_releases_id_fk" FOREIGN KEY ("related_release_id") REFERENCES "public"."releases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_career_highlights_v_version_people" ADD CONSTRAINT "_career_highlights_v_version_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_career_highlights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_highlights_v" ADD CONSTRAINT "_career_highlights_v_parent_id_career_highlights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."career_highlights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_career_highlights_v" ADD CONSTRAINT "_career_highlights_v_version_related_release_id_releases_id_fk" FOREIGN KEY ("version_related_release_id") REFERENCES "public"."releases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "booking_live_features" ADD CONSTRAINT "booking_live_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "booking_event_types" ADD CONSTRAINT "booking_event_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "booking" ADD CONSTRAINT "booking_technical_rider_id_media_id_fk" FOREIGN KEY ("technical_rider_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "press_kit" ADD CONSTRAINT "press_kit_downloadable_pdf_id_media_id_fk" FOREIGN KEY ("downloadable_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "press_kit_rels" ADD CONSTRAINT "press_kit_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."press_kit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "press_kit_rels" ADD CONSTRAINT "press_kit_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "press_kit_rels" ADD CONSTRAINT "press_kit_rels_releases_fk" FOREIGN KEY ("releases_id") REFERENCES "public"."releases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "press_kit_rels" ADD CONSTRAINT "press_kit_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "career_highlights_people_order_idx" ON "career_highlights_people" USING btree ("_order");
  CREATE INDEX "career_highlights_people_parent_id_idx" ON "career_highlights_people" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "career_highlights_slug_idx" ON "career_highlights" USING btree ("slug");
  CREATE INDEX "career_highlights_related_release_idx" ON "career_highlights" USING btree ("related_release_id");
  CREATE INDEX "career_highlights_updated_at_idx" ON "career_highlights" USING btree ("updated_at");
  CREATE INDEX "career_highlights_created_at_idx" ON "career_highlights" USING btree ("created_at");
  CREATE INDEX "career_highlights__status_idx" ON "career_highlights" USING btree ("_status");
  CREATE INDEX "_career_highlights_v_version_people_order_idx" ON "_career_highlights_v_version_people" USING btree ("_order");
  CREATE INDEX "_career_highlights_v_version_people_parent_id_idx" ON "_career_highlights_v_version_people" USING btree ("_parent_id");
  CREATE INDEX "_career_highlights_v_parent_idx" ON "_career_highlights_v" USING btree ("parent_id");
  CREATE INDEX "_career_highlights_v_version_version_slug_idx" ON "_career_highlights_v" USING btree ("version_slug");
  CREATE INDEX "_career_highlights_v_version_version_related_release_idx" ON "_career_highlights_v" USING btree ("version_related_release_id");
  CREATE INDEX "_career_highlights_v_version_version_updated_at_idx" ON "_career_highlights_v" USING btree ("version_updated_at");
  CREATE INDEX "_career_highlights_v_version_version_created_at_idx" ON "_career_highlights_v" USING btree ("version_created_at");
  CREATE INDEX "_career_highlights_v_version_version__status_idx" ON "_career_highlights_v" USING btree ("version__status");
  CREATE INDEX "_career_highlights_v_created_at_idx" ON "_career_highlights_v" USING btree ("created_at");
  CREATE INDEX "_career_highlights_v_updated_at_idx" ON "_career_highlights_v" USING btree ("updated_at");
  CREATE INDEX "_career_highlights_v_latest_idx" ON "_career_highlights_v" USING btree ("latest");
  CREATE INDEX "booking_live_features_order_idx" ON "booking_live_features" USING btree ("_order");
  CREATE INDEX "booking_live_features_parent_id_idx" ON "booking_live_features" USING btree ("_parent_id");
  CREATE INDEX "booking_event_types_order_idx" ON "booking_event_types" USING btree ("_order");
  CREATE INDEX "booking_event_types_parent_id_idx" ON "booking_event_types" USING btree ("_parent_id");
  CREATE INDEX "booking_technical_rider_idx" ON "booking" USING btree ("technical_rider_id");
  CREATE INDEX "press_kit_downloadable_pdf_idx" ON "press_kit" USING btree ("downloadable_pdf_id");
  CREATE INDEX "press_kit_rels_order_idx" ON "press_kit_rels" USING btree ("order");
  CREATE INDEX "press_kit_rels_parent_idx" ON "press_kit_rels" USING btree ("parent_id");
  CREATE INDEX "press_kit_rels_path_idx" ON "press_kit_rels" USING btree ("path");
  CREATE INDEX "press_kit_rels_media_id_idx" ON "press_kit_rels" USING btree ("media_id");
  CREATE INDEX "press_kit_rels_releases_id_idx" ON "press_kit_rels" USING btree ("releases_id");
  CREATE INDEX "press_kit_rels_videos_id_idx" ON "press_kit_rels" USING btree ("videos_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_career_highlights_fk" FOREIGN KEY ("career_highlights_id") REFERENCES "public"."career_highlights"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_career_highlights_id_idx" ON "payload_locked_documents_rels" USING btree ("career_highlights_id");
  CREATE INDEX IF NOT EXISTS "artist_profile_hero_desktop_media_idx" ON "artist_profile" USING btree ("hero_desktop_media_id");
  CREATE INDEX IF NOT EXISTS "artist_profile_hero_mobile_media_idx" ON "artist_profile" USING btree ("hero_mobile_media_id");
  CREATE INDEX IF NOT EXISTS "artist_profile_portrait_image_idx" ON "artist_profile" USING btree ("portrait_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "career_highlights_people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "career_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_highlights_v_version_people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_career_highlights_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "booking_live_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "booking_event_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "booking" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "press_kit" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "press_kit_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "career_highlights_people" CASCADE;
  DROP TABLE "career_highlights" CASCADE;
  DROP TABLE "_career_highlights_v_version_people" CASCADE;
  DROP TABLE "_career_highlights_v" CASCADE;
  DROP TABLE "booking_live_features" CASCADE;
  DROP TABLE "booking_event_types" CASCADE;
  DROP TABLE "booking" CASCADE;
  DROP TABLE "press_kit" CASCADE;
  DROP TABLE "press_kit_rels" CASCADE;
  -- El DROP TABLE ... CASCADE anterior ya elimina esta FK.
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_career_highlights_fk";
  
  -- Requiere que ningún media use 'event_flyer' o 'live_photo' (reasignar antes de revertir).
  ALTER TABLE "media" ALTER COLUMN "category" SET DATA TYPE text;
  ALTER TABLE "media" ALTER COLUMN "category" SET DEFAULT 'artwork'::text;
  DROP TYPE IF EXISTS "public"."enum_media_category";
  CREATE TYPE "public"."enum_media_category" AS ENUM('artwork', 'photo_shoot', 'press_photo', 'audio_preview', 'document');
  ALTER TABLE "media" ALTER COLUMN "category" SET DEFAULT 'artwork'::"public"."enum_media_category";
  ALTER TABLE "media" ALTER COLUMN "category" SET DATA TYPE "public"."enum_media_category" USING "category"::"public"."enum_media_category";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_career_highlights_id_idx";
  DROP INDEX IF EXISTS "artist_profile_hero_desktop_media_idx";
  DROP INDEX IF EXISTS "artist_profile_hero_mobile_media_idx";
  DROP INDEX IF EXISTS "artist_profile_portrait_image_idx";
  ALTER TABLE "artist_profile" ALTER COLUMN "tagline" SET DEFAULT 'Artist Digital Experience — Dark Cinematic Editorial';
  ALTER TABLE "media" DROP COLUMN IF EXISTS "credit";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "gallery_visible";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "gallery_rights_status";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "gallery_event_label";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "gallery_date_label";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "gallery_venue_label";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "gallery_sort_order";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "career_highlights_id";
  ALTER TABLE "artist_profile" ALTER COLUMN "hero_title" DROP DEFAULT;
  ALTER TABLE "artist_profile" ALTER COLUMN "hero_subtitle" DROP DEFAULT;
  ALTER TABLE "artist_profile" ALTER COLUMN "hero_cta_primary" DROP DEFAULT;
  ALTER TABLE "artist_profile" ALTER COLUMN "hero_cta_secondary" DROP DEFAULT;
  DROP TYPE IF EXISTS "public"."enum_media_gallery_rights_status";
  DROP TYPE IF EXISTS "public"."enum_career_highlights_category";
  DROP TYPE IF EXISTS "public"."enum_career_highlights_source_type";
  DROP TYPE IF EXISTS "public"."enum_career_highlights_verification_status";
  DROP TYPE IF EXISTS "public"."enum_career_highlights_status";
  DROP TYPE IF EXISTS "public"."enum__career_highlights_v_version_category";
  DROP TYPE IF EXISTS "public"."enum__career_highlights_v_version_source_type";
  DROP TYPE IF EXISTS "public"."enum__career_highlights_v_version_verification_status";
  DROP TYPE IF EXISTS "public"."enum__career_highlights_v_version_status";
  DROP TYPE IF EXISTS "public"."enum_booking_specs_status";
  DROP TYPE IF EXISTS "public"."enum_press_kit_bio_variant";
  DROP TYPE IF EXISTS "public"."enum_press_kit_download_status";`)
}
