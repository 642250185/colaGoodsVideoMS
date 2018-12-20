require('./schema');
const Koa = require('koa');
const app = new Koa();
const router = require('./router');

app.use(router.routes());

app.listen(3000);
console.info(`==> Service now is listening on port 3000`);