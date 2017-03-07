/**
 * Created by e on 17/2/28.
 */
const express = require('express');
const router = express.Router();
const Promise =  require('promise');
const dao  =require('../../dao/activity');

router.get('/', (req,res) => {
    const { logger }  = req;
    Promise.all([dao.dao.getSixArticles(10), dao.dao.getSevenArticles(7)])
    .then((data) => {
        res.render('activity/main_activity/index', {title: '活动', article_list: data[0]});
    },
        (err) => {
            logger.error('request err: '+ err);
            res.render('activity/youji/error', {title: '错误'});
        });
});
router.get('/gather', (req, res) => {
    const { logger } = req;
    const type = req.query.type;
    //if (!type) {
    //    logger.warn('no type in url');
    //    res.render('activity/youji/error', {title: '错误'});
    //}
    //根据type查询相关活动
    res.render('activity/main_activity/gather');
});
router.get('/launch', (req, res) => {
    res.render('activity/main_activity/launch_activity' ,{title: '召集令'});
});
module.exports = router;