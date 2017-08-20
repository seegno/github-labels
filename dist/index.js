'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyLabelsFromRepo = exports.updateLabels = undefined;

/**
 * Export `updateLabels`.
 */

let updateLabels = exports.updateLabels = (() => {
  var _ref = _asyncToGenerator(function* (options) {
    const { owner, repo, token, labels } = options;

    // Instantiate client.
    const client = new _client2.default({ owner, repo });

    // Authenticate user.
    client.authenticate(token);

    // Set the repository labels using the labels in the configuration file.
    yield client.setLabels(labels);
  });

  return function updateLabels(_x) {
    return _ref.apply(this, arguments);
  };
})();

/**
 * Export `copyLabelsFromRepo`.
 */

let copyLabelsFromRepo = exports.copyLabelsFromRepo = (() => {
  var _ref2 = _asyncToGenerator(function* (options) {
    const { sourceOwner, sourceRepo, targetOwner, targetRepo, token } = options;

    // Instantiate clients.
    const clientSource = new _client2.default({ owner: sourceOwner, repo: sourceRepo });
    const clientTarget = new _client2.default({ owner: targetOwner, repo: targetRepo });

    // Authenticate user.
    clientSource.authenticate(token);
    clientTarget.authenticate(token);

    // Get source labels.
    const rawLabels = yield clientSource.getLabels();

    // Parsed labels.
    const labels = rawLabels.map(function ({ color, name }) {
      return { color, name };
    });

    // Set the repository labels using the labels in the source repository.
    yield clientTarget.setLabels(labels);
  });

  return function copyLabelsFromRepo(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/**
 * Module dependencies.
 */