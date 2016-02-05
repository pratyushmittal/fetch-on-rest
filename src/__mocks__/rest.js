"use strict";

function getKey(url, params) {
  var key = {
    url: url,
    load: params
  };
  return JSON.stringify(key);
}

var __timeout = 500;
var __responses = {};
function __setResponse(url, response) {
  var key;
  if(url.hasOwnProperty('url') && url.hasOwnProperty('load'))
    key = getKey(url.url, url.load);
  else
    key = getKey(url);
  __responses[key] = response;
}

function __getPending() {
  var pending = [];
  for (var property in __responses) {
    if (__responses.hasOwnProperty(property)) {
      pending.push(property);
    }
  }
  return pending;
}

var fakeRequest = function(url, params) {
  var then = jest.genMockFunction().mockImplementation(function(callback) {
    var key = getKey(url, params);
    return setTimeout(
      function() {
        if(!__responses.hasOwnProperty(key))
          throw new Error("Unknown call: " + key);
        var response = __responses[key];
        delete __responses[key];
        callback(response);
      },
      __timeout
    );
  });
  return {then: then};
};


class RestMock {

  constructor() {
    this.__timeout = __timeout;
    this.__setResponse = __setResponse;
    this.__getPending = __getPending;
    this.get = jest.genMockFunction().mockImplementation(fakeRequest);
    this.post = jest.genMockFunction().mockImplementation(fakeRequest);
    this.patch = jest.genMockFunction().mockImplementation(fakeRequest);
    this.delete = jest.genMockFunction().mockImplementation(fakeRequest);
    this.put = jest.genMockFunction().mockImplementation(fakeRequest);
  }

}

module.exports = RestMock;
