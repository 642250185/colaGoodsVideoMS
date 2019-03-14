const fs = require('fs-extra');
const config = require('../config/cfg');

const pagination = require('../model/pagination');
const {postService, groupService} = require('../service');

const {DOWNLOAD_PATH} = config;

const postRouter = class postRouter {

    async getStatisticsPlayCount(ctx, next){
        let {q, status, channel, nickname, groupValue, min, max, beginDate, endDate} = ctx.request.query;
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
        if(groupValue){
            query.group = groupValue;
        }
        if(min && !max){
            query["$and"] = [
                {"playCount": {$gte: min}}
            ]
        }
        if(min && max){
            query["$and"] = [
                {"playCount": {$gte: min}},
                {"playCount": {$lte: max}}
            ]
        }
        if(beginDate && endDate){
            query["$and"] = [
                {"dateTime": {$gte: new Date(beginDate)}},
                {"dateTime": {$lte: new Date(endDate)}}
            ];
        }
        ctx.body = await postService.getStatisticsPlayCount(query);
        await next();
    }

    async getAll(ctx, next) {
        let {index, size, q, status, orderBy, order, channel, nickname, groupValue, min, max, beginDate, endDate} = ctx.request.query;
        let page = new pagination({index, size, orderBy, order});
        let query = {};
        if(q){
            q = decodeURIComponent(q);
            query['$or'] = [
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
        if(groupValue){
            query.group = groupValue;
        }
        if(min && !max){
            query["$and"] = [
                {"playCount": {$gte: parseInt(min)}}
            ]
        }
        if(min && max){
            query["$and"] = [
                {"playCount": {$gte: parseInt(min), $lte: parseInt(max)}}
            ]
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

    async getUsernameByChannel(ctx, next) {
        let {channel} = ctx.request.body;
        ctx.body = await postService.getUsernameByChannel(channel);
        await next();
    }

    async exportPost(ctx, next){
        let {q, status, channel, nickname, groupValue, min, max, beginDate, endDate} = ctx.request.body;
        let query = {};
        if(q){
            q = decodeURIComponent(q);
            query['$or'] = [
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
        if(groupValue){
            query.group = groupValue;
        }
        if(min && !max){
            query["$and"] = [
                {"playCount": {$gte: parseInt(min)}}
            ]
        }
        if(min && max){
            query["$and"] = [
                {"playCount": {$gte: parseInt(min), $lte: parseInt(max)}}
            ]
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

    async getGroupList(ctx, next) {
        const {channel, nickname, groupValue} = ctx.request.query;
        let query = {};
        if(channel){
            query.channel = channel;
        }
        if(nickname){
            query.nickname = nickname;
        }
        if(groupValue){
            query.group = groupValue;
        }
        ctx.body = await postService.getGroupList(query);
        await next();
    }

    async updateGroup(ctx, next) {
        const arr_args = ctx.request.body;
        ctx.body = await postService.updateGroup(arr_args);
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

    async add(ctx, next){
        let {groupName} = ctx.request.body;
        ctx.body = await groupService.add(groupName);
        await next();
    }

    async del(ctx, next){
        let {_id} = ctx.request.body;
        ctx.body = await groupService.del(_id);
        await next();
    }

    async list(ctx, next){
        let {size, orderBy, order} = ctx.request.query;
        let page = new pagination({size, orderBy, order});
        let query = {};
        page.q = query;
        ctx.body = await groupService.list(page);
        await next();
    }
};


exports.getAll = async (ctx, next) => {
    return new postRouter().getAll(ctx, next);
};

exports.exportPost = async (ctx, next) => {
    return new postRouter().exportPost(ctx, next);
};

exports.updateGroup = async (ctx, next) => {
    return new postRouter().updateGroup(ctx, next);
};

exports.getGroupList = async (ctx, next) => {
    return new postRouter().getGroupList(ctx, next);
};

exports.getStatisticsPost = async (ctx, next) => {
    return new postRouter().getStatisticsPost(ctx, next);
};

exports.downloadItemFile = async (ctx, next) => {
    return new postRouter().downloadItemFile(ctx, next);
};

exports.getUsernameByChannel = async (ctx, next) => {
    return new postRouter().getUsernameByChannel(ctx, next);
};

exports.getChannelAndNickname = async (ctx, next) => {
    return new postRouter().getChannelAndNickname(ctx, next);
};

exports.getStatisticsPlayCount = async (ctx, next) => {
    return new postRouter().getStatisticsPlayCount(ctx, next);
};

exports.exportPostForStatistics = async (ctx, next) => {
    return new postRouter().exportPostForStatistics(ctx, next);
};

exports.add = async (ctx, next) => {
    return new postRouter().add(ctx, next);
};

exports.del = async (ctx, next) => {
    return new postRouter().del(ctx, next);
};

exports.list = async (ctx, next) => {
    return new postRouter().list(ctx, next);
};