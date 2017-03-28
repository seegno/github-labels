#! /usr/bin/env node

/**
 * Module dependencies.
 */

import { keys, omit, pickBy, values } from 'lodash';
import { readFile } from 'fs';
import { version } from '../package.json';
import Client from './client';
import Promise from 'bluebird';
import inquirer from 'inquirer';
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
  .option('owner', { demand: false, describe: 'Repository owner', type: 'string' })
  .option('repository', { demand: false, describe: 'Repository name', type: 'string' })
  .option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' })
  .option('configFile', { demand: false, describe: 'Configuration file', type: 'string' })
  .help('h')
  .alias('h', 'help')
  .version('version', 'Version', version)
  .alias('V', 'version')
  .example('$0 --owner foo --repository bar --token foobar --configFile ./path/somefile')
  .wrap(null)
  .argv;

/**
 * Program questions.
 */

const questions = {
  configFile: {
    message: 'What is the configuration file path?',
    name: 'configFile',
    validate: input => !!input
  },
  owner: {
    message: 'What is the owner name?',
    name: 'owner',
    validate: input => !!input
  },
  repository: {
    message: 'What is the repository name?',
    name: 'repository',
    validate: input => !!input
  }
};

/**
 * Program.
 */

(async function() {
  const answers = await inquirer.prompt(values(omit(questions, keys(pickBy(args)))));
  const { configFile, owner, repository, token } = { ...args, ...answers };

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
