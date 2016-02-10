"use strict";

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


class Rest {

  constructor(base, options, useTrailingSlashes) {
    if(base === undefined)
      base = '/';
    if(options === undefined)
      options = function() {};
    this.base = base;
    this.addOptions = options;
    this.useTrailingSlashes = useTrailingSlashes;
  }

  _getUrl(segments, query) {
    var uri = new URI(this.base);
    segments = segments || [];
    if(!(segments instanceof Array))
      segments = [segments]
    let segment;
    for(segment of segments) {
      segment = segment.toString();
      uri = uri.segment(segment);
    }
    if(this.useTrailingSlashes && segment.indexOf('.') == -1)
      uri = uri.segment('');
    if(query)
      uri = uri.addSearch(query);
    return uri.toString();
  }

  _getOptions(data, method) {
    var options = getDefaultOptions(data, method);
    this.addOptions(options);
    return options;
  }

  _parseText(response) {
    return response.text();
  }

  _parseJson(response) {
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

  _request(segments, query, data, method) {
    var url = this._getUrl(segments, query);
    var options = this._getOptions(data, method);
    var raw = window.fetch(url, options);
    if(method == 'raw')
      return raw.then(this._parseText);
    return raw.then(this._parseJson);
  }

  get(segments, query) {
    return this._request(segments, query);
  }

  rawGet(segments, query) {
    return this._request(segments, query, undefined, 'raw')
  }

  post(segments, data, query) {
    return this._request(segments, query, data, 'post');
  }

  put(segments, data, query) {
    return this._request(segments, query, data, 'put');
  }

  patch(segments, data, query) {
    return this._request(segments, query, data, 'patch');
  }

  delete(segments, query) {
    return this._request(segments, query, undefined, 'delete');
  }
}


module.exports = Rest;
