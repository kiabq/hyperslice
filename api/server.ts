import Koa = require('koa');
import Router = require('koa-router');
import Logger = require('koa-logger');
import { Pool } from 'pg';

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
    const result = await pool.query('SELECT * FROM people');
});

router.post('/');

app.use(Logger());
app.use(router.routes());
app.listen(3001);