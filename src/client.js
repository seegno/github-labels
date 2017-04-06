
/**
 * Module dependencies.
 */

import { differenceBy, get } from 'lodash';
import Github from 'github';
import Promise from 'bluebird';
import config from 'config';

/**
 * Export `Client`.
 */

export default class Client {

  /**
   * Constructor.
   */

  constructor({ user, repository }) {
    this.github = new Github(config.get('github'));
    this.repository = repository;
    this.user = user;

    Promise.promisifyAll(this.github.issues);
    Promise.promisifyAll(this.github);
  }

  /**
   * Authenticate.
   */

  authenticate(token) {
    return this.github.authenticateAsync({ token, type: 'oauth' });
  }

  /**
   * Create a new label with given `name` and `color`.
   */

  createLabel(name, color) {
    return this.github.issues.createLabelAsync({
      color,
      name,
      repo: this.repository,
      user: this.user
    });
  }

  /**
   * Create or update a label with given `name`.
   */

  async createOrUpdateLabel(name, color) {
    try {
      const label = await this.getLabel(name);

      if (label) {
        return await this.updateLabel(name, color);
      }
    } catch (err) {
      if (!(err instanceof Error) && get(err, 'code') !== 404) {
        throw err;
      }
    }

    return await this.createLabel(name, color);
  }

  /**
   * Delete label by given `name`.
   */

  deleteLabel(name) {
    return this.github.issues.deleteLabelAsync({
      name,
      repo: this.repository,
      user: this.user
    });
  }

  /**
   * Get all repository labels.
   */

  getLabels() {
    return this.github.issues.getLabelsAsync({
      repo: this.repository,
      user: this.user
    });
  }

  /**
   * Get label by given `name`.
   */

  getLabel(name) {
    return this.github.issues.getLabelAsync({
      name,
      repo: this.repository,
      user: this.user
    });
  }

  /**
   * Update an existing label with given `color`.
   */

  updateLabel(name, color) {
    return this.github.issues.updateLabelAsync({
      color,
      name,
      repo: this.repository,
      user: this.user
    });
  }

  /**
   * Update labels.
   */

  async updateLabels(labels) {
    const current = await this.getLabels();

    // Delete current labels that are not included in the wanted labels.
    const deprecated = differenceBy(current, labels, 'name');

    for (const { name } of deprecated) {
      await this.deleteLabel(name);
    }

    // Create or update wanted labels.
    for (const { color, name } of labels) {
      await this.createOrUpdateLabel(name, color);
    }

    return labels;
  }
}
