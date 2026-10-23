import * as migration_20261023_054057_initial_setup from './20261023_054057_initial_setup';
import * as migration_20261023_060207_add_contact_honeypot from './20261023_060207_add_contact_honeypot';
import * as migration_20261023_150557_add_artist_data_and_verification from './20261023_150557_add_artist_data_and_verification';
import * as migration_20261023_180000_add_hero_and_portrait_media from './20261023_180000_add_hero_and_portrait_media';

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
];
