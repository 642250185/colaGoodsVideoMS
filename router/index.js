const koaRouter = require('koa-router');
const router = koaRouter({prefix:'/api'});

const postRouter = require('./postRouter');

router.get('/post', postRouter.getAll);

router.get('/statistics', postRouter.getStatisticsPost);
router.get('/option', postRouter.getChannelAndNickname);
router.post('/export', postRouter.exportPost);
router.get('/groupList', postRouter.getGroupList);
router.post('/channelUsername', postRouter.getUsernameByChannel);
router.post('/statisticsExport', postRouter.exportPostForStatistics);
router.get('/statisticsPlayCount', postRouter.getStatisticsPlayCount);
router.get('/export', postRouter.downloadItemFile);
router.post('/updateGroup', postRouter.updateGroup);

router.post('/add', postRouter.add);
router.post('/del', postRouter.del);
router.get('/list', postRouter.list);

module.exports = router;