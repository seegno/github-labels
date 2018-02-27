
/**
 * Module dependencies.
 */

import Client from 'client';

/**
 * Export `listLabels`.
 */

export async function listLabels(options) {
  const { repository, token } = options;

  // Instantiate client.
  const client = new Client({ token });

  // Get source labels.
  const labels = await client.getLabels(repository);

  // Parsed labels.
  return labels.map(({ color, name }) => ({ color, name }));
}

/**
 * Export `updateLabels`.
 */

export async function updateLabels(options) {
  const { repository, token, labels } = options;

  // Instantiate client.
  const client = new Client({ token });

  // Set the repository labels using the labels in the configuration file.
  await client.setLabels(repository, labels);
}

/**
 * Export `copyLabelsFromRepo`.
 */

export async function copyLabelsFromRepo(options) {
  const { source, target, token } = options;

  // Instantiate clients.
  const client = new Client({ token });

  // Get source labels.
  const rawLabels = await client.getLabels(source);

  // Parsed labels.
  const labels = rawLabels.map(({ color, name }) => ({ color, name }));

  // Set the repository labels using the labels in the source repository.
  await client.setLabels(target, labels);
}
