const postService = require('./postService');

const initService = () => {
    global[`postService`] = postService;

};

exports.initServer = async () => {
    initService();
    global[`ServiceCreated`] = true;
};