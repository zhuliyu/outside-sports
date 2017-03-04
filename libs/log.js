/**
 * wosai logger to resolve disorderly log
 * add a log id fro each line
 * Created by Session on 16/6/18.
 */

var util = require('util');
var log4js = require('log4js');

/**
 * check require filed
 * @param params
 * @param requireField
 * @returns {boolean}
 */
function checkParam(params, requireField) {
    if (!(params instanceof Object)) throw new Error('Invalid params');

    if (!(requireField instanceof Array)) {
        requireField = [requireField.toString()];
    }

    for (var i = 0, len = requireField.length; i < len; ++i) {
        if (typeof params[requireField[i]] == 'undefined') return false;
    }

    return true;
}

/**
 * constructor of wosai logger
 * @param options
 */
function wsLogger(options) {
    this.req = options.req || {};
    this.res = options.res || {};
    this.target = log4js.getLogger(options.category);

    this.resetLog();
}

/**
 * generate a log id from current cycle
 * @returns {wsLogger}
 */
wsLogger.prototype.generateLogID = function () {
    var req = this.req;
    var res = this.res;
    var logID = req.cookies.logID;
    if (!logID) {
        logID = req.sessionID;
        res.cookie('logID', logID, {
            maxAge: 24 * 3600 * 1000,
            path: '/'
        });
    }
    this.logID = logID;
    req.logID = this.logID;
    return this;
};

/**
 * reset log buffer
 * @returns {wsLogger}
 */
wsLogger.prototype.resetLog = function () {
    this._logs = {};
    return this;
};

/**
 * switch log4js target
 * @param category
 * @param options
 * @returns {wsLogger}
 */
wsLogger.prototype.switchTarget = function (category) {
    this.target = log4js.getLogger(category);
    return this;
};

/**
 * push a log to buffer
 * @param key
 * @param value
 * @returns {wsLogger}
 */
wsLogger.prototype.push = function (key) {
    if (!key) return this;

    var value = Array.prototype.slice.call(arguments);
    value.shift();

    this._logs[key] = value.length > 1 ? value : value[0];

    return this;
};

/**
 * play a action of send log data in buffer to log4js
 */
['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark'].forEach(function (levelStr) {
    wsLogger.prototype[levelStr] = function () {
        var args = Array.prototype.slice.call(arguments);

        if (args.length) {
            args.unshift('message');
            this.push.apply(this, args);
        }

        if (this.logID) {
            this.push('logId', this.logID);
        }

        if (this.req.getLoginIdeVal && (typeof this.req.getLoginIdeVal == 'function')) {
            var user = this.req.getLoginIdeVal();
            if (user instanceof Object && user.openid) {
                this.push('openId', user.openid);
            } else if (typeof user == 'string') {
                this.push('openId', user);
            }
        }
        if (this.req.session && this.req.session.store && this.req.session.store.wosai_store_id) {
            this.push('wosaiStoreId', this.req.session.store.wosai_store_id);
        }

        this.target[levelStr].call(this.target, this._logs);

        this.resetLog();
        return this;
    };
});

module.exports = wsLogger;