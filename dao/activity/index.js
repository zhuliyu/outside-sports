/**
 * Created by e on 17/3/6.
 */
/**
 * Created by e on 17/2/28.
 */
const MyArticle=require('../../modules/mongoose_model/youji').article;
const Activity=require('../../modules/mongoose_model/activity').activity;
const Activity_assign=require('../../modules/mongoose_model/activity-assign').activityAssign;
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
    saveActivity: (data) => {
        return new Promise((resolve, reject) => {
            const beta = new Activity(data);
            beta.save((err, body) => {
                if (err) {
                    reject(err);
                }
                resolve(body);
            })
        })
    },
    getActivity: (page, limit) => {
        return new Promise((resolve, reject) => {
            const query = Activity.find({});
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
    getNumOfActivity: () => {
        return new Promise((resolve, reject) => {
            Activity.find({}, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs.length);
            })
        })
    },
    getActivityById: (id) => {
        return new Promise((resolve, reject) => {
            Activity.find({activity_id: id}, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            })
        })
    },
    getWhetherJoin: (openId, activity_id) => {
        return new Promise((resolve, reject) => {
            Activity_assign.find({activity_id: activity_id, join_openId: openId}, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            })
        })
    },
    join: (data) => {
        return new Promise((resolve, reject) => {
            const beta = new Activity_assign(data);
            beta.save((err, body) => {
                if (err) {
                    reject(err);
                }
                resolve(body);
            })
        })
    },
    getJoinNum: (activity_id) => {
        return new Promise((resolve, reject) => {
            Activity_assign.find({activity_id: activity_id}, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs.length);
            })
        })
    },
    exitActivity: (object_id) => {
        return new Promise((resolve, reject) => {
            Activity_assign.remove({_id: object_id.split('"')[1]}, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            })
        })
    },
};