/**
 * 供 api 使用的登录检查
 * 相较于标准登录检查中间件
 *
 * 1. 只检查 session 中是否存在相应的登录识别 key, 不会自动登录
 * 2. 会为 req 填充检查登录状态的函数
 *
 * Created by Session on 16/9/5.
 */

/**
 *      #Example
 *          api([WEIXIN], function(true|false){//...});
 *
 * @param cb
 * @returns {Function}
 */
module.exports = function (requireLoginEnv, cb) {
    /**
     *
     *      #Example
     *          check(req, res, next);
     *
     * @param req
     * @param res
     * @param next
     */
    return function (req, res, next) {
        const logger = req.logger;

        /**
         * @type {string}
         */
        req.currentFullUrl = req.protocol + "://" + req.hostname + req.originalUrl;

        /**
         * check if login
         * @returns {boolean}
         */
        req.isLogin = function () {
            if (requireLoginEnv == 'ALL' || requireLoginEnv.indexOf(req.browser) != -1) {
                return !!(req.session.loginIdentify && req.session[req.session.loginIdentify]);
            } else {
                return true;
            }
        };

        /**
         * get uid
         * @returns {*|string}
         */
        req.getLoginIdeVal = function () {
            return req.session[req.session.loginIdentify] || '';
        };

        if (req.isLogin()) {
            // auth success
            cb ? cb(true, req, res, next) : next();
        } else if (cb) {
            // auth fail and callback invoker
            cb(false, req, res, next);
        } else {
            // auth fail
            logger.warn('Not login');

            const noAuthError = new Error('request forbidden');
            noAuthError.status = 401;

            next(noAuthError);
        }
    };
};
