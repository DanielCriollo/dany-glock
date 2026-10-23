import * as migration_20261023_054057_initial_setup from './20261023_054057_initial_setup';
import * as migration_20261023_060207_add_contact_honeypot from './20261023_060207_add_contact_honeypot';

export const migrations = [
  {
    up: migration_20261023_054057_initial_setup.up,
    down: migration_20261023_054057_initial_setup.down,
    name: '20261023_054057_initial_setup',
  },
  {
    up: migration_20261023_060207_add_contact_honeypot.up,
    down: migration_20261023_060207_add_contact_honeypot.down,
    name: '20261023_060207_add_contact_honeypot'
  },
];
