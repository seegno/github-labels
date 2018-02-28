
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
    .option('file', { demand: false, describe: 'Configuration file', type: 'string' })
    .option('repository', { demand: false, describe: 'Repository name (ex. seegno/github-labels)', type: 'string' })
    .option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' })
    .example('$0 --repository foo/bar --token foobar --file ./path/somefile');
}

/**
 * Update command.
 */

export async function update(args) {
  const questions = {
    file: {
      message: 'What is the configuration file path?',
      name: 'file',
      validate: input => !!input
    },
    repository: {
      message: 'What is the repository name? (ex. seegno/github-labels)',
      name: 'repository',
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

  try {
    // Retrieve labels from file.
    const content = await readFileAsync(get(options, 'file'), 'utf8');
    const labels = JSON.parse(content);

    await updateLabels({ ...options, labels });

    console.log('Update completed!'); // eslint-disable-line no-console
  } catch (e) {
    console.log(e.message); // eslint-disable-line no-console
  }
}
