jest.unmock('urijs')
var Rest = require.requireActual('../rest.js');

var __responses = {};

function toText(text) {
  return new Promise(function(resolve) {
    resolve(text)
  })
}

function toJson(text) {
  return new Promise(function(resolve, reject) {
    try {
      var json = JSON.parse(text);
      resolve(json);
    } catch(err) {
      reject(new Error('Given setResponse is not JSON.'));
    }
  })
}

var fakeRequest = function(url) {
  return new Promise(function(resolve, reject) {
    process.nextTick(function() {
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

fetch = jest.fn(fakeRequest);

function RestMock(base, addOptions, useTrailingSlashes) {
  var rest = Rest(base, addOptions, useTrailingSlashes)

  rest.setResponse = function(url, response) {
    __responses[url] = response;
  }

  rest.getPending = function() {
    var pending = [];
    for (var property in __responses) {
      if (__responses.hasOwnProperty(property)) {
        pending.push(property);
      }
    }
    return pending;
  }

  return rest
}

module.exports = RestMock
