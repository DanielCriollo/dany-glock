import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "hero_desktop_media_id" integer;
    ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "hero_mobile_media_id" integer;
    ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "hero_video_url" varchar;
    ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "portrait_image_id" integer;
    ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "hero_title" varchar;
    ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "hero_subtitle" varchar;
    ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "hero_cta_primary" varchar;
    ALTER TABLE "artist_profile" ADD COLUMN IF NOT EXISTS "hero_cta_secondary" varchar;

    DO $$ BEGIN
      ALTER TABLE "artist_profile" ADD CONSTRAINT "artist_profile_hero_desktop_media_id_media_id_fk" FOREIGN KEY ("hero_desktop_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "artist_profile" ADD CONSTRAINT "artist_profile_hero_mobile_media_id_media_id_fk" FOREIGN KEY ("hero_mobile_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "artist_profile" ADD CONSTRAINT "artist_profile_portrait_image_id_media_id_fk" FOREIGN KEY ("portrait_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "artist_profile" DROP CONSTRAINT IF EXISTS "artist_profile_hero_desktop_media_id_media_id_fk";
    ALTER TABLE "artist_profile" DROP CONSTRAINT IF EXISTS "artist_profile_hero_mobile_media_id_media_id_fk";
    ALTER TABLE "artist_profile" DROP CONSTRAINT IF EXISTS "artist_profile_portrait_image_id_media_id_fk";

    ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "hero_desktop_media_id";
    ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "hero_mobile_media_id";
    ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "hero_video_url";
    ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "portrait_image_id";
    ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "hero_title";
    ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "hero_subtitle";
    ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "hero_cta_primary";
    ALTER TABLE "artist_profile" DROP COLUMN IF EXISTS "hero_cta_secondary";
  `);
}
