var express = require('express');
var router = express.Router();
const clientPool = require('../modules/redisPool');

//router.all('*', function(req, res, next) {
//    if(req.headers['user-agent'].match('MicroMessenger')){
//
//    }else{
//        res.render('errorUserAgent', { title: 'error' });
//    }
//    next();
//});
/* GET home page. */
router.get('/xianzong', function(req, res, next) {
    res.render('index', { title: '仙踪' });
});

router.get('/xianzong/add_in_redis', function(req, res, next) {
  //打开redis连接
  const TICKET_DB_INDEX = 6;
  clientPool(TICKET_DB_INDEX)
      .then(clientCli => {
        clientCli.set("string key", "string val0" , (err , reply) => {
          if(err){
            console.log(err);
            return ;
          }
          if(reply.toString() == 'OK'){
            res.send('OK');
          }else{
            res.send('error in redis');
          }
        })
      });
});


router.get('/xianzong/show_in_redis', function(req, res, next) {
  //打开redis连接
  const TICKET_DB_INDEX = 6;
  clientPool(TICKET_DB_INDEX)
      .then((clientCli) => {
        clientCli.get("string key",(err , reply) => {
          if(err){
            console.log(err);
            return ;
          }
          res.send(reply.toString());
        })
      })
});
module.exports = router;
