const koaRouter = require('koa-router');
const router = koaRouter({prefix:'/api'});

const postRouter = require('./postRouter');

router.get('/post', postRouter.getAll);
router.get('/nicknames', postRouter.getAllnickname);


module.exports = router;