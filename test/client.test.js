
/**
 * Module dependencies.
 */

import Client from 'client';
import Github from '@octokit/rest';
import HttpError from 'standard-http-error';

/**
 * Jest mocks.
 */

jest.mock('@octokit/rest');

/**
 * Test `Client`.
 */

describe('Client', () => {
  const defaultOptions = { token: 'foobiz' };
  const repository = 'corge/waldo';
  const repositoryOptions = { owner: 'corge', repo: 'waldo' };
  let authenticate;
  let client;
  let createLabel;
  let deleteLabel;
  let getLabel;
  let getLabels;
  let issues;
  let updateLabels;

  beforeEach(() => {
    authenticate = jest.fn();
    createLabel = jest.fn();
    deleteLabel = jest.fn();
    getLabel = jest.fn();
    getLabels = jest.fn();
    updateLabels = jest.fn();

    issues = {
      createLabel,
      deleteLabel,
      getLabel,
      getLabels,
      updateLabels
    };

    Github.mockImplementation(() => ({ authenticate, issues }));

    client = new Client(defaultOptions);
  });

  describe('constructor', () => {
    it('should create an instance of `client` with given arguments', () => {
      expect(client.github).toEqual({ authenticate, issues });
    });

    it('should call `github.authenticate` with given token and type as `oauth`', () => {
      expect(client.github.authenticate).toHaveBeenCalledTimes(1);
      expect(client.github.authenticate).toHaveBeenCalledWith({ token: 'foobiz', type: 'oauth' });
    });
  });

  describe('createLabel', () => {
    it('should throw an error with `Malformed repository option` message if given `repository` have an invalid format', async () => {
      try {
        await client.createLabel('foobar');

        fail();
      } catch (e) {
        expect(e.message).toBe('Malformed repository option');
      }
    });

    it('should call `github.issues.createLabel` with repository options and given `name` and `color`', () => {
      client.github.issues.createLabel = jest.fn(() => true);
      client.createLabel(repository, 'foo', 'bar');

      expect(client.github.issues.createLabel).toHaveBeenCalledTimes(1);
      expect(client.github.issues.createLabel).toHaveBeenCalledWith({ ...repositoryOptions, color: 'bar', name: 'foo' });
    });
  });

  describe('createOrUpdateLabel', () => {
    it('should throw if `getLabel` throws an error without code', async () => {
      client.getLabel = jest.fn(() => { throw new Error('foobar'); });

      try {
        await client.createOrUpdateLabel(repository);

        fail();
      } catch (e) {
        expect(e.message).toBe('foobar');
      }
    });

    it('should throw if `getLabel` throws an error with code different than 404', async () => {
      client.getLabel = jest.fn(() => { throw new HttpError(100); });

      try {
        await client.createOrUpdateLabel(repository);

        fail();
      } catch (e) {
        expect(e.code).toBe(100);
      }
    });

    it('should call `createLabel` with given `repository`, `name` and `color` if `getLabel` throws an error with code 404', async () => {
      client.getLabel = jest.fn(() => { throw new HttpError(404); });
      client.updateLabel = jest.fn();
      client.createLabel = jest.fn(() => Promise.resolve('foobiz'));

      const response = await client.createOrUpdateLabel(repository, 'foo', 'bar');

      expect(response).toBe('foobiz');
      expect(client.updateLabel).toHaveBeenCalledTimes(0);
      expect(client.createLabel).toHaveBeenCalledTimes(1);
      expect(client.createLabel).toHaveBeenCalledWith(repository, 'foo', 'bar');
    });

    it('should call `updateLabel` with given `repository`, `name` and `color` if `getLabel` returns a label', async () => {
      client.getLabel = jest.fn(() => true);
      client.createLabel = jest.fn();
      client.updateLabel = jest.fn(() => Promise.resolve('foobiz'));

      const response = await client.createOrUpdateLabel(repository, 'foo', 'bar');

      expect(response).toBe('foobiz');
      expect(client.createLabel).toHaveBeenCalledTimes(0);
      expect(client.updateLabel).toHaveBeenCalledTimes(1);
      expect(client.updateLabel).toHaveBeenCalledWith(repository, 'foo', 'bar');
    });

    it('should call `createLabel` with given `repository`, `name` and `color` if `getLabel` does not returns a label', async () => {
      client.getLabel = jest.fn(() => false);
      client.updateLabel = jest.fn();
      client.createLabel = jest.fn(() => Promise.resolve('foobiz'));

      const response = await client.createOrUpdateLabel(repository, 'foo', 'bar');

      expect(response).toBe('foobiz');
      expect(client.updateLabel).toHaveBeenCalledTimes(0);
      expect(client.createLabel).toHaveBeenCalledTimes(1);
      expect(client.createLabel).toHaveBeenCalledWith(repository, 'foo', 'bar');
    });
  });

  describe('deleteLabel', () => {
    it('should throw an error with `Malformed repository option` message if given `repository` have an invalid format', async () => {
      try {
        await client.deleteLabel('foobar');

        fail();
      } catch (e) {
        expect(e.message).toBe('Malformed repository option');
      }
    });

    it('should call `github.issues.deleteLabel` with repository options and given `name` and `color`', () => {
      client.github.issues.deleteLabel = jest.fn(() => true);
      client.deleteLabel(repository, 'foobar');

      expect(client.github.issues.deleteLabel).toHaveBeenCalledTimes(1);
      expect(client.github.issues.deleteLabel).toHaveBeenCalledWith({ ...repositoryOptions, name: 'foobar' });
    });
  });

  describe('getLabels', () => {
    it('should throw an error with `Malformed repository option` message if given `repository` have an invalid format', async () => {
      try {
        await client.getLabels('foobar');

        fail();
      } catch (e) {
        expect(e.message).toBe('Malformed repository option');
      }
    });

    it('should call `github.issues.getLabels` with repository options', () => {
      client.github.issues.getLabels = jest.fn(() => true);
      client.getLabels(repository, 'foobar');

      expect(client.github.issues.getLabels).toHaveBeenCalledTimes(1);
      expect(client.github.issues.getLabels).toHaveBeenCalledWith({ ...repositoryOptions });
    });

    it('should return the data property from the result of the call `github.issues.getLabels`', () => {
      client.github.issues.getLabels = jest.fn(() => Promise.resolve({ data: 'foobar' }));

      return client.getLabels(repository).then(label => {
        expect(label).toBe('foobar');
      });
    });
  });

  describe('getLabel', () => {
    it('should throw an error with `Malformed repository option` message if given `repository` have an invalid format', async () => {
      try {
        await client.getLabel('foobar');

        fail();
      } catch (e) {
        expect(e.message).toBe('Malformed repository option');
      }
    });

    it('should call `github.issues.getLabel` with repository options and given `name` and `color`', () => {
      client.github.issues.getLabel = jest.fn(() => true);
      client.getLabel(repository, 'foobar');

      expect(client.github.issues.getLabel).toHaveBeenCalledTimes(1);
      expect(client.github.issues.getLabel).toHaveBeenCalledWith({ ...repositoryOptions, name: 'foobar' });
    });
  });

  describe('updateLabel', () => {
    it('should throw an error with `Malformed repository option` message if given `repository` have an invalid format', async () => {
      try {
        await client.getLabel('foobar');

        fail();
      } catch (e) {
        expect(e.message).toBe('Malformed repository option');
      }
    });

    it('should call `github.issues.updateLabel` with repository options and given `name` and `color`', () => {
      client.github.issues.updateLabel = jest.fn(() => true);
      client.updateLabel(repository, 'foo', 'bar');

      expect(client.github.issues.updateLabel).toHaveBeenCalledTimes(1);
      expect(client.github.issues.updateLabel).toHaveBeenCalledWith({
        ...repositoryOptions,
        color: 'bar',
        current_name: 'foo', // eslint-disable-line id-match
        name: 'foo'
      });
    });
  });

  describe('setLabels', () => {
    const labels = [
      {
        color: 'foo',
        name: 'bar'
      },
      {
        color: 'waldo',
        name: 'fred'
      },
      {
        color: 'corge',
        name: 'grault'
      }
    ];

    const currentLabels = [
      {
        color: 'foo',
        name: 'bar'
      },
      {
        color: 'qux',
        name: 'quux'
      }
    ];

    it('should call `deleteLabel` with a deprecated label name', async () => {
      client.deleteLabel = jest.fn(() => true);
      client.createOrUpdateLabel = jest.fn(() => true);
      client.getLabels = jest.fn(() => currentLabels);

      await client.setLabels(repository, labels);

      expect(client.deleteLabel).toHaveBeenCalledTimes(1);
      expect(client.deleteLabel).toHaveBeenCalledWith(repository, 'quux');
    });

    it('should call `createOrUpdateLabel` for all labels', async () => {
      client.deleteLabel = jest.fn(() => true);
      client.createOrUpdateLabel = jest.fn(() => true);
      client.getLabels = jest.fn(() => currentLabels);

      await client.setLabels(repository, labels);

      expect(client.createOrUpdateLabel).toHaveBeenCalledTimes(labels.length);

      labels.forEach(({ color, name }) => {
        expect(client.createOrUpdateLabel).toHaveBeenCalledWith(repository, name, color);
      });
    });
  });
});
