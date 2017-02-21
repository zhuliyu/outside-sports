/**
 * Created by e on 17/1/24.
 */
const express = require('express');
const router = express.Router();
const request = require('request');
const config =require('../../config/development');
const MD5 = require('../../modules/util/MD5');

Buffer.prototype.toByteArray = function () {
    return Array.prototype.slice.call(this, 0)
}
/* GET home page. */
router.get('/login', (req,res)=>{
    res.render('login', { title: '登录' });
});
router.get('/regist', (req,res)=>{
    res.render('register', { title: '注册' });
});
router.post('/validate', (req,res)=>{

    const phone=req.body.phone;
    const _random= '000000'+Math.random()*100000;
    const validation=_random.slice(_random.length-4 , _random.length);
    let signArray=[];
    let params={
        accountSid: config.miaodikeji.accountSid,
        smsContent: `【仙踪】您的验证码是${validation}，30分钟输入有效。`,
        to: phone,
        timestamp: '20170125102550',
        respDataType: 'JSON',
    }
    //params.sig=MD5.MD5(signArray.concat(new Buffer(config.miaodikeji.accountSid.toByteArray(),new Buffer(config.miaodikeji.auth_token).toByteArray())));
    params.sig=MD5.MD5(config.miaodikeji.accountSid + config.miaodikeji.auth_token + params.timestamp);
    const options={
        method: 'POST',
        header:{
            ContentType: 'application/x-www-form-urlencoded',
        },
        params,
    }
    request(config.remote.message_validate, options ,(err ,data , body)=>{
        if(err){
            console.log(err);
        }
        //接口无脑返回106   ill
        //console.log(data.failList);
        //console.log(body);
    })
});
module.exports = router;
