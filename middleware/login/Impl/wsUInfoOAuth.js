/**
 * wosai 授权中间件实现, 会存储用户信息
 *
 * Created by Session on 16/8/16.
 */

const url = require('url')
    , wsOAuth = require('../../../modules/oAuth/wsOAuth');

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
    // 使用者可以自定义用于识别是否登录的 key 默认为 user
        , identify = options.identify || 'user';

    req.session.loginIdentify = identify;

    // 已经登录
    if (req.session[identify])
        return next();

    // 删除 code 防止当调用 user/info 出错时陷入跳转死循环
    const parsedUrl = url.parse(req.currentFullUrl, true);
    delete parsedUrl.search;
    delete parsedUrl.query.code;
    const currentUrl = url.format(parsedUrl);

    if (req.query.error && req.query.error_description) {
        logger.push('error', req.query.error_description)
            .error('occur error when grant of wosai oAuth.');
        return next(new Error(req.query.error_description));
    }

    if (req.query.code) {
        // 授权回调
        wsOAuth.uInfoGrant(options.clientId, options.clientSecret, req.query.code, currentUrl)
            .then(function (user) {
                // 置为已登录
                req.session[identify] = user[0];

                next();
            }, function (err) {
                logger.push('error', err)
                    .error('occur error when grant of wosai oAuth.');

                // 授权过程中不管发生什么错误都回跳到当前页面, 可以保证授权成功
                // 最糟糕的情况就是一直在跳转
                res.redirect(currentUrl);
            });
    } else {
        logger.trace('will redirect to third auth page');
        // 发起授权
        res.redirect(wsOAuth.getRedirect(options.clientId, currentUrl));
    }
};
