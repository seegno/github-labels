
/**
 * Module dependencies.
 */

import { keys, omit, pick, pickBy, values } from 'lodash';
import { listLabels } from '';
import inquirer from 'inquirer';
import prettyjson from 'prettyjson';

/**
 * Export `listConfig`.
 */

export function listConfig(yargs) {
  yargs
    .option('repository', { demand: false, describe: 'Repository name (ex. seegno/github-labels)', type: 'string' })
    .option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' })
    .example('$0 --repository foo/bar --token bar --configFile ./path/somefile');
}

/**
 * List command.
 */

export async function list(args) {
  const questions = {
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

  console.log('Listing labels...'); // eslint-disable-line no-console
  console.log(prettyjson.render(pick(options, keys(pickBy(questions))))); // eslint-disable-line no-console

  try {
    const labels = await listLabels({ ...options });

    console.log('Labels:'); // eslint-disable-line no-console
    console.log(prettyjson.render(labels)); // eslint-disable-line no-console

    console.log('Listing completed!'); // eslint-disable-line no-console
  } catch (e) {
    console.error(e.message); // eslint-disable-line no-console
  }
}
