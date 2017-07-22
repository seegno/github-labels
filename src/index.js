
/**
 * Module dependencies.
 */

import Client from './client';

/**
 * Export application.
 */

export default async options => {
  const { owner, repo, token, labels } = options;

  // Instantiate client.
  const client = new Client({ owner, repo });

  // Authenticate user.
  client.authenticate(token);

  // Update the repository labels using the labels in the configuration file.
  await client.updateLabels(labels);
};
