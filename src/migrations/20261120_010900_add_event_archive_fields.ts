import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_listing" AS ENUM('upcoming', 'archive');
  CREATE TYPE "public"."enum_events_artist_role" AS ENUM('headliner', 'special_guest', 'opening_act', 'lineup', 'release_event', 'unspecified');
  CREATE TYPE "public"."enum_events_usage_rights_status" AS ENUM('pending', 'approved', 'third_party_consent', 'rejected');
  CREATE TYPE "public"."enum__events_v_version_listing" AS ENUM('upcoming', 'archive');
  CREATE TYPE "public"."enum__events_v_version_artist_role" AS ENUM('headliner', 'special_guest', 'opening_act', 'lineup', 'release_event', 'unspecified');
  CREATE TYPE "public"."enum__events_v_version_usage_rights_status" AS ENUM('pending', 'approved', 'third_party_consent', 'rejected');
  ALTER TABLE "events" ALTER COLUMN "city" DROP DEFAULT;
  ALTER TABLE "_events_v" ALTER COLUMN "version_city" DROP DEFAULT;
  ALTER TABLE "events" ADD COLUMN "listing" "enum_events_listing" DEFAULT 'upcoming';
  ALTER TABLE "events" ADD COLUMN "sort_order" numeric DEFAULT 100;
  ALTER TABLE "events" ADD COLUMN "date_label" varchar;
  ALTER TABLE "events" ADD COLUMN "artist_role" "enum_events_artist_role" DEFAULT 'unspecified';
  ALTER TABLE "events" ADD COLUMN "summary" varchar;
  ALTER TABLE "events" ADD COLUMN "usage_rights_status" "enum_events_usage_rights_status" DEFAULT 'pending';
  ALTER TABLE "events" ADD COLUMN "usage_rights_source" varchar;
  ALTER TABLE "events" ADD COLUMN "usage_rights_credit" varchar;
  ALTER TABLE "events" ADD COLUMN "usage_rights_approval_note" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_listing" "enum__events_v_version_listing" DEFAULT 'upcoming';
  ALTER TABLE "_events_v" ADD COLUMN "version_sort_order" numeric DEFAULT 100;
  ALTER TABLE "_events_v" ADD COLUMN "version_date_label" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_artist_role" "enum__events_v_version_artist_role" DEFAULT 'unspecified';
  ALTER TABLE "_events_v" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_usage_rights_status" "enum__events_v_version_usage_rights_status" DEFAULT 'pending';
  ALTER TABLE "_events_v" ADD COLUMN "version_usage_rights_source" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_usage_rights_credit" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_usage_rights_approval_note" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ALTER COLUMN "city" SET DEFAULT 'Pasto';
  ALTER TABLE "_events_v" ALTER COLUMN "version_city" SET DEFAULT 'Pasto';
  ALTER TABLE "events" DROP COLUMN IF EXISTS "listing";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "sort_order";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "date_label";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "artist_role";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "summary";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "usage_rights_status";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "usage_rights_source";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "usage_rights_credit";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "usage_rights_approval_note";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_listing";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_sort_order";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_date_label";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_artist_role";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_summary";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_usage_rights_status";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_usage_rights_source";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_usage_rights_credit";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_usage_rights_approval_note";
  DROP TYPE IF EXISTS "public"."enum_events_listing";
  DROP TYPE IF EXISTS "public"."enum_events_artist_role";
  DROP TYPE IF EXISTS "public"."enum_events_usage_rights_status";
  DROP TYPE IF EXISTS "public"."enum__events_v_version_listing";
  DROP TYPE IF EXISTS "public"."enum__events_v_version_artist_role";
  DROP TYPE IF EXISTS "public"."enum__events_v_version_usage_rights_status";`)
}
