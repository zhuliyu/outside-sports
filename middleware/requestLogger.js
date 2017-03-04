/**
 * Created by Session on 16/6/22.
 */
var log4js = require('log4js');
var moment = require('moment');
var requestLogger = log4js.getLogger('request');

module.exports = function (req, res, next) {
    var requestStart = moment().toISOString();
    var logger = log4js.connectLogger(requestLogger, {
        level: 'auto',
        nolog: ['/ads/heartbeat', /\.(ico|js|css|jpe?g|png)/],
        format: function (req, res, format) {
            var line = format(JSON.stringify({
                logId: req.logID,
                responseId: req.responseId,
                browser: req.browser,
                page: req.baseUrl + (req.route && req.route.path || ''),
                ips: ":remote-addr",
                verb: ":method",
                url: ":url",
                httpVersion: ":http-version",
                status: ":status",
                contentLength: ":content-length",
                referrer: ":referrer",
                UA: ":user-agent",
                spendTime: ":response-time",
                requestStart: requestStart
            }));
            line = JSON.parse(line);
            line.spendTime = parseInt(line.spendTime);
            line.contentLength = line.contentLength == '-' ? 0 : parseInt(line.contentLength);

            if (req.getLoginIdeVal) {
                var user = req.getLoginIdeVal();
                if (user instanceof Object && user.openid) {
                    line.openId = user.openid;
                } else {
                    line.openId = user;
                }
            }
            return line;
        }
    });

    logger(req, res, next);
};
