#! /usr/bin/env node

/**
 * Module dependencies.
 */

import { readFile } from 'fs';
import { version } from '../package.json';
import Client from './client';
import Promise from 'bluebird';
import prettyjson from 'prettyjson';
import yargs from 'yargs';

/**
 * Promisify fs readFile method.
 */

const readFileAsync = Promise.promisify(readFile);

/**
 * Program options.
 */

const args = yargs
  .usage('Usage: $0 [options]')
  .env('GITHUB_LABELS')
  .option('owner', { demand: true, describe: 'Repository owner', type: 'string' })
  .option('repository', { demand: true, describe: 'Repository name', type: 'string' })
  .option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' })
  .option('configFile', { demand: true, describe: 'Configuration file', type: 'string' })
  .help('h')
  .alias('h', 'help')
  .version('version', 'Version', version)
  .alias('V', 'version')
  .example('$0 --owner foo --repository bar --token foobar --configFile ./path/somefile')
  .wrap(null)
  .argv;

/**
 * Program.
 */

(async function() {
  const { configFile, owner, repository, token } = args;

  // Instantiate client.
  const client = new Client({
    repository,
    user: owner
  });

  // Authenticate user with given `token` in the program options.
  client.authenticate(token);

  // Retrieve labels from file.
  const content = await readFileAsync(configFile, 'utf8');
  const labels = JSON.parse(content);

  // Update the repository labels using the labels in the configuration file.
  await client.updateLabels(labels);

  return console.log(prettyjson.render(labels)); // eslint-disable-line no-console
})();
