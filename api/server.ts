import Koa = require('koa');
import Router = require('koa-router');
import BodyParser = require('koa-bodyparser');
import Logger = require('koa-logger');
import { Pool } from 'pg';

// import https from 'https';
// import Cors = require('@koa/cors');

const app = new Koa();
const router = new Router();
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

router.get('/', async (ctx) => {
  ctx.body = "Hello, World!";
  // const result = await pool.query('SELECT * FROM people');
});

// TODO
// - Encode and Decode urls both on frontend and backend
// - database stuff

router.post('/', async (ctx) => {
  const urlPattern = new RegExp(/^(http|https):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/);
  const url = ctx.request.body['data'];

  try {
    if (!urlPattern.test(decodeURIComponent(url))) {
      throw new Error('Invalid URL: ' + url);
    }
    
    const body = ctx.request.body;

    ctx.status = 200;
    ctx.body = { message: 'POST Success', data: body };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'POST Failed', reason: error.message };
  }
});

app.use(async (ctx, next) => {
  ctx.set('vary', 'Origin');
  // Change to actual origin for deployment
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  
  await next();
});

app.use(BodyParser());
app
  .use(Logger())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3001)