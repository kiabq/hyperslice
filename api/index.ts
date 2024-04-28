import Koa = require('koa');
import Router = require('koa-router');
import BodyParser = require('koa-bodyparser');
import Logger = require('koa-logger');
import Cors = require("@koa/cors");
import { Pool } from 'pg';
import { encode, decode } from './utils/generate-alias';
require('dotenv').config();

const app = new Koa();
app.use(Cors());
app.use(BodyParser());

const router = new Router();
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  connectionString: process.env.POSTGRES_URL,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: false,
  max: 100,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

console.log(BACKEND_URL);
console.log(FRONTEND_URL);

const FORMATTED_BACKEND_URL = `${process.env.NODE_ENV === "production" ? 'https' : 'http'}://$${BACKEND_URL}`;
const FORMATTED_FRONTEND_URL = `${process.env.NODE_ENV === "production" ? 'https' : 'http'}://$${FRONTEND_URL}`;

router.get('/health', async (ctx) => {
  ctx.status = 200;
  ctx.body = { message: 'Healthy' };
});

router.get('/:id', async (ctx) => {
  const code = (ctx.request.url.split('/'))[1];
  const link = await decode(pool, code);

  if (link) {
    const URL = decodeURIComponent(link);
    ctx.status = 301;
    ctx.redirect(URL);
  } else if (!link) {
    ctx.status = 404;
    ctx.redirect(`${FORMATTED_FRONTEND_URL}/404`);
  } else {
    ctx.status = 500;
    ctx.redirect(`${FORMATTED_FRONTEND_URL}/500`);
  }
});

router.post('/', async (ctx) => {
  const urlPattern = new RegExp(/^(http|https):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/);
  const url = ctx.request.body['data'];

  try {
    if (!urlPattern.test(decodeURIComponent(url))) {
      throw new Error('Invalid URL: ' + url);
    }

    const result = await pool.query(`SELECT link FROM links WHERE link = '${url}'`);
    const isInTable = result.rows.length;
    if (!isInTable) {
      await pool.query(`INSERT INTO links (link) values ('${url}')`);
    }

    const code = await encode(pool, url);
    ctx.response.body = { 
      message: 'POST Success', 
      data: { 
        url: `${FORMATTED_BACKEND_URL}/${code}`, 
        code: code 
      }
    };
    ctx.status = 200;
    ctx.body = ctx.response.body;
  } catch(error) {
    ctx.status = 418;
    ctx.body = { error: 'POST Failed', reason: error.message };
  }
});

app
  .use(Logger())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000)

module.exports = app;