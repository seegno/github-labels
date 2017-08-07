#! /usr/bin/env node

/**
 * Module dependencies.
 */

import { copyFromRepo, copyFromRepoConfig } from 'commands/copy-from-repo-command';
import { update, updateConfig } from 'commands/update-command';
import { version } from '../../package.json';
import yargs from 'yargs';

/**
 * Program options.
 */

yargs // eslint-disable-line no-unused-expressions
  .usage('Usage: $0 [options]')
  .env('GITHUB_LABELS')
  .command(['*', 'update'], 'Update repository labels', updateConfig, update)
  .command('copy', 'Copy labels from repository', copyFromRepoConfig, copyFromRepo)
  .help('h')
  .alias('h', 'help')
  .version('version', 'Version', version)
  .alias('V', 'version')
  .wrap(null)
  .argv;
