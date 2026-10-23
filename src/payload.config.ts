import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Releases } from './collections/Releases';
import { Tracks } from './collections/Tracks';
import { Videos } from './collections/Videos';
import { Events } from './collections/Events';
import { Articles } from './collections/Articles';
import { Contacts } from './collections/Contacts';
import { ArtistProfile } from './globals/ArtistProfile';
import { SiteSettings } from './globals/SiteSettings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Dany Glock CMS',
    },
  },
  collections: [
    Users,
    Media,
    Releases,
    Tracks,
    Videos,
    Events,
    Articles,
    Contacts,
  ],
  globals: [
    ArtistProfile,
    SiteSettings,
  ],
  editor: lexicalEditor(),
  sharp: sharp as unknown as Parameters<typeof buildConfig>[0]['sharp'],
  secret: process.env.PAYLOAD_SECRET || 'dany_glock_super_secret_payload_cms_key_32_chars_min_2026',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dany_glock_dev',
    },
  }),
});
