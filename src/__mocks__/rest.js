"use strict";
/* global Promise, process */

jest.unmock('urijs');

var Rest = require.requireActual('../rest.js');

var __responses = {};

function toText(text) {
  return new Promise(function(resolve) {
    process.nextTick(() => resolve(text))
  })
}

function toJson(text) {
  return new Promise(function(resolve, reject) {
    process.nextTick(() => {
      try {
        var json = JSON.parse(text);
        resolve(json);
      } catch(err) {
        reject(new Error('Given setResponse is not JSON.'));
      }
    })
  })
}

var fakeRequest = function(url) {
  return new Promise(function(resolve, reject) {
    process.nextTick(() => {
      if(!__responses.hasOwnProperty(url))
        reject(new Error(`Call to ${url} without expected response`));
      var response = __responses[url];
      delete __responses[url];
      resolve({
        status: 200,
        json: toJson.bind(null, response),
        text: toText.bind(null, response)
      });
    })
  })
};

window.fetch = jest.fn(fakeRequest);

class RestMock extends Rest {
  setResponse(url, response) {
    __responses[url] = response;
  }

  getPending() {
    var pending = [];
    for (var property in __responses) {
      if (__responses.hasOwnProperty(property)) {
        pending.push(property);
      }
    }
    return pending;
  }
}


module.exports = RestMock;
