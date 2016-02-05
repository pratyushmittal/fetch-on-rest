"use strict";
/* global require, window, jest */

describe('Unit tests of mocks of API', function() {
  var api, mockFn;

  beforeEach(function() {
    var Rest = require('../rest.js');
    api = new Rest();
    mockFn = jest.genMockFunction();
  });

  it('test pending', function() {
    api.__setResponse('users', {});
    expect(api.__getPending().length).toEqual(1);
    api.get('users').then(mockFn);
    expect(api.__getPending().length).toEqual(1);
    jest.runAllTimers();
    expect(api.__getPending().length).toEqual(0);
  });

  it('test with params', function() {
    var req = {
      url: ['users', 'me'],
      load: {foo: 'bar'}
    };
    api.__setResponse(req, {});
    api.get(['users', 'me'], {foo: 'bar'}).then(mockFn);
    jest.runAllTimers();
    expect(api.__getPending().length).toEqual(0);
  });

  it('test unmocked call', function() {
    api.get('/hi/').then(mockFn);
    var error = 'Unknown call: {"url":"/hi/"}';
    expect(jest.runAllTimers).toThrow(new Error(error));
  });

  it('test params call error', function() {
    api.get(['hi'], {foo: 'bar'}).then(mockFn);
    api.__setResponse(['hi'], 'no foo');
    var error = 'Unknown call: {"url":["hi"],"load":{"foo":"bar"}}';
    expect(jest.runAllTimers).toThrow(new Error(error));
  });

  it('should return mocked value', function() {
    var mocked = jest.genMockFunction();
    api.get('/foo/').then(mocked);
    api.__setResponse('/foo/', 'bar');
    jest.runAllTimers();
    expect(mocked).toBeCalledWith('bar');
  });
});
