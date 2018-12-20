const {getAll} = require('../service/postService');
const pagination = require('../model/pagination');
const postRouter = class postRouter {
    async getAll(ctx, next) {
        let {index, size, q, status, orderBy, order, channel, account} = ctx.request.query;
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
        if(account){
            query.account = account;
        }
        page.q = query;
        console.info(`2 > page: `, page);
        ctx.body = await getAll(page);
        await next();
    }
};


exports.getAll = async (ctx, next) => {
    return new postRouter().getAll(ctx, next);
};