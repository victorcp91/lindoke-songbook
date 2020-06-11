import NodeCache from 'node-cache';

// stdTTL: time to live in seconds for every generated cache element.
const cache = new NodeCache({ stdTTL: 7200 });
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

export { getCache, setCache };
