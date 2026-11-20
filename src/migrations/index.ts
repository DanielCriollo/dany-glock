import * as migration_20261023_054057_initial_setup from './20261023_054057_initial_setup';
import * as migration_20261023_060207_add_contact_honeypot from './20261023_060207_add_contact_honeypot';
import * as migration_20261023_150557_add_artist_data_and_verification from './20261023_150557_add_artist_data_and_verification';
import * as migration_20261023_180000_add_hero_and_portrait_media from './20261023_180000_add_hero_and_portrait_media';
import * as migration_20261023_194032_add_brochure_content_structure from './20261023_194032_add_brochure_content_structure';
import * as migration_20261120_010900_add_event_archive_fields from './20261120_010900_add_event_archive_fields';

export const migrations = [
  {
    up: migration_20261023_054057_initial_setup.up,
    down: migration_20261023_054057_initial_setup.down,
    name: '20261023_054057_initial_setup',
  },
  {
    up: migration_20261023_060207_add_contact_honeypot.up,
    down: migration_20261023_060207_add_contact_honeypot.down,
    name: '20261023_060207_add_contact_honeypot',
  },
  {
    up: migration_20261023_150557_add_artist_data_and_verification.up,
    down: migration_20261023_150557_add_artist_data_and_verification.down,
    name: '20261023_150557_add_artist_data_and_verification',
  },
  {
    up: migration_20261023_180000_add_hero_and_portrait_media.up,
    down: migration_20261023_180000_add_hero_and_portrait_media.down,
    name: '20261023_180000_add_hero_and_portrait_media',
  },
  {
    up: migration_20261023_194032_add_brochure_content_structure.up,
    down: migration_20261023_194032_add_brochure_content_structure.down,
    name: '20261023_194032_add_brochure_content_structure',
  },
  {
    up: migration_20261120_010900_add_event_archive_fields.up,
    down: migration_20261120_010900_add_event_archive_fields.down,
    name: '20261120_010900_add_event_archive_fields'
  },
];
