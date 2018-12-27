const {getAll, exportPost, getStatisticsPost, getChannelAndNickname} = require('../service/postService');
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
        if(beginDate && endDate){
            query["$and"] = [
                {"dateTime": {$gte: new Date(beginDate)}},
                {"dateTime": {$lte: new Date(endDate)}}
            ];
        }
        page.q = query;
        ctx.body = await getAll(page);
        await next();
    }

    async getStatisticsPost(ctx, next) {
        let {channel, beginDate, endDate} = ctx.request.query;
        let page = new pagination();
        let query = {};
        if(channel){
            query.channel = channel;
        }
        if(beginDate && endDate){
            query["$and"] = [
                {"dateTime": {$gte: new Date(beginDate)}},
                {"dateTime": {$lte: new Date(endDate)}}
            ];
        }
        page.q = query;
        ctx.body = await getStatisticsPost(page);
        await next();
    }

    async getChannelAndNickname(ctx, next) {
        let page = new pagination();
        ctx.body = await getChannelAndNickname(page);
        await next();
    }

    async exportPost(ctx, next){
        let {q, status, channel, nickname, beginDate, endDate} = ctx.request.query;
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
        ctx.body = await exportPost(query);
        await next();
    }
};


exports.getAll = async (ctx, next) => {
    return new postRouter().getAll(ctx, next);
};

exports.exportPost = async (ctx, next) => {
    return new postRouter().exportPost(ctx, next);
};

exports.getStatisticsPost = async (ctx, next) => {
    return new postRouter().getStatisticsPost(ctx, next);
};

exports.getChannelAndNickname = async (ctx, next) => {
    return new postRouter().getChannelAndNickname(ctx, next);
};