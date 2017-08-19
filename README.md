# GitHub Labels

[![Build Status](https://img.shields.io/travis/seegno/github-labels/master.svg?style=flat-square)](https://travis-ci.org/seegno/github-labels)
[![Coverage Status](https://img.shields.io/coveralls/seegno/github-labels/master.svg?style=flat-square)](https://coveralls.io/github/seegno/github-labels?branch=master)

A command line tool that helps you manage your GitHub repository issue labels.

## Installation

Using npm:

```sh
npm install --global ghlabels
```

Or Yarn:

```sh
yarn global add ghlabels
```

## Usage

### Basic usage

You can provide options as arguments or leave then blank and they will be asked.

```sh
ghlabels --owner foo --repo bar --token foobar --configFile ./path/somefile
```

Note: As an alternative you can provide options as enviroment variables (e.g. GITHUB_LABELS_TOKEN).

### Copy from another repo

```sh
ghlabels --sourceOwner seegno --sourceRepo github-labels --targetOwner foo --targetRepo bar --token foobar
```

### Client

You can also import ghlabels client and use it as a module:

```js
import { copyLabelsFromRepo, updateLabels } from 'ghlabels';

// Example of copying labels from a source repo.
copyLabelsFromRepo({
  owner: 'foo',
  repo: 'bar',
  token: 'foobar'
});

// Example of updating all labels from a repo.
updateLabels({
  sourceOwner: 'seegno',
  sourceRepo: 'github-labels',
  targetOwner: 'foo',
  targetRepo: 'bar',
  token: 'foobar'
});
```

## Contributing & Development

### Contributing

Found a bug or want to suggest something? Take a look first on the current and closed [issues](https://github.com/seegno/github-labels/issues). If it is something new, please [submit an issue](https://github.com/seegno/github-labels/issues/new).

### Develop

It will be awesome if you can help us evolve `github-labels`. Want to help?

1. [Fork it](https://github.com/seegno/github-labels).
2. `npm install`.
3. Hack away.
4. Run the tests: `npm test`.
5. Create a [Pull Request](https://github.com/seegno/github-labels/compare).

### Release

```sh
npm version [<newversion> | major | minor | patch] -m "Release %s"
```

## License

MIT
