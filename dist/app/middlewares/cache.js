"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _nodecache = require('node-cache'); var _nodecache2 = _interopRequireDefault(_nodecache);

// stdTTL: time to live in seconds for every generated cache element.
const cache = new (0, _nodecache2.default)({ stdTTL: 7200 });
function getUrlFromRequest(req) {
  const url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
  return url;
}

function setCache(req, res, next) {
  const url = getUrlFromRequest(req);
  cache.set(url, res.locals.data);
  return res.status(200).json(res.locals.data);
}

function getCache(req, res, next) {
  const url = getUrlFromRequest(req);
  const content = cache.get(url);

  if (content) {
    return res.status(200).json(content);
  }
  return next();
}

exports.getCache = getCache; exports.setCache = setCache;
