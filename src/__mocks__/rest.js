"use strict";

function getKey(url, params) {
  var key = {
    url: url,
    load: params
  };
  return JSON.stringify(key);
}

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
  return new Promise(function(resolve, reject) {
    var key = getKey(url, params);
    if(!__responses.hasOwnProperty(key))
      reject(new Error(`Unknown call: ${key}`));
    var response = __responses[key];
    delete __responses[key];
    resolve(response);
  })
};


class RestMock {

  constructor() {
    this.__setResponse = __setResponse;
    this.__getPending = __getPending;
    this.get = jest.genMockFunction().mockImplementation(fakeRequest);
    this.rawGet = jest.genMockFunction().mockImplementation(fakeRequest);
    this.post = jest.genMockFunction().mockImplementation(fakeRequest);
    this.patch = jest.genMockFunction().mockImplementation(fakeRequest);
    this.delete = jest.genMockFunction().mockImplementation(fakeRequest);
    this.put = jest.genMockFunction().mockImplementation(fakeRequest);
  }

}

module.exports = RestMock;
