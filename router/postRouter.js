const fs = require('fs-extra');
const config = require('../config/cfg');

const {postService} = require('../service');

const pagination = require('../model/pagination');

const {DOWNLOAD_PATH} = config;

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
        ctx.body = await postService.getAll(page);
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
        ctx.body = await postService.getStatisticsPost(page);
        await next();
    }

    async getChannelAndNickname(ctx, next) {
        ctx.body = await postService.getChannelAndNickname();
        await next();
    }

    async exportPost(ctx, next){
        let {q, status, channel, nickname, beginDate, endDate} = ctx.request.body;
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
        ctx.body = await postService.exportPost(query);
        await next();
    }

    async exportPostForStatistics(ctx, next){
        let {channel, beginDate, endDate} = ctx.request.body;
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
        ctx.body = await postService.exportPostForStatistics(query);
        await next();
    }

    async downloadItemFile(ctx, next) {
        const {fileName} = ctx.query;
        if(!fileName) {
            ctx.body = {err: '文件不存在'};
            return await next();
        }
        const path = `${DOWNLOAD_PATH}/${fileName}`;
        const readStream = await fs.createReadStream(path, {
            bufferSize : 1024 * 1024
        });
        ctx.body = readStream;
        ctx.set('Content-disposition', `attachment; filename=${fileName}`);
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        await fs.unlinkSync(path);
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

exports.downloadItemFile = async (ctx, next) => {
    return new postRouter().downloadItemFile(ctx, next);
};

exports.getChannelAndNickname = async (ctx, next) => {
    return new postRouter().getChannelAndNickname(ctx, next);
};

exports.exportPostForStatistics = async (ctx, next) => {
    return new postRouter().exportPostForStatistics(ctx, next);
};