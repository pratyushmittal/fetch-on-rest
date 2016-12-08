# Fetch-on-REST
[![Build Status](https://travis-ci.org/pratyushmittal/fetch-on-rest.svg?branch=master)](https://travis-ci.org/pratyushmittal/fetch-on-rest)

**Fetch-on-REST is a RESTful API wrapper** built around [window.fetch][fetch].

GitHub provides a [polyfill for fetch][polyfill] to work on all browsers.
Fetch is also [available on react-native][react-native] by default.

This wrapper is intended to work on both the browsers as well as with react-native.


## Usage

Using Fetch-on-REST is as simple as passing the data and handling the JSON response.
Headers are automatically set to accept JSON and the responses are json objects.

```
var Rest = require('fetch-on-rest');
var api = new Rest('/api/v2');

api.get('users', {name: 'foo'}).then(function(response) {});
// GET request on '/api/v2/users?name=foo'

api.post('posts', {title: 'foo', content: 'bar'}).then(function(response) {});
// POST request on '/api/v2/posts' with data {"title": "foo", "content": "bar"}
```


## API

### Initialization

**new Rest(basePath="/", addOptions=function() {}, useTrailingSlashes=false):**

`basePath`: Is a string. Can be absolute or relative path.

`addOptions(defaultOptions, url)`: Is an optional function. Can be used to modify the headers.
Should modify the received `defaultOptions` object and ***not*** return a new object.

`useTrailingSlashes:` Default false. By setting true, `.get('users')` will hit the url `/users/`.

**Example of addOptions:**

```
// Adding same-origin and X-CSRFToken token
function addOptions(defaults, url) {
  defaults.credentials = 'same-origin';
  if(defaults.method != 'get')
    defaults.headers['X-CSRFToken'] = 'AUTHTOKENX';
}

var useTrailingSlashes = true;
var api = new Rest('/', addOptions, useTrailingSlashes);
```


### Requests

**.get(segments, query)**

**.post(segments, data, query)**

**.put(segments, data, query)**

**.patch(segments, data, query)**

**.del(segments, query)**

**.rawGet(segments, query)**

All requests return a promise object.
The promise object resolves to JSON response (except `rawGet` which resolves to text).
URL parsing is handled using the exhaustive [URI.js library][urijs].

**[segments][segments]:** `segments` are the parts of url. Can be array or string.

**[query][query]:** `query` is the search or GET params part of the url. Should be a key-value object.

**data:** `data` is the json body to be sent in the request.


## Changelog and Migration

Since version 2:

- the `delete` method has been renamed as `del`
- have dropped the babel and ES2015 dependencies: this makes usage with React Native smoother


## Contribution

Though we intend to keep the library minimalistic, we would love to see the pull-requests and discuss new issues.

**Thanks for checking it out.**


[fetch]: https://developer.mozilla.org/en/docs/Web/API/Fetch_API
[polyfill]: https://github.com/github/fetch
[react-native]: https://facebook.github.io/react-native/docs/network.html

[urijs]: http://medialize.github.io/URI.js/
[segments]: http://medialize.github.io/URI.js/docs.html#accessors-segment
[query]: http://medialize.github.io/URI.js/docs.html#search-add
