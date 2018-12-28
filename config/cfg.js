const path = require('path');

const config = {
    mongodb: {
        host: '10.0.10.230',
        port: 27017,
        dbname: 'colaGoods'
    },
    Sheet:{
        postSheet: "分表",
        statisticsPostSheet: "总表"
    },
    DOWNLOAD_PATH: path.join(__dirname, '..','download'),
    env: function () {
        global.$config = this;
        return global.$config;
    }
};


module.exports = config.env();