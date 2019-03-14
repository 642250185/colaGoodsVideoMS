const mongoose = require('mongoose');
const Schema = mongoose.Schema;


exports.group = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId
    },
    groupName: String,
    groupValue: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Date,
        default: Date.now,
        index: true
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
});