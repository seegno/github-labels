'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * List command.
 */

let list = exports.list = (() => {
  var _ref = _asyncToGenerator(function* (args) {
    const questions = {
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

    console.log('Listing labels...'); // eslint-disable-line no-console
    console.log(_prettyjson2.default.render((0, _lodash.pick)(options, (0, _lodash.keys)((0, _lodash.pickBy)(questions))))); // eslint-disable-line no-console

    try {
      const labels = yield (0, _.listLabels)(_extends({}, options));

      console.log('Labels:'); // eslint-disable-line no-console
      console.log(_prettyjson2.default.render(labels)); // eslint-disable-line no-console

      console.log('Listing completed!'); // eslint-disable-line no-console
    } catch (e) {
      console.error(e.message); // eslint-disable-line no-console
    }
  });

  return function list(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.listConfig = listConfig;

var _lodash = require('lodash');

var _ = require('..');

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
 * Export `listConfig`.
 */

function listConfig(yargs) {
  yargs.option('repository', { demand: false, describe: 'Repository name (ex. seegno/github-labels)', type: 'string' }).option('token', { demand: true, describe: 'GitHub authentication token', type: 'string' }).example('$0 --repository foo/bar --token');
}