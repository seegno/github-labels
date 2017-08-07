
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
    .option('sourceOwner', { demand: false, describe: 'Source repository owner', type: 'string' })
    .option('sourceRepo', { demand: false, describe: 'Source repository name', type: 'string' })
    .option('targetOwner', { demand: false, describe: 'Target repository owner', type: 'string' })
    .option('targetRepo', { demand: false, describe: 'Target repository name', type: 'string' })
    .option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' })
    .example('$0 --owner foo --repo bar --sourceOwner qux --sourceRepo corge --token foobar');
}

/**
 * Copy command.
 */

export async function copyFromRepo(args) {
  const questions = {
    sourceOwner: {
      message: 'What is the source owner name?',
      name: 'sourceOwner',
      validate: input => !!input
    },
    sourceRepo: {
      message: 'What is the source repository name?',
      name: 'sourceRepo',
      validate: input => !!input
    },
    targetOwner: {
      message: 'What is the target owner name?',
      name: 'targetOwner',
      validate: input => !!input
    },
    targetRepo: {
      message: 'What is the target repository name?',
      name: 'targetRepo',
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

  await copyLabelsFromRepo(options);

  return console.log('Copy completed!'); // eslint-disable-line no-console
}
