var URI = require('urijs');

function getDefaultOptions(data, method) {
  var options = {
    method: (!method || method == 'raw') ? 'get' : method,
    headers: {}
  };

  if(method != 'raw')
    options.headers.Accept = 'application/json';

  if(data !== undefined) {
    options.body = JSON.stringify(data);
    options.headers['Content-Type'] = 'application/json';
  }
  return options;
}


function Rest(base, addOptions, useTrailingSlashes) {

  if(base === undefined)
    base = '/';
  if(addOptions === undefined)
    addOptions = function() {};

  function _getUrl(segments, query) {
    var uri = new URI(base);
    segments = segments || [];
    if(!(segments instanceof Array))
      segments = [segments]
    var segment;
    for(var i=0; i < segments.length; i++) {
      segment = segments[i].toString();
      uri = uri.segment(segment);
    }
    if(useTrailingSlashes && segment.indexOf('.') == -1)
      uri = uri.segment('');
    if(query)
      uri = uri.addSearch(query);
    return uri.toString();
  }

  function _getOptions(data, method, url) {
    var options = getDefaultOptions(data, method);
    addOptions(options, url);
    return options;
  }

  function _parseText(response) {
    return response.text();
  }

  function _parseJson(response) {
    if(response.status == 204)
      return;
    return response.json().then(function(json) {
      if (response.status >= 200 && response.status < 300) {
        return json;
      } else {
        var error = new Error(response.statusText);
        error.json = json;
        throw error;
      }
    });
  }

  function _request(segments, query, data, method) {
    var url = _getUrl(segments, query);
    var options = _getOptions(data, method, url);
    var raw = fetch(url, options);
    if(method == 'raw')
      return raw.then(_parseText);
    return raw.then(_parseJson);
  }

  function get(segments, query) {
    return _request(segments, query);
  }

  function rawGet(segments, query) {
    return _request(segments, query, undefined, 'raw')
  }

  function post(segments, data, query) {
    return _request(segments, query, data, 'post');
  }

  function put(segments, data, query) {
    return _request(segments, query, data, 'put');
  }

  function patch(segments, data, query) {
    return _request(segments, query, data, 'PATCH');
  }

  function del(segments, query) {
    return _request(segments, query, undefined, 'delete');
  }

  return {
    _getUrl: _getUrl,
    get: get,
    rawGet: rawGet,
    post: post,
    put: put,
    patch: patch,
    del: del
  }
}


module.exports = Rest
