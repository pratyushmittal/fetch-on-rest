"use strict";
jest.mock('../rest.js')

describe('tests for url parsing', function(){
  it('checks expansions', function() {
    var Rest = require('../rest.js');
    var api = Rest();
    expect(api._getUrl()).toEqual('/');
    expect(api._getUrl('/')).toEqual('/');
    expect(api._getUrl(['posts', 33])).toEqual('/posts/33');
    expect(api._getUrl(['users', 'me'])).toEqual('/users/me');
    // Example from https://blogs.dropbox.com/developers/2015/03/json-in-urls/
    var params = JSON.stringify({a: "b", c: 4});
    expect(api._getUrl(['users', 'me'], params)).toEqual(
      '/users/me?%7B%22a%22%3A%22b%22%2C%22c%22%3A4%7D');
  });

  it('checks expansions with default get params', function() {
    var Rest = require('../rest.js');
    var api = Rest('/api?authentication=foobar');
    expect(api._getUrl(['users', 'me'])).toEqual(
      '/api/users/me?authentication=foobar');
    expect(api._getUrl(['users', 'me'], {foo: 'bar'})).toEqual(
      '/api/users/me?authentication=foobar&foo=bar');
  })

  it('checks trailing slashes', function() {
    var Rest = require('../rest.js');
    var api = Rest('/api', function() {}, true);
    expect(api._getUrl(['posts', 33])).toEqual('/api/posts/33/');
    expect(api._getUrl(['users', 'me'])).toEqual(
      '/api/users/me/');
    expect(api._getUrl(['users', 'me'], {foo: 'bar'})).toEqual(
      '/api/users/me/?foo=bar');
    expect(api._getUrl(['users', 'me.html'], {foo: 'bar'})).toEqual(
      '/api/users/me.html?foo=bar');
  });
});


describe('Test REST without options', function () {
  var api;

  beforeEach(function() {
    var Rest = require('../rest.js');
    api = Rest();
  })

  afterEach(function() {
    expect(api.getPending()).toEqual([]);
  })

  pit('calls the get api', function () {
    api.setResponse('/me?foo=bar', JSON.stringify({foo: 'bar'}));
    return api.get('me', {foo: 'bar'}).then(resp => {
      expect(resp).toEqual({foo: 'bar'});
      expect(fetch).toBeCalledWith('/me?foo=bar', {
        headers: { Accept: 'application/json' },
        method: 'get'
      });
    });
  });

  pit('calls the post api', function () {
    api.setResponse('/logout', JSON.stringify({foo: 'bar'}));
    return api.post('logout', { foo: 'bar' }).then(resp => {
      expect(resp).toEqual({foo: 'bar'});
      expect(fetch).toBeCalledWith('/logout', {
        body: '{"foo":"bar"}',
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json'
        },
        method: 'post'
      });
    });
  });

  pit('calls the post api with empty data', function() {
    api.setResponse('/logout', JSON.stringify({foo: 'bar'}));
    return api.post('logout').then(resp => {
      expect(resp).toEqual({foo: 'bar'});
      expect(fetch).toBeCalledWith(
        '/logout',
        { headers: { Accept: 'application/json' },
          method: 'post'
        }
      );
    });
  });

  pit('calls the delete api', function() {
    api.setResponse('/posts/33?foo=bar', JSON.stringify({delete: true}));
    return api.del(['posts', 33], {foo: 'bar'}).then(resp => {
      expect(resp).toEqual({delete: true});
      expect(fetch).toBeCalledWith(
        '/posts/33?foo=bar',
        {
          headers: {
            Accept: 'application/json'
          },
          method: 'delete'
        }
      );
    });
  });
});


describe('Test REST with options', function () {
  var api;

  beforeEach(function() {
    var Rest = require('../rest.js');
    var options = function(defaults, url) {
      var endsWith = function(haystack, needle) {
        return haystack.indexOf(needle, haystack.length - needle.length) !== -1;
      };
      defaults.credentials = 'same-origin';
      if(defaults.method != 'get')
        defaults.headers['X-CSRFToken'] = 'AUTHTOKENX';
      if(endsWith(url, '.html'))
        defaults.headers.Accept = 'text/html,*/*';
    }
    var useTrailingSlashes = true;
    api = Rest('/base/', options, useTrailingSlashes)
  })

  afterEach(function() {
    expect(api.getPending()).toEqual([]);
  })

  pit('calls the get api', function() {
    api.setResponse('/base/me/', JSON.stringify({foo: 'bar'}));
    return api.get('me').then(resp => {
      expect(resp).toEqual({foo: "bar"});
      expect(fetch).toBeCalledWith(
        '/base/me/',
        {
          credentials: 'same-origin',
          headers: {Accept: 'application/json'},
          method: 'get'
        }
      );
    });
  });

  pit('calls the get api with options', function() {
    api.setResponse('/base/me.html', JSON.stringify({foo: 'bar'}));
    return api.get('me.html').then(resp => {
      expect(resp).toEqual({foo: "bar"});
      expect(fetch).toBeCalledWith(
        '/base/me.html',
        {
          credentials: 'same-origin',
          headers: {Accept: 'text/html,*/*'},
          method: 'get'
        }
      );
    });
  });

  pit('calls the post api', function() {
    api.setResponse('/base/logout/', JSON.stringify({foo: 'bar'}));
    return api.patch('logout', {foo: 'bar'}).then(resp => {
      expect(resp).toEqual({foo: "bar"});
      expect(fetch).toBeCalledWith(
        '/base/logout/',
        { body: '{"foo":"bar"}',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            'X-CSRFToken': 'AUTHTOKENX'
          },
          method: 'PATCH'
        }
      );
    })
  });

});
