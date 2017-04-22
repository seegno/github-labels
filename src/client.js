
/**
 * Module dependencies.
 */

import { differenceBy, get, has } from 'lodash';
import Github from 'github';
import Promise from 'bluebird';

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
 * Export `Client`.
 */

export default class Client {

  /**
   * Constructor.
   */

  constructor({ owner, repo, options }) {
    this.github = new Github({ ...config, ...options });
    this.owner = owner;
    this.repo = repo;

    Promise.promisifyAll(this.github.issues);
    Promise.promisifyAll(this.github);
  }

  /**
   * Authenticate.
   */

  authenticate(token) {
    this.github.authenticate({ token, type: 'oauth' });
  }

  /**
   * Create a new label with given `name` and `color`.
   */

  async createLabel(name, color) {
    return await this.github.issues.createLabelAsync({
      color,
      name,
      owner: this.owner,
      repo: this.repo
    });
  }

  /**
   * Create or update a label with given `name`.
   */

  async createOrUpdateLabel(name, color) {
    let label = false;

    try {
      label = await this.getLabel(name);
    } catch (err) {
      if (!has(err, 'code') || get(err, 'code') !== 404) {
        throw err;
      }
    }

    if (label) {
      return await this.updateLabel(name, color);
    }

    return await this.createLabel(name, color);
  }

  /**
   * Delete label by given `name`.
   */

  async deleteLabel(name) {
    return await this.github.issues.deleteLabelAsync({
      name,
      owner: this.owner,
      repo: this.repo
    });
  }

  /**
   * Get all repo labels.
   */

  async getLabels() {
    const result = await this.github.issues.getLabelsAsync({
      owner: this.owner,
      repo: this.repo
    });

    return result.data;
  }

  /**
   * Get label by given `name`.
   */

  async getLabel(name) {
    return await this.github.issues.getLabelAsync({
      name,
      owner: this.owner,
      repo: this.repo
    });
  }

  /**
   * Update an existing label with given `color`.
   */

  async updateLabel(name, color) {
    return await this.github.issues.updateLabelAsync({
      color,
      name,
      oldname: name,
      owner: this.owner,
      repo: this.repo
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
  }
}
