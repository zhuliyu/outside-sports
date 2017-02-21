/**
 * Created by Session on 16/8/16.
 */
var url = require('url');
var path = require('path');
var alipayOAuth = require('../../../modules/oAuth/alipayOAuth');
var config = require('../../../conf')();

module.exports = function (req, res, next, options) {
    var logger = req.logger;

    logger.trace('alipay auth impl is executing');

    req.session.loginIdentify = 'openId';

    if (req.session.openId) {
        logger.trace('find openId in session.');
        return next();
    }

    if (req.cookies.openId) {
        logger.info('find openId in cookies.');
        req.session.openId = req.cookies.openId;
        return next();
    }

    var currentUrl = req.currentFullUrl;
    var parsedUrl = url.parse(currentUrl, true);
    delete parsedUrl.query.auth_code;
    delete parsedUrl.search;
    currentUrl = url.format(parsedUrl);

    if (req.query.auth_code) {
        logger.trace('start invokie grant.');
        // 授权回调
        alipayOAuth.grant(config.alipay.appId
            , path.resolve(__dirname, '../../../conf/alipaysecret/rsa_private_key.pem')
            , req.query.auth_code
        ).then(function (result) {
            logger.trace('invoke grant finish');
            var openId = result.alipay_system_oauth_token_response.user_id;
            // 记录 openId
            req.session.openId = openId;
            // 在 cookie 中保存 openId
            // 有效期 1 年
            res.cookie('openId', openId, {
                maxAge: 365 * 24 * 3600 * 1000,
                httpOnly: true,
                path: '/'
            });
            next();
        }, function (err) {
            logger.push('error', err)
                .error('occur error when grant of aliapy.');
            // 授权过程中不管发生什么错误都回跳到当前页面, 可以保证授权成功
            // 最糟糕的情况就是一直在跳转
            return res.redirect(currentUrl);
        });
    } else {
        logger.trace('will redirect');
        // 发起授权
        res.end('<script>location = "' + alipayOAuth.getRedirect(config.alipay.appId, currentUrl) + '"</script>');
    }
};
