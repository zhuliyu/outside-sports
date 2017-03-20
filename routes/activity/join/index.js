/**
 * Created by e on 17/3/11.
 */
const express = require('express');
const router = express.Router();
const dao  =require('../../../dao/activity');
const mysql_dao = require('../../../dao/shopping');

/*活动详情以及报名页面*/
router.get('/', (req, res) => {
    //当前用户的openId
    const openId = 'OXsoslkslskls1';
    req.session.openId = openId;
    console.log(req.session.openId);
    const { id } = req.query;
    if (!id) {
        res.render('activity/youji/error', {title: '错误'});
    }
    Promise.all([dao.dao.getActivityById(id), dao.dao.getWhetherJoin(openId, id)])
        .then((data) => {
                if (data[1].length !== 0) {
                    res.render('activity/main_activity/activity-detail', {title: '活动报名', detail: data[0][0], openId: openId, join: data[1].length, object_id: data[1][0]._id});
                } else {
                    res.render('activity/main_activity/activity-detail', {title: '活动报名', detail: data[0][0], openId: openId, join: data[1].length});
                }
            },
            (err) => {
                res.render('activity/youji/error', {title: '错误'});
            })
});
/*活动报名 表单提交方式*/
router.post('/', (req, res) => {
    const { logger } = req;
    const { join_telephone, join_openId, activity_id } = req.body;
    if (!join_telephone || !join_openId || !activity_id ) {
        res.redirect('/activity/join/error');
    }
    dao.dao.join(req.body)
        .then((data) => {
                logger.info(`openId: ${join_openId} join activity_id: ${activity_id}`);
                res.redirect('/activity/join/success');
                //按理说还要处理一层手机号存储的业务逻辑
            },
            (err) => {
                res.redirect('/activity/join/fail');
            });
});
/*查询剩余报名额度*/
router.post('/leastNum', (req, res) => {
    dao.dao.getJoinNum(req.body.activity_id)
        .then((data) => {
                res.json({result: 1, total: data})
            },
            (err) => {
                res.json({result: 0})
            })
});
/*退出活动*/
router.post('/exit', (req, res) => {
    const { logger } = req;
    if (!req.body._id) {
        res.json({result: 0});
    }
    dao.dao.exitActivity(req.body._id)
        .then((data) => {
                logger.info(`openId: ${req.session.openId} exit activity object_id: ${req.body._id}`);
                res.json({result: 1})
            },
            (err) => {
                res.json({result: 0})
            })
});
/*删除活动*/
router.post('/cancel', (req, res) => {
    if (!req.body.activity_id) {
        res.json({result: 0});
    }
    dao.dao.cancelActivity(req.body.activity_id)
    .then((data) => {
        res.json({result: 1});
    },
        (err) => {
            res.json({result: 0});
        })
});
router.get('/success', (req, res) => {
    res.render('activity/main_activity/success', {title: '报名成功'});
});
router.get('/fail', (req, res) => {
    res.render('activity/main_activity/fail', {title: '报名失败'});
});
module.exports = router;