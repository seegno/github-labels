
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
  let getLabels;
  let setLabels;

  beforeEach(() => {
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
      getLabels,
      setLabels
    }));
  });

  describe('copyLabelsFromRepo', () => {
    it('should call `client.setLabels` with the labels from the source repository', async () => {
      await copyLabelsFromRepo({
        source: 'corge',
        target: 'waldo',
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

      expect(Client.mock.instances.length).toEqual(1);
      expect(Client.mock.calls[0][0]).toEqual({ token: 'foobar' });
      expect(getLabels).toHaveBeenCalledTimes(1);
      expect(getLabels).toHaveBeenCalledWith('corge');
      expect(setLabels).toHaveBeenCalledTimes(1);
      expect(setLabels).toHaveBeenCalledWith('waldo', expectedLabels);
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
        repository: 'waldo',
        token: 'foobar'
      });

      expect(Client.mock.instances.length).toEqual(1);
      expect(Client.mock.calls[0][0]).toEqual({ token: 'foobar' });
      expect(getLabels).toHaveBeenCalledTimes(1);
      expect(getLabels).toHaveBeenCalledWith('waldo');
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
        repository: 'waldo',
        token: 'foobar'
      });

      expect(Client.mock.instances.length).toEqual(1);
      expect(Client.mock.calls[0][0]).toEqual({ token: 'foobar' });
      expect(setLabels).toHaveBeenCalledTimes(1);
      expect(setLabels).toHaveBeenCalledWith('waldo', labels);
    });
  });
});
