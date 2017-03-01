/**
 * Created by e on 17/2/28.
 */
const MyArticle=require('../../modules/mongoose_model/youji').article;
const Promise = require('promise');
exports.dao = {
    getAllArticles: (page, limit) => {
        return new Promise((resolve, reject) => {
            const query = MyArticle.find({});
            query.skip((page-1)*limit);
            query.limit(limit);
            query.sort({'date': -1});
            query.exec(function(err, docs){
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        })
    },
    getMyArticles: (openId, page, limit) => {
        return new Promise((resolve, reject) => {
            const query = MyArticle.find({openId: openId});
            query.skip((page-1)*limit);
            query.limit(limit);
            query.sort({'date': -1});
            query.exec(function(err, docs){
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        })
    },
    getArticleById: (id) => {
        return new Promise((resolve, reject) => {
            MyArticle.find({article_id: id}, (err, docs) => {
                if (err) {
                     reject(err);
                }
                resolve(docs);
            })
        })
    },
    deleteArticleById: (id) => {
        return new Promise((resolve, reject) => {
            MyArticle.remove({article_id: id}, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            })
        })
    },
    increaseReadNum: (id) => {
        return new Promise((resolve, reject) => {
            MyArticle.update({article_id: id}, {$inc: {read: +1}}, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            })
        })
    },
    zan: (id) => {
        return new Promise((resolve, reject) => {
            MyArticle.update({article_id: id}, {$inc: {good: +1}}, (err, docs) => {
                if (err) {
                    reject(err);
                }
                console.log(docs);
                resolve(docs);
            })
        })
    },
};