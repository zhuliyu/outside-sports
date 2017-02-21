/**
 * 基于微信客户端的 oAuth 授权实现
 *
 * @see http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842&token=&lang=zh_CN
 *
 * Created by Session on 16/8/16.
 */

const url = require('url')
    , weixinOAuth = require('../../../modules/oAuth/wxOAuth');

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @param {Object} options
 * @returns {*}
 */
module.exports = function (req, res, next, options) {
    console.log('>>>>1')
    const logger = req.logger
        , remember = options.remember !== false // 记住登录状态
        , identify = options.identify || `openId:${options.appId}`; // 使用者可以自定义用于识别是否登录的 key 默认为 openId + appId

    req.session.loginIdentify = identify;

    // 已经登录
    if (req.session[identify])
        return next();

    // 记住登录
    if (req.cookies[identify]) {
        req.session[identify] = req.cookies[identify];
        return next();
    }

    /**
     * weixinUInfoOAuth 是本授权实现的升级
     * 如存在 weixinUInfoOAuth 的登录识别 key 则认为 BaseOAuth 也已通过登录认证
     */
    if (req.session[`weixinUser:${options.appId}`]) {
        req.session[identify] = req.session[`weixinUser:${options.appId}`].openid;
        return next();
    }

    // 删除 state/code 防止当调用 user/info 出错时陷入跳转死循环
    const parsedUrl = url.parse(req.currentFullUrl, true);
    delete parsedUrl.query.state;
    delete parsedUrl.query.code;
    delete parsedUrl.search;
    const currentUrl = url.format(parsedUrl);

    if (req.query.state && req.query.state == req.sessionID) {
        // 授权回调
        weixinOAuth.grant(options.appId, options.appSecret, req.query.code)
            .then(function (result) {
                const openId = result.openid;
                // 记录 openId
                req.session[identify] = openId;

                if (remember) {
                    /**
                     * 在 cookie 中保存 openId 记住授权状态, 有效期 1 年
                     */
                    res.cookie(identify, openId, {
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
        res.end('<script>location = "' + weixinOAuth.getBaseRedirect(options.appId, currentUrl, req.sessionID) + '"</script>');
    }
};
