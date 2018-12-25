const {getAll, getAllnickname} = require('../service/postService');
const pagination = require('../model/pagination');
const {formatUTC} = require('../util/dateUtil');


const postRouter = class postRouter {

    async getAll(ctx, next) {
        let {index, size, q, status, orderBy, order, channel, nickname, beginDate, endDate} = ctx.request.query;
        let page = new pagination({index, size, orderBy, order});
        let query = {};
        if(q){
            q = decodeURIComponent(q);
            query['$or'] = [
                {'postId': q},
                {'title': new RegExp(q, 'i')}
            ];
        }
        if(status){
            query.status = status;
        }
        if(channel){
            query.channel = channel;
        }
        if(nickname){
            query.nickname = nickname;
        }
        // TODO 日期查询
        console.info(`beginDate: ${beginDate} / endDate: ${endDate}`);
        page.q = query;
        ctx.body = await getAll(page);
        await next();
    }

    async getAllnickname(ctx, next) {
        let {index, size, q, status} = ctx.request.query;
        let page = new pagination({index, size});
        ctx.body = await getAllnickname(page);
        await next();
    }

};


exports.getAll = async (ctx, next) => {
    return new postRouter().getAll(ctx, next);
};

exports.getAllnickname = async (ctx, next) => {
    return new postRouter().getAll(ctx, next);
};