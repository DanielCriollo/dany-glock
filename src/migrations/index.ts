import * as migration_20261023_054057_initial_setup from './20261023_054057_initial_setup';

export const migrations = [
  {
    up: migration_20261023_054057_initial_setup.up,
    down: migration_20261023_054057_initial_setup.down,
    name: '20261023_054057_initial_setup'
  },
];
