'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyFromRepo = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Copy command.
 */

let copyFromRepo = exports.copyFromRepo = (() => {
  var _ref = _asyncToGenerator(function* (args) {
    const questions = {
      sourceOwner: {
        message: 'What is the source owner name?',
        name: 'sourceOwner',
        validate: function (input) {
          return !!input;
        }
      },
      sourceRepo: {
        message: 'What is the source repository name?',
        name: 'sourceRepo',
        validate: function (input) {
          return !!input;
        }
      },
      targetOwner: {
        message: 'What is the target owner name?',
        name: 'targetOwner',
        validate: function (input) {
          return !!input;
        }
      },
      targetRepo: {
        message: 'What is the target repository name?',
        name: 'targetRepo',
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

    console.log('Copying labels from repo...'); // eslint-disable-line no-console
    console.log(_prettyjson2.default.render((0, _lodash.pick)(options, (0, _lodash.keys)((0, _lodash.pickBy)(questions))))); // eslint-disable-line no-console

    yield (0, _.copyLabelsFromRepo)(options);

    return console.log('Copy completed!'); // eslint-disable-line no-console
  });

  return function copyFromRepo(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.copyFromRepoConfig = copyFromRepoConfig;

var _ = require('..');

var _lodash = require('lodash');

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _prettyjson = require('prettyjson');

var _prettyjson2 = _interopRequireDefault(_prettyjson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/**
 * Module dependencies.
 */

/**
 * Export `copyFromRepoConfig`.
 */

function copyFromRepoConfig(yargs) {
  yargs.option('sourceOwner', { demand: false, describe: 'Source repository owner', type: 'string' }).option('sourceRepo', { demand: false, describe: 'Source repository name', type: 'string' }).option('targetOwner', { demand: false, describe: 'Target repository owner', type: 'string' }).option('targetRepo', { demand: false, describe: 'Target repository name', type: 'string' }).option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' }).example('$0 --owner foo --repo bar --sourceOwner qux --sourceRepo corge --token foobar');
}