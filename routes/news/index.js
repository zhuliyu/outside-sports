const express = require('express');
const getPCOrPhone = require('../../modules/getPCOrPhone');
const Busboy = require('busboy');
const http = require('http');
const MyArticle=require('../../modules/mongoose_model/youji').article;
const dao = require('../../dao/youji');
const router = express.Router();

//router.all('*', function(req, res, next) {
//    const deviceAgent = req.headers['user-agent'];
//    if (!getPCOrPhone.getPCorPhone(deviceAgent)) {
//        console.log('请使用PC端应用');
//    }
//    next();
//});
/* GET home page. */
router.get('/travelNotes/add', (req, res) => {
    res.render('mapnews/youji-article', {title: '游记发布系统'});
});

router.get('/travelNotes/edit', (req, res) => {
    console.log(req.query.id);
    const id = req.query.id;
    if (id) {
        dao.dao.getArticleById(id)
        .then((data) => {
            console.log(data);
                res.render('mapnews/edit-article', {title: '编辑', article: data[0]});
        },
            (err) => {
                res.render('activity/youji/error', {title: 'error'});
            })
    } else {
        res.render('activity/youji/error', {title: 'error'});
    }

});

//封面图片上传wosai接口
router.post('/travelNotes/upload',function(req, res){
    const busboy = new Busboy({headers: req.headers});
    busboy.on('file', function (field_name, file, filename, encoding, mimetype) {
        file.pipe(http.request({
            host: 'upay-side.dev.shouqianba.com',
            path: '/rpc/image/upload/' + /image\/(\w+)/.exec(mimetype)[1],
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Cache-Control": "no-cache"
            }
        }, function (response) {
            var data = "";
            response.on("data", function (thunk) {
                data += thunk;
            });
            response.on("end", function () {
                var json = {image: "https://images.wosaimg.com/" + data.match(/"(.+)"/)[1]};
                console.log(json);
                res.json(json);
            });
        }));
    });
    req.pipe(busboy);
});
//保存文章
router.post('/travelNotes/save',function(req, res){
    req.body.article_id = Math.random()*1000000 + new Date().getTime();
    req.body.openId = 'OXsoslkslskls';
    req.body.author = '周小e';
    const beta = new MyArticle(req.body);
    beta.save((err, body) => {
        if (err) {
            console.log(err);
        }
        res.send('1');
    })
});
//更新文章
router.post('/travelNotes/update',function(req, res){
    req.body.article_id = Math.random()*1000000 + new Date().getTime();
    console.log(req.body);
    const id = req.body.id;
    MyArticle.update({article: id}, {$set: req.body}, (err, body) => {
        if (err) {
            res.json({result: 0});
        }
        if (body.ok == 1) {
            res.json({result : 1});
        } else {
            res.json({result: 0});
        }
    })
});
module.exports = router;
