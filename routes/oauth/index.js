const express = require('express');
const router = express.Router();
const request  = require('request');
const config = require('../../config/development');

router.get('/', (req, res) => {
    const appId = config.weixin.appId;
    const url = `https://localhost:80/oauth/jump`;
    const re_url = encodeURI(url);
    console.log(re_url);
    res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${re_url}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`);
});

router.get('/jump', (req, res) => {
    console.log('>>>>');
});

module.exports = router;