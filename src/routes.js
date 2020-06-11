import { Router } from 'express';
import SongbookController from './app/controllers/SongbookController';
import { getCache, setCache } from './app/middlewares/cache';

const routes = new Router();

routes.get('/content', getCache, SongbookController.show, setCache);

export default routes;
