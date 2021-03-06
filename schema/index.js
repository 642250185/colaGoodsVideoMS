const mongoose = require('mongoose');
const config = require('../config/cfg');

const {host, port, dbname} = config.mongodb;

mongoose.connect(`mongodb://${host}:${port}/${dbname}`,{useNewUrlParser: true});
mongoose.Promise = global.Promise;
global.$mongoose = mongoose;

/**
 * 设置数据源
 */
const syncDB = () => {
    const {post} = require('../model/post');
    const {group} = require('../model/group');
    global['$post'] = mongoose.model('post', post, 'post');
    global['$group'] = mongoose.model('group', group, 'group');
};

syncDB();