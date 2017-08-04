
/**
 * Module dependencies.
 */

import Client from 'client';

/**
 * Export `updateLabels`.
 */

export async function updateLabels(options) {
  const { owner, repo, token, labels } = options;

  // Instantiate client.
  const client = new Client({ owner, repo });

  // Authenticate user.
  client.authenticate(token);

  // Set the repository labels using the labels in the configuration file.
  await client.setLabels(labels);
}

/**
 * Export `copyLabelsFromRepo`.
 */

export async function copyLabelsFromRepo(options) {
  const { sourceOwner, sourceRepo, targetOwner, targetRepo, token } = options;

  // Instantiate clients.
  const clientSource = new Client({ owner: sourceOwner, repo: sourceRepo });
  const clientTarget = new Client({ owner: targetOwner, repo: targetRepo });

  // Authenticate user.
  clientSource.authenticate(token);
  clientTarget.authenticate(token);

  // Get source labels.
  const rawLabels = await clientSource.getLabels();

  // Parsed labels.
  const labels = rawLabels.map(({ color, name }) => ({ color, name }));

  // Set the repository labels using the labels in the source repository.
  await clientTarget.setLabels(labels);
}
