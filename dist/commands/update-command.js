'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Update command.
 */

let update = exports.update = (() => {
  var _ref = _asyncToGenerator(function* (args) {
    const questions = {
      file: {
        message: 'What is the configuration file path?',
        name: 'file',
        validate: function (input) {
          return !!input;
        }
      },
      repository: {
        message: 'What is the repository name? (ex. seegno/github-labels)',
        name: 'repository',
        validate: function (input) {
          return !!input;
        }
      },
      token: {
        message: 'Provide a GitHub access token',
        name: 'token',
        validate: function (input) {
          return !!input;
        }
      }
    };

    const answers = yield _inquirer2.default.prompt((0, _lodash.values)((0, _lodash.omit)(questions, (0, _lodash.keys)((0, _lodash.pickBy)(args)))));
    const options = _extends({}, args, answers);

    console.log('Updating labels...'); // eslint-disable-line no-console
    console.log(_prettyjson2.default.render((0, _lodash.pick)(options, (0, _lodash.keys)((0, _lodash.pickBy)(questions))))); // eslint-disable-line no-console

    try {
      // Retrieve labels from file.
      const content = yield readFileAsync((0, _lodash.get)(options, 'file'), 'utf8');
      const labels = JSON.parse(content);

      yield (0, _.updateLabels)(_extends({}, options, { labels }));

      console.log('Update completed!'); // eslint-disable-line no-console
    } catch (e) {
      console.log(e.message); // eslint-disable-line no-console
    }
  });

  return function update(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.updateConfig = updateConfig;

var _lodash = require('lodash');

var _fs = require('fs');

var _ = require('..');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _prettyjson = require('prettyjson');

var _prettyjson2 = _interopRequireDefault(_prettyjson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/**
 * Module dependencies.
 */

/**
 * Promisify fs readFile method.
 */

const readFileAsync = _bluebird2.default.promisify(_fs.readFile);

/**
 * Export `updateConfig`.
 */

function updateConfig(yargs) {
  yargs.option('file', { demand: false, describe: 'Configuration file', type: 'string' }).option('repository', { demand: false, describe: 'Repository name (ex. seegno/github-labels)', type: 'string' }).option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' }).example('$0 --repository foo/bar --token foobar --file ./path/somefile');
}