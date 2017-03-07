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
            filename: 'Logger/common.log',
            pattern: "-yyyy-MM-dd",
            category: ['common', 'request'],
            alwaysIncludePattern: true,
            layout: {
                type: "wsLayout"
            }
        },{
            type: 'dateFile',
            filename: 'Logger/errorDetail.log',
            pattern: "-yyyy-MM-dd",
            category: 'error',
            alwaysIncludePattern: true,
            layout: {
                type: "wsLayout"
            }
        }
    ],
    levels: {}
};


//log4js.configure(logConfigure, { cwd: '/app/log/app' });
log4js.configure(logConfigure);

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
