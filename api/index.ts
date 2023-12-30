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
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  max: 100,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
const backend_url = process.env.BACKEND_URL;

router.get('/:id', async (ctx) => {
  const code = (ctx.request.url.split('/'))[1];
  const link = await decode(pool, code);

  if (link) {
    const URL = decodeURIComponent(link);
    ctx.status = 301;
    ctx.redirect(URL);
  } else if (!link) {
    ctx.status = 404;
    ctx.redirect(`http://${process.env.FRONTEND_URL}/404`);
  } else {
    ctx.status = 500;
    ctx.redirect(`http://${process.env.FRONTEND_URL}/500`);
  }
});

router.post('/', async (ctx) => {
  const urlPattern = new RegExp(/^(http|https):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/);
  const url = ctx.request.body['data'];

  ctx.status = 403;
  ctx.body = { error: "Link shortening is temporarily disabled. Come back soon :)"}
  return;
  
  try {
    const check = await fetch(decodeURIComponent(url));
    if (!check.ok) {
      throw new Error('Invalid URL: ' + url);
    }

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
        url: `https://${backend_url}/${code}`, 
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
  .listen(3001)

module.exports = app;