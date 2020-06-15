"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _SongbookController = require('./app/controllers/SongbookController'); var _SongbookController2 = _interopRequireDefault(_SongbookController);
var _cache = require('./app/middlewares/cache');

const routes = new (0, _express.Router)();

routes.get('/content', _cache.getCache, _SongbookController2.default.show, _cache.setCache);

routes.put('/lyrics/:id', _SongbookController2.default.update);

routes.put('/songs/:id', _SongbookController2.default.store);

exports. default = routes;
