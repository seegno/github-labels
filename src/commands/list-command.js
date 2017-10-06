
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
    .option('owner', { demand: false, describe: 'Repository owner', type: 'string' })
    .option('repo', { demand: false, describe: 'Repository name', type: 'string' })
    .option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' })
    .example('$0 --repo foo --token bar --configFile ./path/somefile');
}

/**
 * List command.
 */

export async function list(args) {
  const questions = {
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
