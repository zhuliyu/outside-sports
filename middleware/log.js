/**
 * log middleware
 * Created by Session on 16/6/21.
 */
const log4js = require('log4js');
const wsLogger = require('../libs/log');

/*add layout to log4js*/
require('log4js/lib/layouts').addLayout('wsLayout', function () {
    return require('../libs/layout')
});

/**
 * log4js configure
 * @type {{appenders: *[], levels: {}}}
 */
const logConfigure = {
    appenders: [
        {
            type: 'dateFile',
            filename: 'common.log',
            pattern: "-yyyy-MM-dd",
            category: ['common', 'request'],
            alwaysIncludePattern: true,
            layout: {
                type: "wsLayout"
            }
        }, {
            type: 'dateFile',
            filename: 'client.log',
            pattern: "-yyyy-MM-dd",
            category: 'client',
            alwaysIncludePattern: true,
            layout: {
                type: "wsLayout"
            }
        }, {
            type: 'dateFile',
            filename: 'errorDetail.log',
            pattern: "-yyyy-MM-dd",
            category: 'error',
            alwaysIncludePattern: true,
            layout: {
                type: "wsLayout"
            }
        }, {
            type: 'dateFile',
            filename: 'weixinClientPayResult.log',
            pattern: "-yyyy-MM-dd",
            category: 'weixinClientPayResult',
            alwaysIncludePattern: true,
            layout: {
                type: "wsLayout"
            }
        }
    ],
    levels: {}
};


log4js.configure(logConfigure, { cwd: '/app/log/app' });

/**
 * default set common logger to req
 * @param req
 * @param res
 * @param next
 */
module.exports = function (req, res, next) {
    req.logger = new wsLogger({
        category: 'common',
        req: req,
        res: res
    });
    req.logger.generateLogID();
    next();
};
