#! /usr/bin/env node
'use strict';

var _copyFromRepoCommand = require('../commands/copy-from-repo-command');

var _updateCommand = require('../commands/update-command');

var _package = require('../../package.json');

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Program options.
 */

/**
 * Module dependencies.
 */

_yargs2.default // eslint-disable-line no-unused-expressions
.usage('Usage: $0 [options]').env('GITHUB_LABELS').command(['*', 'update'], 'Update repository labels', _updateCommand.updateConfig, _updateCommand.update).command('copy', 'Copy labels from repository', _copyFromRepoCommand.copyFromRepoConfig, _copyFromRepoCommand.copyFromRepo).help('h').alias('h', 'help').version('version', 'Version', _package.version).alias('V', 'version').wrap(null).argv;