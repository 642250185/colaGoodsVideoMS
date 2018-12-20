const path = require('path');

const config = {
    mongodb: {
        host: '127.0.0.1',
        port: 27017,
        dbname: 'colaGoods'
    },
    env: function () {
        global.$config = this;
        return global.$config;
    }
};


module.exports = config.env();