"use strict";
/* global require, window, jest */

describe('Unit tests of mocks of API', function() {
  var api;

  var throwError = function(resp) {
    throw new Error(`Got unexpected response: ${resp}`)
  };

  beforeEach(function() {
    var Rest = require('../rest.js');
    api = new Rest();
  });

  afterEach(function() {
    expect(api.__getPending().length).toEqual(0);
  })

  pit('test pending', function() {
    api.__setResponse('/users', JSON.stringify({foo: 'bar'}));
    expect(api.__getPending().length).toEqual(1);
    return api.get('users').then(resp => {
      expect(resp).toEqual({foo: 'bar'});
    });
  });

  pit('test with params', function() {
    api.__setResponse('/users/me?foo=bar', JSON.stringify({foo: 'bar'}));
    return api.get(['users', 'me'], {foo: 'bar'}).then(resp => {
      expect(resp).toEqual({foo: 'bar'});
    });
  });

  pit('test unmocked call', function() {
    return api.get('hi').then(throwError, err => {
      expect(err.message).toEqual('Call to /hi without expected response');
    });
  });

  pit('test params call error', function() {
    return api.get(['hi'], {foo: 'bar'}).then(throwError, err => {
      var message = 'Call to /hi?foo=bar without expected response';
      expect(err.message).toEqual(message);
    });
  });

  pit('should return mocked value', function() {
    api.__setResponse('/foo', 'bar');
    return api.rawGet('foo').then(resp => {
      expect(resp).toBe('bar');
    });
  });
});
