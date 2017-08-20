'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
/**
 * Module dependencies.
 */

var _lodash = require('lodash');

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
 * Export `Client`.
 */

class Client {

  /**
   * Constructor.
   */

  constructor({ owner, repo, options }) {
    this.github = new _github2.default(_extends({}, config, options));
    this.owner = owner;
    this.repo = repo;

    _bluebird2.default.promisifyAll(this.github.issues);
    _bluebird2.default.promisifyAll(this.github);
  }

  /**
   * Authenticate.
   */

  authenticate(token) {
    this.github.authenticate({ token, type: 'oauth' });
  }

  /**
   * Create a new label with given `name` and `color`.
   */

  createLabel(name, color) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return yield _this.github.issues.createLabelAsync({
        color,
        name,
        owner: _this.owner,
        repo: _this.repo
      });
    })();
  }

  /**
   * Create or update a label with given `name`.
   */

  createOrUpdateLabel(name, color) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let label = false;

      try {
        label = yield _this2.getLabel(name);
      } catch (err) {
        if (!(0, _lodash.has)(err, 'code') || (0, _lodash.get)(err, 'code') !== 404) {
          throw err;
        }
      }

      if (label) {
        return yield _this2.updateLabel(name, color);
      }

      return yield _this2.createLabel(name, color);
    })();
  }

  /**
   * Delete label by given `name`.
   */

  deleteLabel(name) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return yield _this3.github.issues.deleteLabelAsync({
        name,
        owner: _this3.owner,
        repo: _this3.repo
      });
    })();
  }

  /**
   * Get all repo labels.
   */

  getLabels() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const result = yield _this4.github.issues.getLabelsAsync({
        owner: _this4.owner,
        repo: _this4.repo
      });

      return result.data;
    })();
  }

  /**
   * Get label by given `name`.
   */

  getLabel(name) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      return yield _this5.github.issues.getLabelAsync({
        name,
        owner: _this5.owner,
        repo: _this5.repo
      });
    })();
  }

  /**
   * Update an existing label with given `color`.
   */

  updateLabel(name, color) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      return yield _this6.github.issues.updateLabelAsync({
        color,
        name,
        oldname: name,
        owner: _this6.owner,
        repo: _this6.repo
      });
    })();
  }

  /**
   * Set labels.
   */

  setLabels(labels) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const current = yield _this7.getLabels();

      // Delete current labels that are not included in the wanted labels.
      const deprecated = (0, _lodash.differenceBy)(current, labels, 'name');

      for (const _ref of deprecated) {
        const { name } = _ref;

        yield _this7.deleteLabel(name);
      }

      // Create or update wanted labels.
      for (const _ref2 of labels) {
        const { color, name } = _ref2;

        yield _this7.createOrUpdateLabel(name, color);
      }
    })();
  }
}
exports.default = Client;