
/**
 * Module dependencies.
 */

import { copyLabelsFromRepo, listLabels, updateLabels } from '';
import Client from 'client';
import faker from 'faker';

/**
 * Jest mocks.
 */

jest.mock('../src/client');

/**
 * Test `index`.
 */

describe('index', () => {
  let authenticate;
  let getLabels;
  let setLabels;

  beforeEach(() => {
    authenticate = jest.fn();
    setLabels = jest.fn();
    getLabels = jest.fn(() => [
      {
        color: 'foo',
        link: 'http://foobar',
        name: 'bar'
      },
      {
        color: 'waldo',
        link: 'http://waldo',
        name: 'fred'
      },
      {
        color: 'corge',
        link: 'http://corge',
        name: 'grault'
      }
    ]);

    Client.mockClear();
    Client.mockImplementation(() => ({
      authenticate,
      getLabels,
      setLabels
    }));
  });

  describe('copyLabelsFromRepo', () => {
    it('should call `client.setLabels` with the labels from the source repository', async () => {
      await copyLabelsFromRepo({
        sourceOwner: 'qux',
        sourceRepo: 'corge',
        targetOwner: 'fred',
        targetRepo: 'waldo',
        token: 'foobar'
      });

      const expectedLabels = [
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

      expect(Client.mock.instances.length).toEqual(2);
      expect(Client.mock.calls[0][0]).toEqual({ owner: 'qux', repo: 'corge' });
      expect(Client.mock.calls[1][0]).toEqual({ owner: 'fred', repo: 'waldo' });
      expect(getLabels).toHaveBeenCalledTimes(1);
      expect(setLabels).toHaveBeenCalledWith(expectedLabels);
    });
  });

  describe('listLabels', () => {
    it('should return the parsed result of the call `client.getLabels` with given options', async () => {
      const expectedLabels = [
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

      const result = await listLabels({
        owner: 'fred',
        repo: 'waldo',
        token: 'foobar'
      });

      expect(Client.mock.calls[0][0]).toEqual({ owner: 'fred', repo: 'waldo' });
      expect(authenticate).toHaveBeenCalledWith('foobar');
      expect(getLabels).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedLabels);
    });
  });

  describe('updateLabels', () => {
    it('should call `client.setLabels` with given labels', async () => {
      const labels = [
        {
          color: faker.commerce.color(),
          name: faker.lorem.word()
        },
        {
          color: faker.commerce.color(),
          name: faker.lorem.word()
        },
        {
          color: faker.commerce.color(),
          name: faker.lorem.word()
        }
      ];

      await updateLabels({
        labels,
        owner: 'fred',
        repo: 'waldo',
        token: 'foobar'
      });

      expect(Client.mock.calls[0][0]).toEqual({ owner: 'fred', repo: 'waldo' });
      expect(authenticate).toHaveBeenCalledWith('foobar');
      expect(setLabels).toHaveBeenCalledWith(labels);
    });
  });
});
