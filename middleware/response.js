module.exports = async (ctx, next) => {
    switch (ctx.status) {
        case 401:
            ctx.body = {success: false, err: '请先登录'};
            break;
        case 404:
            ctx.body = {success: false, err: '您请求的地址飞到火星了.'};
            break;
        case 400:
            ctx.body = {success: false, err: '请求参数异常.'};
            break;
        case 403:
            ctx.body = {success: false, err: '你没有权限执行该操作'};
            break;
        case 500:
            ctx.body = {success: false, err: '服务器异常, 请联系管理人员'};
            break;
        default:
            if(ctx.request.method !== 'GET') {
                const {err} = ctx.body;
                if(err) {
                    ctx.body = {success: false, err};
                } else {
                    ctx.body['success'] = true;
                }
            }

    }
    await next();
};
