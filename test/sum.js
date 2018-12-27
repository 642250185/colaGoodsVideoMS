const _ = require('lodash');
const array = [
    {
        "status": false,
        "_id": "5c235bc1b49278c647b48500",
        "channel": "budejie",
        "nickname": "南山无颜祖1",
        "postId": "29010349",
        "title": "1399元的OPPO K1开箱，骁龙660 水滴屏，千元神机谁与争锋？",
        "playCount": 599,
        "collectCount": 0,
        "shareCount": 0,
        "commentCount": 1,
        "likeCount": 60,
        "recommendCount": 0,
        "dateTime": "2018-12-15T11:53:03.000Z",
        "createTime": "2018-12-26T10:45:21.949Z",
        "updateTime": "2018-12-26T10:45:21.949Z"
    },
    {
        "status": false,
        "_id": "5c235bc1b49278c647b484ff",
        "channel": "budejie",
        "nickname": "南山无颜祖2",
        "postId": "29010395",
        "title": "2099元的银色iPhone7开箱，上手那一刻，这应该是目前最便宜的吧",
        "playCount": 930,
        "collectCount": 0,
        "shareCount": 0,
        "commentCount": 1,
        "likeCount": 61,
        "recommendCount": 0,
        "dateTime": "2018-12-15T12:15:24.000Z",
        "createTime": "2018-12-26T10:45:21.940Z",
        "updateTime": "2018-12-26T10:45:21.940Z"
    },
    {
        "status": false,
        "_id": "5c235b69b49278c647b484ef",
        "channel": "tikTok",
        "nickname": "皮卡丘开箱v",
        "postId": "6633678436650978564",
        "title": "学生党“吃鸡神器”？不得不感叹现在的学生不一般！#三星 #手机",
        "playCount": 0,
        "collectCount": 0,
        "shareCount": 0,
        "commentCount": 1,
        "likeCount": 173,
        "recommendCount": 0,
        "dateTime": "2018-12-11T10:20:20.000Z",
        "createTime": "2018-12-26T10:43:53.088Z",
        "updateTime": "2018-12-26T10:43:53.088Z"
    },
    {
        "status": false,
        "_id": "5c235b69b49278c647b484ee",
        "channel": "tikTok",
        "nickname": "皮卡丘开箱v",
        "postId": "6634048995893185796",
        "title": "哇哦，“水滴屏”！吃鸡超帅，拿在手里超美超有面子！#手机",
        "playCount": 0,
        "collectCount": 0,
        "shareCount": 0,
        "commentCount": 8,
        "likeCount": 156,
        "recommendCount": 0,
        "dateTime": "2018-12-12T10:18:18.000Z",
        "createTime": "2018-12-26T10:43:53.084Z",
        "updateTime": "2018-12-26T10:43:53.084Z"
    },
    {
        "status": false,
        "_id": "5c235b69b49278c647b484ed",
        "channel": "tikTok",
        "nickname": "皮卡丘开箱v",
        "postId": "6634437808935144707",
        "title": "iPhone x，如今4799？小哥哥能不能给我一个？#手机 #苹果手机",
        "playCount": 0,
        "collectCount": 0,
        "shareCount": 0,
        "commentCount": 37,
        "likeCount": 652,
        "recommendCount": 0,
        "dateTime": "2018-12-13T11:27:05.000Z",
        "createTime": "2018-12-26T10:43:53.077Z",
        "updateTime": "2018-12-26T10:43:53.077Z"
    }
];


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
                if(post.nickname !== item.nickname){
                    post.titleNumber++;
                }
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
        console.info(`posts: `, posts);
        return posts;
    } catch (e) {
        console.error(e);
        return [];
    }
};


statistics(array);