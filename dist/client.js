'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
/**
 * Module dependencies.
 */

/**
 * GitHub configuration.
 */

const config = {
  debug: false,
  host: 'api.github.com',
  protocol: 'https',
  timeout: 5000,
  version: '3.0.0'
};

/**
 * Get repository owner and name and include a validation.
 */

const getRepositoryOptions = repository => {
  const [owner, repo] = repository.split('/');

  if (!owner || !repo) {
    throw new Error('Malformed repository option');
  }

  return { owner, repo };
};

/**
 * Export `Client`.
 */

class Client {

  /**
   * Constructor.
   */

  constructor(_ref) {
    let { token } = _ref,
        options = _objectWithoutProperties(_ref, ['token']);

    this.github = new _github2.default(_extends({}, config, options));

    this.github.authenticate({ token, type: 'oauth' });
  }

  /**
   * Create a new label with given `name` and `color`.
   */

  createLabel(repository, name, color) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { owner, repo } = getRepositoryOptions(repository);

      return yield _this.github.issues.createLabel({
        color,
        name,
        owner,
        repo
      });
    })();
  }

  /**
   * Create or update a label with given `name`.
   */

  createOrUpdateLabel(repository, name, color) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let label = false;

      try {
        label = yield _this2.getLabel(repository, name);
      } catch (err) {
        if (!(0, _lodash.has)(err, 'code') || (0, _lodash.get)(err, 'code') !== 404) {
          throw err;
        }
      }

      if (label) {
        return yield _this2.updateLabel(repository, name, color);
      }

      return yield _this2.createLabel(repository, name, color);
    })();
  }

  /**
   * Delete label by given `name`.
   */

  deleteLabel(repository, name) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const { owner, repo } = getRepositoryOptions(repository);

      return yield _this3.github.issues.deleteLabel({
        name,
        owner,
        repo
      });
    })();
  }

  /**
   * Get all repo labels.
   */

  getLabels(repository) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const { owner, repo } = getRepositoryOptions(repository);

      const result = yield _this4.github.issues.getLabels({
        owner,
        repo
      });

      return result.data;
    })();
  }

  /**
   * Get label by given `name`.
   */

  getLabel(repository, name) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const { owner, repo } = getRepositoryOptions(repository);

      return yield _this5.github.issues.getLabel({
        name,
        owner,
        repo
      });
    })();
  }

  /**
   * Update an existing label with given `color`.
   */

  updateLabel(repository, name, color) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const { owner, repo } = getRepositoryOptions(repository);

      return yield _this6.github.issues.updateLabel({
        color,
        name,
        oldname: name,
        owner,
        repo
      });
    })();
  }

  /**
   * Set labels.
   */

  setLabels(repository, labels) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const current = yield _this7.getLabels(repository);

      // Delete current labels that are not included in the wanted labels.
      const deprecated = (0, _lodash.differenceBy)(current, labels, 'name');

      for (const _ref2 of deprecated) {
        const { name } = _ref2;

        yield _this7.deleteLabel(repository, name);
      }

      // Create or update wanted labels.
      for (const _ref3 of labels) {
        const { color, name } = _ref3;

        yield _this7.createOrUpdateLabel(repository, name, color);
      }
    })();
  }

}
exports.default = Client;