const _ = require('lodash');
const fs = require('fs-extra');
const moment = require('moment');
const config = require('../config/cfg');
const xlsx = require('node-xlsx').default;

const {DOWNLOAD_PATH} = config;
const {postSheet, statisticsPostSheet} = config.Sheet;

/**
 * 筛选平台和昵称
 * @param items 所有帖子集合
 * @returns {Promise<*>}
 */
const filterChannelAndNickname = async(items) => {
    try {
        const channels = [];
        const nickNames = [];
        const channelMap = new Map();
        const nicknameMap = new Map();
        for(let item of items){
            const nickname = item.nickname;
            const channel = item.channel;
            if(!channelMap.get(channel)){
                channelMap.set(channel, channel);
            }
            if(!nicknameMap.get(nickname)){
                nicknameMap.set(nickname, nickname);
            }
        }
        for(const [key, value] of channelMap.entries()){
            channels.push(value);
        }
        for(const [key, value] of nicknameMap.entries()){
            nickNames.push(value);
        }
        return {channels, nickNames};
    } catch (e) {
        console.error(e);
        return {};
    }
};

/**
 * 全局导出命名
 * @param sheet
 * @returns {string}
 * @private
 */
const _generateFileName = (sheet) => {
    const timeStr = `${moment().format('YYYY-MM-DD-HH-mm-ss')}.xlsx`;
    return `${sheet}-${timeStr}`;
};

/**
 * 统计帖子的各个数值的总和
 * @param array 帖子结果集
 * @returns {Promise<Array>}
 */
const statistics = async(array) => {
    try {
        let totalFansCount = {};
        const posts = [];
        const map = new Map();
        const channelNicknameMap = new Map();
        for(const item of array){
            let post = map.get(item.channel);
            if(!post){
                item.titleNumber = 1;
                map.set(item.channel, item);
            } else {
                post.titleNumber++;
                post.playCount      += item.playCount;
                post.collectCount   += item.collectCount;
                post.shareCount     += item.shareCount;
                post.commentCount   += item.commentCount;
                post.likeCount      += item.likeCount;
                post.recommendCount += item.recommendCount;

                const _fansCount = channelNicknameMap.get(post.nickname);
                if(!_fansCount){
                    channelNicknameMap.set(post.nickname, post.fansCount);
                }
            }
        }

        for(const [key, value] of map.entries()){
            posts.push({
                channel         : value.channel,
                titleNumber     : value.titleNumber,
                playCount       : value.playCount,
                collectCount    : value.collectCount,
                shareCount      : value.shareCount,
                commentCount    : value.commentCount,
                likeCount       : value.likeCount,
                recommendCount  : value.recommendCount,
                fansCount       : value.fansCount,
            });
        }
        return posts;
    } catch (e) {
        console.error(e);
        return [];
    }
};

/**
 * 统计总的播放量和总的标题数量
 * @param items 已经统计的帖子各个数值的总和
 * @returns {Promise<*>}
 */
const getTotalStatistics = async(items) => {
    try {
        let totalPlayCount = 0, totalTitleNumber = 0;
        for(const post of items){
            totalPlayCount = totalPlayCount + post.playCount;
            totalTitleNumber = totalTitleNumber + post.titleNumber;
        }
        return {totalPlayCount, totalTitleNumber}
    } catch (e) {
        console.error(e);
        return e;
    }
};


const _filterChannel = async(items) => {
    try {
        const map = new Map();
        const channelList = [];
        for(const item of items){
            const {postId, channel} = item;
            const key_channel = map.get(channel);
            if(!key_channel){
                map.set(channel, postId);
            }
        }
        for(const [key, value] of map.entries()){
            channelList.push(key);
        }
        return channelList;
    } catch (e) {
        console.error(e);
        return [];
    }
};


const _getGroupName = async(value) => {
    try {
        const item = await $group.findOne({groupValue: value});
        if(_.isEmpty(item)){
            return "未分组";
        }
        return item.groupName;
    } catch (e) {
        console.error(e);
        return e;
    }
};

