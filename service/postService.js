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
        const posts = [];
        const map = new Map();
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
                fansCount       : 0,
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


// ============================ 分割线 ===========================//

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
        page.total = total;
        let items = await query.exec();
        items = await statistics(items);
        page.items = items;
        return page.getResult();
    } catch (e) {
        console.error(e);
        return page.getResult();
    }
};


const getChannelAndNickname = async(page) => {
    try {
        let query = $post.find(page.q);
        let countQuery = $post.countDocuments(page.q);
        const total = await countQuery.exec();
        if(total === 0){
            page.items = [];
            return page.getResult();
        }
        page.total = total;
        let items = await query.exec();
        items = await filterChannelAndNickname(items);
        page.items = items;
        return page.getResult();
    } catch (e) {
        console.error(e);
        return page.getResult();
    }
};


const exportPost = async(args) => {
    try {
        let posts = await $post.find(args);
        console.info('导出的数据量: ', posts.length);
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


const exportStatisticsPost = async(args) => {
    try {
        let posts = await $post.find(args);
        posts = await statistics(posts);
        console.info('导出的数据量: ', posts.length, posts);
        const postTable = [];
        const header = ['平台','标题数','播放量','收藏数','转发数','评论数','点赞数','推荐数','粉丝数'];
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
            row.push(post.fansCount);
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


exports.getAll = getAll;
exports.exportPost = exportPost;
exports.getStatisticsPost = getStatisticsPost;
exports.exportStatisticsPost = exportStatisticsPost;
exports.getChannelAndNickname = getChannelAndNickname;