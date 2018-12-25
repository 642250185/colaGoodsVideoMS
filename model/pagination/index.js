module.exports = class Pageination {

    constructor(params) {
        if(!params) {
            params = {};
        }
        this.q                  = params.q || {};
        this.index              = Number(params.index) || 0;
        this.size               = Number(params.size) || 20;
        this.skip               = this.index * this.size;
        this.total              = params.total || 0;
        this.orderBy            = params.orderBy || 'createTime';
        this.order              = Number(params.order) || -1;
        this.sort               = {};
        this.sort[this.orderBy] = this.order;
    }

    getResult() {
        return {
            pageinfo: {
                index   : this.index,
                size    : this.size,
                total   : this.total
            },
            items: this.items
        };
    }
};