const _filterChannelAndNickname = async(list, items) => {
    try {
        let result = [];
        for(const _channel of list){
            const map1 = new Map();
            for(const item of items){
                const {channel, nickname, group} = item;
                if(channel == _channel){
                    const _nickname = map1.get(nickname);
                    if(!_nickname){
                        map1.set(nickname, group);
                    }
                }
            }
            const final = [];
            for(const [key, value] of map1.entries()){
                const groupName = await _getGroupName(value);
                final.push({channel: _channel, nickname: key, group: groupName});
            }
            result = result.concat(final);
        }
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
};



// ============================ 分割线 ===========================//


const getStatisticsPlayCount = async(page) => {
    try {
        let query = $post.find(page);
        let countQuery = $post.countDocuments(page);
        const total = await countQuery.exec();
        const items = await query.exec();
        console.info(`items.size: ${items.length}`);
        let playCountSum = 0;
        for(const item of items){
            playCountSum = playCountSum + item.playCount;
        }
        return {playCountSum, titleCountSum: total};
    } catch (e) {
        console.error(e);
        return e;
    }
};


const getAll = async (page) => {
    try {
        let query = $post.find(page.q);
        let countQuery = $post.countDocuments(page.q);
        const total = await countQuery.exec();
        if(total == 0){
            page.items = [];
            return page.getResult();
        }
        page.total = total;
        query.limit(page.size);
        query.skip(page.skip);
        query.sort(page.sort);
        const items = await query.exec();
        for(const item of items){
            item.groupName = await _getGroupName(item.group);
        }
        page.items = items;
        return page.getResult();
    } catch (e) {
        console.error(e);
        return page.getResult();
    }
};


const getStatisticsPost = async (page) => {
    try {
        let query = $post.find(page.q);
        let countQuery = $post.countDocuments(page.q);
        const total = await countQuery.exec();
        if(total == 0){
            page.items = [];
            return page.getResult();
        }
        let items = await query.exec();
        items = await statistics(items);
        page.total = items.length;
        page.items = items;
        return page.getResult();
    } catch (e) {
        console.error(e);
        return page.getResult();
    }
};


const getChannelAndNickname = async() => {
    try {
        let query = $post.find();
        let countQuery = $post.countDocuments();
        const total = await countQuery.exec();
        if(total === 0){
            return {err: null, message: "没有数据"};
        }
        let items = await query.exec();
        items = await filterChannelAndNickname(items);
        return {err: null, items};
    } catch (e) {
        console.error(e);
        return {err: e, message: "没有数据"};
    }
};


const getUsernameByChannel = async(channel) => {
    try {
        let query = $post.find({channel: channel});
        let countQuery = $post.countDocuments();
        const total = await countQuery.exec();
        if(total === 0){
            return {err: null, message: "没有数据"}
        }
        let items = await query.exec();
        const map = new Map();
        for(const item of items){
            const {nickname} = item;
            const value = map.get(nickname);
            if(!value){
                map.set(nickname, item.postId);
            }
        }
        const final = [];
        for(const [key, value] of map.entries()){
            final.push(key);
        }
        return final;
    } catch (e) {
        console.error(e);
        return {err: e, message: "没有数据"};
    }
};


const exportPost = async(args) => {
    try {
        let posts = await $post.find(args);
        console.info('分表导出的数据量: ', posts.length);
        const postTable = [];
        const header = ['平台','账号','标题','播放量','收藏数','转发数','评论数','点赞数','推荐数','时间'];
        postTable.push(header);
        for(const post of posts){
            const row = [];
            row.push(post.channel);
            row.push(post.nickname);
            row.push(post.title);
            row.push(post.playCount);
            row.push(post.collectCount);
            row.push(post.shareCount);
            row.push(post.commentCount);
            row.push(post.likeCount);
            row.push(post.recommendCount);
            row.push(post.dateTime);
            postTable.push(row);
        }
        const fileName = _generateFileName(postSheet);
        const fileDir = `${DOWNLOAD_PATH}/${fileName}`;
        await fs.ensureDir(DOWNLOAD_PATH);
        fs.writeFileSync(fileDir, xlsx.build([{name: "分表数据",data: postTable}]));
        return {err: null, fileName};
    } catch (e) {
        console.error(e);
        return {err: '导出数据失败, 请联系管理员'};
    }
};


const exportPostForStatistics = async(args) => {
    try {
        let posts = await $post.find(args);
        posts = await statistics(posts);
        console.info('总表导出的数据量: ', posts.length);
        const postTable = [];
        const header = ['平台','标题数','播放量','收藏数','转发数','评论数','点赞数','推荐数'];
        postTable.push(header);
        for(const post of posts){
            const row = [];
            row.push(post.channel);
            row.push(post.titleNumber);
            row.push(post.playCount);
            row.push(post.collectCount);
            row.push(post.shareCount);
            row.push(post.commentCount);
            row.push(post.likeCount);
            row.push(post.recommendCount);
            // row.push(post.fansCount);
            postTable.push(row);
        }
        const fileName = _generateFileName(statisticsPostSheet);
        const fileDir = `${DOWNLOAD_PATH}/${fileName}`;
        await fs.ensureDir(DOWNLOAD_PATH);
        fs.writeFileSync(fileDir, xlsx.build([{name: "总表表数据",data: postTable}]));
        return {err: null, fileName};
    } catch (e) {
        console.error(e);
        return {err: '导出数据失败, 请联系管理员'};
    }
};


const getGroupList = async(args) => {
    try {
        console.info(`args: ${args}`);
        let channelList = [];
        let query = $post.find(args);
        const items = await query.exec();
        if(!args.group){
            channelList = await _filterChannel(items);
        } else {
            channelList.push(args.channel);
        }
        const result = await _filterChannelAndNickname(channelList, items);
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
};


const updateGroup = async(arr_args) => {
    try {
        for(const item of arr_args){
            const {channel, nickname, groupValue} = item;
            const set = {}; set[`group`] = groupValue;
            await $post.update({channel: channel, nickname: nickname}, {$set: set}, {multi:true});
        }
        return {err: null};
    } catch (e) {
        console.error(e);
        return {err: "更改失败"};
    }
};


exports.getAll = getAll;
exports.exportPost = exportPost;
exports.updateGroup = updateGroup;
exports.getGroupList = getGroupList;
exports.getStatisticsPost = getStatisticsPost;
exports.getUsernameByChannel = getUsernameByChannel;
exports.getChannelAndNickname = getChannelAndNickname;
exports.getStatisticsPlayCount = getStatisticsPlayCount;
exports.exportPostForStatistics = exportPostForStatistics;