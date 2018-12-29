require('./schema');
const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
const koaBody = require('koa-body');
const koaLogger = require('koa-logger');

const {responseHandle} = require('./middleware');

const router = require('./router');

app.use(koaLogger());
app.use(cors({
    origin: '*'
}));
app.use(koaBody({
    'formLimit': '5mb',
    'jsonLimit': '5mb',
    'textLimit': '5mb'
}));


app.use(router.routes());
app.use(router.allowedMethods());
app.use(responseHandle);

app.listen(3000);
console.info(`==> Service now is listening on port 3000`);