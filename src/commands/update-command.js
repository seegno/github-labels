
/**
 * Module dependencies.
 */

import { get, keys, omit, pick, pickBy, values } from 'lodash';
import { readFile } from 'fs';
import { updateLabels } from '';
import Promise from 'bluebird';
import inquirer from 'inquirer';
import prettyjson from 'prettyjson';

/**
 * Promisify fs readFile method.
 */

const readFileAsync = Promise.promisify(readFile);

/**
 * Export `updateConfig`.
 */

export function updateConfig(yargs) {
  yargs
    .option('configFile', { demand: false, describe: 'Configuration file', type: 'string' })
    .option('owner', { demand: false, describe: 'Repository owner', type: 'string' })
    .option('repo', { demand: false, describe: 'Repository name', type: 'string' })
    .option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' })
    .example('$0 --owner foo --repo bar --token foobar --configFile ./path/somefile');
}

/**
 * Update command.
 */

export async function update(args) {
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
    repo: {
      message: 'What is the repository name?',
      name: 'repo',
      validate: input => !!input
    },
    token: {
      message: 'Provide a GitHub access token',
      name: 'token',
      validate: input => !!input
    }
  };

  const answers = await inquirer.prompt(values(omit(questions, keys(pickBy(args)))));
  const options = { ...args, ...answers };

  console.log('Updating labels...'); // eslint-disable-line no-console
  console.log(prettyjson.render(pick(options, keys(pickBy(questions))))); // eslint-disable-line no-console

  // Retrieve labels from file.
  const content = await readFileAsync(get(options, 'configFile'), 'utf8');
  const labels = JSON.parse(content);

  await updateLabels({ ...options, labels });

  return console.log('Update completed!'); // eslint-disable-line no-console
}
