"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URI = require('urijs');

function parseText(response) {
  return response.text();
}

function parseJson(response) {
  if (response.status == 204) return;
  return response.json().then(function (json) {
    if (response.status >= 200 && response.status < 300) {
      return json;
    } else {
      var error = new Error(response.statusText);
      error.json = json;
      throw error;
    }
  });
}

function getDefaultOptions(data, method) {
  var options = {
    method: !method || method == 'raw' ? 'get' : method,
    headers: {}
  };

  if (method != 'raw') options.headers.Accept = 'application/json';

  if (data !== undefined) {
    options.body = JSON.stringify(data);
    options.headers['Content-Type'] = 'application/json';
  }
  return options;
}

var Rest = function () {
  function Rest(base, options, useTrailingSlashes) {
    _classCallCheck(this, Rest);

    if (base === undefined) base = '/';
    if (options === undefined) options = function options() {};
    this.base = base;
    this.addOptions = options;
    this.useTrailingSlashes = useTrailingSlashes;
  }

  _createClass(Rest, [{
    key: '_getUrl',
    value: function _getUrl(segments, query) {
      var uri = new URI(this.base);
      if (!(segments instanceof Array)) segments = [segments];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = segments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var segment = _step.value;

          uri = uri.segment(segment.toString());
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (this.useTrailingSlashes) uri = uri.segment('');
      if (query) uri = uri.addSearch(query);
      return uri.toString();
    }
  }, {
    key: '_request',
    value: function _request(segments, query, data, method) {
      var url = this._getUrl(segments, query);
      var options = getDefaultOptions(data, method);
      this.addOptions(options);
      var raw = window.fetch(url, options);
      return method == 'raw' ? raw.then(parseText) : raw.then(parseJson);
    }
  }, {
    key: 'get',
    value: function get(segments, query) {
      return this._request(segments, query);
    }
  }, {
    key: 'rawGet',
    value: function rawGet(segments, query, acceptHeaders) {
      return this._request(segments, query, undefined, 'raw');
    }
  }, {
    key: 'post',
    value: function post(segments, data, query) {
      return this._request(segments, query, data, 'post');
    }
  }, {
    key: 'put',
    value: function put(segments, data, query) {
      return this._request(segments, query, data, 'put');
    }
  }, {
    key: 'patch',
    value: function patch(segments, data, query) {
      return this._request(segments, query, data, 'patch');
    }
  }, {
    key: 'delete',
    value: function _delete(segments, data, query) {
      return this._request(segments, query, data, 'delete');
    }
  }]);

  return Rest;
}();

;

module.exports = Rest;