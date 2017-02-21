/**
 * 微信授权 scope 为 snsapi_userinfo 的实现
 *
 * @see http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842&token=&lang=zh_CN
 *
 * Created by Session on 16/8/16.
 */

const url = require('url')
    , weixinOAuth = require('../../../modules/oAuth/wxOAuth');

/**
 *
 * @param req
 * @param res
 * @param next
 * @param options
 * @returns {*}
 */
module.exports = function (req, res, next, options) {
    const logger = req.logger
    // 记住登录状态, 这里不是记住 userInfo 级别授权的登录状态, 而是为 base 级别记住登录状态
        , remember = options.remember !== false
    // 使用者可以自定义用于识别是否登录的 key 默认为 weixinUser + appId
        , identify = options.identify || `weixinUser:${options.appId}`;

    req.session.loginIdentify = identify;

    // 已经登录
    if (req.session[identify])
        return next();

    // 删除 state/code 防止当调用 user/info 出错时陷入跳转死循环
    const parsedUrl = url.parse(req.currentFullUrl, true);
    delete parsedUrl.query.state;
    delete parsedUrl.query.code;
    delete parsedUrl.search;
    const currentUrl = url.format(parsedUrl);

    if (req.query.state && req.query.state == req.sessionID) {
        // 授权回调
        weixinOAuth.uInfoGrant(options.appId, options.appSecret, req.query.code)
            .then(function (user) {
                // 置为已登录
                req.session[identify] = user;

                if (remember) {
                    const openId = user.openid;
                    /**
                     * 在 cookie 中保存 openId 记住授权状态, 有效期 1 年
                     */
                    res.cookie(`openId:${options.appId}`, openId, {
                        maxAge: 365 * 24 * 3600 * 1000,
                        httpOnly: true,
                        path: '/'
                    });
                }
                next();
            }, function (err) {
                logger.push('error', err)
                    .error('occur error when grant of wechat.');

                // 授权过程中不管发生什么错误都回跳到当前页面, 可以保证授权成功
                // 最糟糕的情况就是一直在跳转
                res.redirect(currentUrl);
            });
    } else {
        logger.trace('will redirect to third auth page');
        // 发起授权
        // 微信 302 重定向有bug, 会请求两次URL, 造成重复注册
        // 并且回到自己页面时, 复制/分享的链接是上一个页面的URL, 即 https://open.weixin.qq.com/...
        res.end('<script>location = "' + weixinOAuth.getUInfoRedirect(options.appId, currentUrl, req.sessionID) + '"</script>');
    }
};
