import Koa = require('koa');
import Router = require('koa-router');
import BodyParser = require('koa-bodyparser');
import Logger = require('koa-logger');
import Cors = require('@koa/cors');
import { Pool } from 'pg';
import { request } from 'http';

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
    console.log(ctx);
    // const result = await pool.query('SELECT * FROM people');
});

router.post('/', async (ctx) => {
    console.log(ctx)
    ctx.body = "Returned";
});

app
  .use(Logger())
  .use(BodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(Cors({
    origin: ["localhost:3000", "localhost:3001"]
  }))
  .listen(3001)