
/**
 * Module dependencies.
 */

import { differenceBy, get, has } from 'lodash';
import Github from 'github';

/**
 * GitHub configuration.
 */

const config = {
  debug: false,
  host: 'api.github.com',
  protocol: 'https',
  timeout: 5000,
  version: '3.0.0'
};

/**
 * Get repository owner and name and include a validation.
 */

const getRepositoryOptions = repository => {
  const [owner, repo] = repository.split('/');

  if (!owner || !repo) {
    throw new Error('Malformed repository option');
  }

  return { owner, repo };
};

/**
 * Export `Client`.
 */

export default class Client {

  /**
   * Constructor.
   */

  constructor({ token, ...options }) {
    this.github = new Github({ ...config, ...options });

    this.github.authenticate({ token, type: 'oauth' });
  }

  /**
   * Create a new label with given `name` and `color`.
   */

  async createLabel({
    color,
    description,
    name,
    repository
  }) {
    const { owner, repo } = getRepositoryOptions(repository);

    return await this.github.issues.createLabel({
      color,
      description,
      name,
      owner,
      repo
    });
  }

  /**
   * Create or update a label with given `name`.
   */

  async createOrUpdateLabel({
    color,
    description,
    name,
    repository
  }) {
    let method = this.createLabel;
    let label = false;

    try {
      label = await this.getLabel(repository, name);
    } catch (err) {
      if (!has(err, 'code') || get(err, 'code') !== 404) {
        throw err;
      }
    }

    if (label) {
      method = this.updateLabel;
    }

    return await method({
      color,
      description,
      name,
      repository
    });
  }

  /**
   * Delete label by given `name`.
   */

  async deleteLabel(repository, name) {
    const { owner, repo } = getRepositoryOptions(repository);

    return await this.github.issues.deleteLabel({
      name,
      owner,
      repo
    });
  }

  /**
   * Get all repo labels.
   */

  async getLabels(repository) {
    const { owner, repo } = getRepositoryOptions(repository);

    const result = await this.github.issues.getLabels({
      owner,
      repo
    });

    return result.data;
  }

  /**
   * Get label by given `name`.
   */

  async getLabel(repository, name) {
    const { owner, repo } = getRepositoryOptions(repository);

    return await this.github.issues.getLabel({
      name,
      owner,
      repo
    });
  }

  /**
   * Update an existing label with given `color`.
   */

  async updateLabel({
    color,
    description,
    name,
    repository
  }) {
    const { owner, repo } = getRepositoryOptions(repository);

    return await this.github.issues.updateLabel({
      color,
      description,
      name,
      oldname: name,
      owner,
      repo
    });
  }

  /**
   * Set labels.
   */

  async setLabels(repository, labels) {
    const current = await this.getLabels(repository);

    // Delete current labels that are not included in the wanted labels.
    const deprecated = differenceBy(current, labels, 'name');

    for (const { name } of deprecated) {
      await this.deleteLabel(repository, name);
    }

    // Create or update wanted labels.
    for (const { color, description, name } of labels) {
      await this.createOrUpdateLabel({
        color,
        description,
        name,
        repository
      });
    }
  }
}
