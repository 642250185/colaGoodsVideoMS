const uuid = require('uuid');
const mongoose = require('mongoose');


const checkGroupName = async(groupName) => {
    try {
        const item = await $group.findOne({groupName: groupName});
        if(item){
            return true;
        }
        return false;
    } catch (e) {
        console.error(e);
        return e;
    }
};


const getGroupByName = async() => {
    try {
        const item = await $group.find({}).sort({"groupValue":-1});
        return item[0].groupValue;
    } catch (e) {
        console.error(e);
        return e;
    }
};


const add = async(groupName) => {
    try {
        const isCheck = await checkGroupName(groupName);
        if(isCheck){
            return {err: "分组已存在"}
        }
        const groupValue = await getGroupByName();
        const _group = {};
        _group._id = new mongoose.Types.ObjectId;
        _group.groupName = groupName;
        _group.groupValue = groupValue + 1;
        const group = new $group(_group);
        await group.save();
        return {err: null};
    } catch (e) {
        console.error(e);
        return [];
    }
};


const del = async(_id) => {
    try {
        await $group.remove({_id: _id});
        return {err: null}
    } catch (e) {
        console.error(e);
        return {err: "删除失败"};
    }
};


const list = async(page) => {
    try {
        let query = $group.find(page.q);
        let countQuery = $group.countDocuments(page.q);
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
        return [];
    }
};


exports.add = add;
exports.del = del;
exports.list = list;