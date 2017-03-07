/**
 * Created by e on 17/2/26.
 * 游记表
 */
require('../mongoConfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Article_Schema = new Schema({
    article_id: String,
    openId: String,
    title: String,
    author: String | null,
    cover: String,
    content: String,        //带标签的html
    contentText: String,    //纯文本
    date: Date | null,
    read: Number,
    good: Number,
}, {
    versionKey: false,
});

const MyArticle = mongoose.model("Article", Article_Schema);
exports.article = MyArticle;