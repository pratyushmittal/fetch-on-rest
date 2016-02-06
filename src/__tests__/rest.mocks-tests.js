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
    api.__setResponse('users', {foo: 'bar'});
    expect(api.__getPending().length).toEqual(1);
    return api.get('users').then(resp => {
      expect(resp).toEqual({foo: 'bar'});
    });
  });

  pit('test with params', function() {
    var req = {
      url: ['users', 'me'],
      load: {foo: 'bar'}
    };
    api.__setResponse(req, {foo: 'bar'});
    return api.get(['users', 'me'], {foo: 'bar'}).then(resp => {
      expect(resp).toEqual({foo: 'bar'});
    });
  });

  pit('test unmocked call', function() {
    return api.get('/hi/').then(throwError, err => {
      expect(err.message).toEqual('Unknown call: {"url":"/hi/"}');
    });
  });

  pit('test params call error', function() {
    return api.get(['hi'], {foo: 'bar'}).then(throwError, err => {
      var message = 'Unknown call: {"url":["hi"],"load":{"foo":"bar"}}';
      expect(err.message).toEqual(message);
    });
  });

  pit('should return mocked value', function() {
    api.__setResponse('/foo/', 'bar');
    return api.get('/foo/').then(resp => {
      expect(resp).toBe('bar');
    });
  });
});
