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

/*
  figure out what this means and implement it:
  CONSTRAINT FK_link FOREIGN KEY(link_id) REFERENCES link(link_id)
*/

router.post('/', async (ctx) => {
  const urlPattern = new RegExp(/^(http|https):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/);
  const url = ctx.request.body['data'];

  // bubby suggests: try one try w/ two catches instead of a nested try...catch
  try {
    if (!urlPattern.test(decodeURIComponent(url))) {
      throw new Error('Invalid URL: ' + url);
    }

    try {
      // check if url is in the table
      const result = await pool.query(`SELECT link FROM links WHERE link = '${url}'`);
      const isInTable = !!(result.rows.length);

      if (!isInTable) {
        // make this better :)
        await pool.query(`INSERT INTO links (link) values ('${url}')`);
        console.log("inserting into db: ", url);
      } else {
        // Throw error here
        console.error("erroring here");
      }

      const body = ctx.request.body;
      ctx.status = 200;
      ctx.body = { message: 'POST Success', data: body };
    } catch(e) {
      // query went wrong, maybe change this catch
      console.log(e);
    }
  } catch (error) {
    ctx.status = 413;
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