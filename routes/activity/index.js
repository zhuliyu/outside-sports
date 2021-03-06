/**
 * Created by e on 17/2/28.
 */
const express = require('express');
const router = express.Router();
const Promise =  require('promise');
const dao  =require('../../dao/activity');

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
router.get('/', (req,res) => {
    const { logger }  = req;
    Promise.all([dao.dao.getSixArticles(10), dao.dao.getSevenArticles(7)])
    .then((data) => {
        res.render('activity/main_activity/index', {title: '活动', article_list: data[0]});
    },
        (err) => {
            res.render('activity/youji/error', {title: '错误'});
        });
});
/*点击aa约伴进入*/
router.get('/gather', (req, res) => {
    Promise.all([dao.dao.getActivity(1, 10), dao.dao.getNumOfActivity()])
    .then((data) => {
            for(let i = 0; i < data[0].length; i++) {
                data[0][i].date = new Date(data[0][i].date).Format("yyyy-MM-dd hh:mm");
            }
            res.render('activity/main_activity/gather', {title: 'AA约伴', activityList: data[0], total: data[1]});
    },
        (err) => {
            res.render('activity/youji/error', {title: '错误'});
        });

});
/*查询活动列表下一页*/
router.post('/gather', (req, res) => {
    const page = req.body.page;
    const limit = req.body.limit;
    if (!page || !limit) {
        res.json({result: 0});
    } else {
        dao.dao.getActivity(page, limit)
            .then((data) => {
                    for(let i = 0; i < data.length; i++) {
                        data[i].date = new Date(data[i].date).Format("yyyy-MM-dd hh:mm");
                    }
                    res.json({result: 1, data: data});
                },
                (err) => {
                    res.json({result: 0})
                });
    }
});
/*民间活动发布版本*/
router.get('/launch', (req, res) => {
    res.render('activity/main_activity/launch_activity' ,{title: '召集令'});
});
/*新增活动*/
router.post('/launch', (req, res) => {
    const { logger } = req;
    const type = req.body.type;
    if (type == 1) {
        req.body.launcher_openId = 'OXsoslkslskls';
    } else {
        req.body.launcher_openId = '';
    }
    req.body.activity_id = Math.random()*1000000 + new Date().getTime();
    req.body.end_date = new Date(req.body.end_date);
    req.body.date = new Date();
    dao.dao.saveActivity(req.body)
    .then((data) => {
        res.send('1');
    },
        (err) => {
            logger.error(`openID: ${req.body.launcher_openId} save error: ${err}`);

        })
});


module.exports = router;