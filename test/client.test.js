
/**
 * Module dependencies.
 */

import Client from '../src/client';
import Github from 'github';
import HttpError from 'standard-http-error';

/**
 * Test `Client`.
 */

describe('Client', () => {
  const defaultOptions = { owner: 'fred', repo: 'waldo' };
  let client;

  beforeEach(() => {
    client = new Client(defaultOptions);
  });

  describe('constructor', () => {
    it('should create an instance of `client` with given arguments', () => {
      expect(client.owner).toBe('fred');
      expect(client.repo).toBe('waldo');
      expect(client.github).toBeInstanceOf(Github);
    });
  });

  describe('authenticate', () => {
    it('should call `github.authenticate` with given token and type as `oauth`', () => {
      client.github.authenticate = jest.fn(() => true);
      client.authenticate('foobiz');

      expect(client.github.authenticate).toHaveBeenCalledTimes(1);
      expect(client.github.authenticate).toHaveBeenCalledWith({ token: 'foobiz', type: 'oauth' });
    });
  });

  describe('createLabel', () => {
    it('should call `github.issues.createLabelAsync` with default options and given `name` and `color`', () => {
      client.github.issues.createLabelAsync = jest.fn(() => true);
      client.createLabel('foo', 'bar');

      expect(client.github.issues.createLabelAsync).toHaveBeenCalledTimes(1);
      expect(client.github.issues.createLabelAsync).toHaveBeenCalledWith({ ...defaultOptions, color: 'bar', name: 'foo' });
    });
  });

  describe('createOrUpdateLabel', () => {
    it('should throw if `getLabel` throws an error without code', async () => {
      client.getLabel = jest.fn(() => { throw new Error('foobar'); });

      try {
        await client.createOrUpdateLabel();

        fail();
      } catch (e) {
        expect(e.message).toBe('foobar');
      }
    });

    it('should throw if `getLabel` throws an error with code different than 404', async () => {
      client.getLabel = jest.fn(() => { throw new HttpError(100); });

      try {
        await client.createOrUpdateLabel();

        fail();
      } catch (e) {
        expect(e.code).toBe(100);
      }
    });

    it('should call `createLabel` with given `name` and `color` if `getLabel` throws an error with code 404', async () => {
      client.getLabel = jest.fn(() => { throw new HttpError(404); });
      client.updateLabel = jest.fn();
      client.createLabel = jest.fn(() => Promise.resolve('foobiz'));

      const response = await client.createOrUpdateLabel('foo', 'bar');

      expect(response).toBe('foobiz');
      expect(client.updateLabel).toHaveBeenCalledTimes(0);
      expect(client.createLabel).toHaveBeenCalledTimes(1);
      expect(client.createLabel).toHaveBeenCalledWith('foo', 'bar');
    });

    it('should call `updateLabel` with given `name` and `color` if `getLabel` returns a label', async () => {
      client.getLabel = jest.fn(() => true);
      client.createLabel = jest.fn();
      client.updateLabel = jest.fn(() => Promise.resolve('foobiz'));

      const response = await client.createOrUpdateLabel('foo', 'bar');

      expect(response).toBe('foobiz');
      expect(client.createLabel).toHaveBeenCalledTimes(0);
      expect(client.updateLabel).toHaveBeenCalledTimes(1);
      expect(client.updateLabel).toHaveBeenCalledWith('foo', 'bar');
    });

    it('should call `createLabel` with given `name` and `color` if `getLabel` does not returns a label', async () => {
      client.getLabel = jest.fn(() => false);
      client.updateLabel = jest.fn();
      client.createLabel = jest.fn(() => Promise.resolve('foobiz'));

      const response = await client.createOrUpdateLabel('foo', 'bar');

      expect(response).toBe('foobiz');
      expect(client.updateLabel).toHaveBeenCalledTimes(0);
      expect(client.createLabel).toHaveBeenCalledTimes(1);
      expect(client.createLabel).toHaveBeenCalledWith('foo', 'bar');
    });
  });

  describe('deleteLabel', () => {
    it('should call `github.issues.deleteLabelAsync` with default options and given `name` and `color`', () => {
      client.github.issues.deleteLabelAsync = jest.fn(() => true);
      client.deleteLabel('foobar');

      expect(client.github.issues.deleteLabelAsync).toHaveBeenCalledTimes(1);
      expect(client.github.issues.deleteLabelAsync).toHaveBeenCalledWith({ ...defaultOptions, name: 'foobar' });
    });
  });

  describe('getLabels', () => {
    it('should call `github.issues.getLabelsAsync` with default options', () => {
      client.github.issues.getLabelsAsync = jest.fn(() => true);
      client.getLabels('foobar');

      expect(client.github.issues.getLabelsAsync).toHaveBeenCalledTimes(1);
      expect(client.github.issues.getLabelsAsync).toHaveBeenCalledWith({ ...defaultOptions });
    });

    it('should return the data property from the result of the call `github.issues.getLabelsAsync`', () => {
      client.github.issues.getLabelsAsync = jest.fn(() => Promise.resolve({ data: 'foobar' }));

      return client.getLabels().then(label => {
        expect(label).toBe('foobar');
      });
    });
  });

  describe('getLabel', () => {
    it('should call `github.issues.getLabelAsync` with default options and given `name` and `color`', () => {
      client.github.issues.getLabelAsync = jest.fn(() => true);
      client.getLabel('foobar');

      expect(client.github.issues.getLabelAsync).toHaveBeenCalledTimes(1);
      expect(client.github.issues.getLabelAsync).toHaveBeenCalledWith({ ...defaultOptions, name: 'foobar' });
    });
  });

  describe('updateLabel', () => {
    it('should call `github.issues.updateLabelAsync` with default options and given `name` and `color`', () => {
      client.github.issues.updateLabelAsync = jest.fn(() => true);
      client.updateLabel('foo', 'bar');

      expect(client.github.issues.updateLabelAsync).toHaveBeenCalledTimes(1);
      expect(client.github.issues.updateLabelAsync).toHaveBeenCalledWith({ ...defaultOptions, color: 'bar', name: 'foo', oldname: 'foo' });
    });
  });

  describe('updateLabels', () => {
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

      await client.updateLabels(labels);

      expect(client.deleteLabel).toHaveBeenCalledTimes(1);
      expect(client.deleteLabel).toHaveBeenCalledWith('quux');
    });

    it('should call `createOrUpdateLabel` for all labels', async () => {
      client.deleteLabel = jest.fn(() => true);
      client.createOrUpdateLabel = jest.fn(() => true);
      client.getLabels = jest.fn(() => currentLabels);

      await client.updateLabels(labels);

      expect(client.createOrUpdateLabel).toHaveBeenCalledTimes(labels.length);

      labels.forEach(({ color, name }) => {
        expect(client.createOrUpdateLabel).toHaveBeenCalledWith(name, color);
      });
    });
  });
});
