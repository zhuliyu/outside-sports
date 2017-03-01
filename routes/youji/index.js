/**
 * Created by e on 17/2/27.
 */
const express = require('express');
const getPCOrPhone = require('../../modules/getPCOrPhone');
const dao = require('../../dao/youji');
const router = express.Router();

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

router.all('*', function(req, res, next) {
    if(!req.headers['user-agent'].match('MicroMessenger')){
        res.render('errorUserAgent', { title: 'error' });
    }
    next();
});
/* GET home page. */
/*游记主页  所有游记 往下刷*/
router.get('/', (req, res) => {
    dao.dao.getAllArticles(1, 10)
    .then((data) => {
        for(let i = 0; i < data.length; i++) {
            data[i].date = new Date(data[i].date).Format("yyyy-MM-dd");
        }
        res.render('activity/youji/index', {title: '游记', article_list: data});
    },
        (err) => {
            res.render('activity/youji/error', {title: 'error'});
        })
});

/*我的游记 根据openID获取articles_list*/
router.get('/myArticles', (req, res) => {
    const openId = 'OXsoslkslskls';
    dao.dao.getMyArticles(openId, 1, 10)
    .then((data) => {
        for(let i = 0; i < data.length; i++) {
            data[i].date = new Date(data[i].date).Format("yyyy-MM-dd");
        }
        res.render('activity/youji/myArticle', {title: '我的游记', article_list: data});
    },
        (err) => {
            res.render('activity/youji/error', {title: 'error'});
        });

});

/*根据article_id获取文章内容 先增加阅读量然后展示到页面*/
router.get('/read', (req, res) => {
    const id = req.query.id;
    if (id) {
        //先增加阅读量
        dao.dao.increaseReadNum(id)
        .then((data) => {
            dao.dao.getArticleById(id)
                .then((data) => {
                        data[0].date = new Date(data[0].date).Format("yyyy-MM-dd");
                        res.render('activity/youji/read', {title: '游记', article: data });
                    },
                    (err) => {
                        res.render('activity/youji/error', {title: 'error'});
                    })
        },
            (err) => {
                res.render('activity/youji/error', {title: 'error'});
            })
    } else {
        res.render('activity/youji/error', {title: 'error'});
    }
});

/*文章首页加载更多*/
router.post('/', (req, res) => {
    dao.dao.getAllArticles(req.body.page, 10)
        .then((data) => {
                for(let i = 0; i < data.length; i++) {
                    data[i].date = new Date(data[i].date).Format("yyyy-MM-dd");
                }
                res.json(data);
            },
            (err) => {
                console.log(err);
            })
});

/*我的游记加载更多*/
router.post('/myArticles', (req, res) => {
    const openId = 'OXsoslkslskls';
    dao.dao.getMyArticles(openId, req.body.page, 10)
        .then((data) => {
                for(let i = 0; i < data.length; i++) {
                    data[i].date = new Date(data[i].date).Format("yyyy-MM-dd");
                }
                res.json(data);
            },
            (err) => {
                console.log(err);
            })
});

/*根据id删除文章*/
router.post('/myArticles/delete', (req, res) => {
    dao.dao.deleteArticleById(req.body.id)
    .then((data) => {
        res.json({result: 1});
    },
        (err) => {
            res.json({result: 0});
        })
});

/*文章点赞系统*/
router.post('/read/zan', (req, res) => {
    dao.dao.zan(req.body.id);
});
module.exports = router;
