'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyLabelsFromRepo = exports.updateLabels = exports.listLabels = undefined;

/**
 * Export `listLabels`.
 */

let listLabels = exports.listLabels = (() => {
  var _ref = _asyncToGenerator(function* (options) {
    const { repository, token } = options;

    // Instantiate client.
    const client = new _client2.default({ token });

    // Get source labels.
    const labels = yield client.getLabels(repository);

    // Parsed labels.
    return labels.map(function ({ color, name }) {
      return { color, name };
    });
  });

  return function listLabels(_x) {
    return _ref.apply(this, arguments);
  };
})();

/**
 * Export `updateLabels`.
 */

let updateLabels = exports.updateLabels = (() => {
  var _ref2 = _asyncToGenerator(function* (options) {
    const { repository, token, labels } = options;

    // Instantiate client.
    const client = new _client2.default({ token });

    // Set the repository labels using the labels in the configuration file.
    yield client.setLabels(repository, labels);
  });

  return function updateLabels(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

/**
 * Export `copyLabelsFromRepo`.
 */

let copyLabelsFromRepo = exports.copyLabelsFromRepo = (() => {
  var _ref3 = _asyncToGenerator(function* (options) {
    const { source, target, token } = options;

    // Instantiate clients.
    const client = new _client2.default({ token });

    // Get source labels.
    const rawLabels = yield client.getLabels(source);

    // Parsed labels.
    const labels = rawLabels.map(function ({ color, name }) {
      return { color, name };
    });

    // Set the repository labels using the labels in the source repository.
    yield client.setLabels(target, labels);
  });

  return function copyLabelsFromRepo(_x3) {
    return _ref3.apply(this, arguments);
  };
})();

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/**
 * Module dependencies.
 */