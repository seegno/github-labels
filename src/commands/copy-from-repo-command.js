
/**
 * Module dependencies.
 */

import { copyLabelsFromRepo } from '';
import { keys, omit, pick, pickBy, values } from 'lodash';
import inquirer from 'inquirer';
import prettyjson from 'prettyjson';

/**
 * Export `copyFromRepoConfig`.
 */

export function copyFromRepoConfig(yargs) {
  yargs
    .option('source', { demand: false, describe: 'Source repository name (ex. seegno/github-labels)', type: 'string' })
    .option('target', { demand: false, describe: 'Target repository name (ex. seegno/github-labels)', type: 'string' })
    .option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' })
    .example('$0 --owner foo --repo bar --sourceOwner qux --sourceRepo corge --token foobar');
}

/**
 * Copy command.
 */

export async function copyFromRepo(args) {
  const questions = {
    source: {
      message: 'What is the source repository name? (ex. seegno/github-labels)',
      name: 'source',
      validate: input => !!input
    },
    target: {
      message: 'What is the target repository name? (ex. seegno/github-labels)',
      name: 'target',
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

  console.log('Copying labels from repo...'); // eslint-disable-line no-console
  console.log(prettyjson.render(pick(options, keys(pickBy(questions))))); // eslint-disable-line no-console

  try {
    await copyLabelsFromRepo(options);

    console.log('Copy completed!'); // eslint-disable-line no-console
  } catch (e) {
    console.error(e.message); // eslint-disable-line no-console
  }
}
