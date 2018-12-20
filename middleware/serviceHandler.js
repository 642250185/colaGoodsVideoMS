const service = require('../service');
const launchService = async (ctx, next) => {
    if(global[`ServiceCreated`]){
        return await next();
    }
    await service.initServer();
    await next();
};


exports.launchService = launchService;