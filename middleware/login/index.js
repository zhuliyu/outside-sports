/**
 * Created by Session on 16/8/16.
 */

/**
 * oAuth 授权中间件
 *
 * ### Example
 *      login('auto', {
 *          appId: '',
 *          appSecret: ''
 *      })(req, res, next);
 *
 *      login('weixinUInfoOAuth', {
 *          WEIXIN: {
 *              appId: '',
 *              appSecret: ''
 *          }
 *      })(req, res, next);
 *
 * @param implName 使用何种授权, 如微信、支付宝 ['auto', 'weixinBaseOAuth', 'weixinUInfoOAuth', 'alipayBaseOAuth']
 * @param options [appId, appSecret, identify (识别是否登录的 key), remember(记住登录)]
 * @returns {Function}
 */
const impl = require('./Impl/weixinBaseOAuth');
module.exports = function (implName, options) {
    return function (req, res, next) {

        //var logger = req.logger;

        /**
         * @type {string}
         */
        req.currentFullUrl = req.protocol + "://" + req.hostname + req.originalUrl;
        /**
         * @returns {string|*}
         */
        req.isLogin = function () {
            return req.session.loginIdentify && req.session[req.session.loginIdentify];
        };
        /**
         * @returns {*}
         */
        req.getLoginIdeVal = function () {
            return req.session[req.session.loginIdentify];
        };
        if (!options)
            options = {};

        implName = implName || 'auto';

        var passOptions = options;
        var requireImplName = implName;
        if (implName == 'auto') {
            //logger.trace('auto choose auth impl.');
            requireImplName = 'weixinBaseOAuth';
            passOptions = options[req.browser] || {};
        }


        impl(req, res, next, passOptions);
    };
};
