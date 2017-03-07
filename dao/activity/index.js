/**
 * Created by e on 17/3/6.
 */
/**
 * Created by e on 17/2/28.
 */
const MyArticle=require('../../modules/mongoose_model/youji').article;
const Promise = require('promise');
exports.dao = {
    getSixArticles: (limit) => {
        return new Promise((resolve, reject) => {
            const query = MyArticle.find();
            query.skip(0);
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
    getSevenArticles: (limit) => {
        return new Promise((resolve, reject) => {
            const query = MyArticle.find();
            query.skip(0);
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
};