"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

jest.dontMock('urijs');

var Rest = require.requireActual('../rest.js');

var __responses = {};

function toText(text) {
  return new Promise(function (resolve) {
    resolve(text);
  });
}

function toJson(text) {
  return new Promise(function (resolve, reject) {
    try {
      var json = JSON.parse(text);
      resolve(json);
    } catch (err) {
      reject(new Error('Given __setResponse is not JSON.'));
    }
  });
}

var fakeRequest = function fakeRequest(url) {
  return new Promise(function (resolve, reject) {
    if (!__responses.hasOwnProperty(url)) reject(new Error('Call to ' + url + ' without expected response'));
    var response = __responses[url];
    delete __responses[url];
    resolve({
      status: 200,
      json: toJson.bind(null, response),
      text: toText.bind(null, response)
    });
  });
};

window.fetch = jest.genMockFunction().mockImplementation(fakeRequest);

var RestMock = function (_Rest) {
  _inherits(RestMock, _Rest);

  function RestMock() {
    _classCallCheck(this, RestMock);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(RestMock).apply(this, arguments));
  }

  _createClass(RestMock, [{
    key: '__setResponse',
    value: function __setResponse(url, response) {
      __responses[url] = response;
    }
  }, {
    key: '__getPending',
    value: function __getPending() {
      var pending = [];
      for (var property in __responses) {
        if (__responses.hasOwnProperty(property)) {
          pending.push(property);
        }
      }
      return pending;
    }
  }]);

  return RestMock;
}(Rest);

module.exports = RestMock;