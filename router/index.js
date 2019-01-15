const koaRouter = require('koa-router');
const router = koaRouter({prefix:'/api'});

const postRouter = require('./postRouter');

router.get('/post', postRouter.getAll);
router.get('/statistics', postRouter.getStatisticsPost);
router.get('/option', postRouter.getChannelAndNickname);
router.post('/export', postRouter.exportPost);
router.post('/statisticsExport', postRouter.exportPostForStatistics);
router.get('/export', postRouter.downloadItemFile);


module.exports = router;