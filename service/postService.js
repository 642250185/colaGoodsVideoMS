const mongoose = require('mongoose');
const pagination = require('../model/pagination');

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


const getAllnickname = async(page) => {
    try {
        let query = $post.find(page.q);
        let countQuery = $post.countDocuments(page.q);
        const total = await countQuery.exec();
        if(total === 0){
            page.items = [];
            return page.getResult();
        }
        page.total = total;
        const items = await query.exec();
        page.items = items;
        return page.getResult();
    } catch (e) {
        console.error(e);
        return page.getResult();
    }
};

exports.getAll = getAll;
exports.getAllnickname = getAllnickname;