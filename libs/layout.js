/**
 * Created by Session on 16/6/21.
 */
var util = require('util');
var moment = require('moment');

/**
 * deep format data that instances of Error in items
 * @param items
 * @returns {*}
 */
function formatErrorDeep(items) {
    if (items instanceof Error) {
        return items.message;
    } else if (util.isArray(items)) {
        return items.map(formatErrorDeep);
    } else if (util.isObject(items)) {
        var newItems = {};
        for (var k in items) {
            newItems[k] = formatErrorDeep(items[k]);
        }
        return newItems;
    } else {
        return items;
    }
}

/**
 * log4js layout function
 * @param loggingEvent
 * @param timezoneOffset
 */
module.exports = function (loggingEvent, timezoneOffset) {
    var logData = loggingEvent.data[0];

    if (!util.isObject(logData))
        return logData.toString();

    logData['level'] = util.format('%s', loggingEvent.level);
    logData['category'] = loggingEvent.categoryName;
    logData['time'] = moment(loggingEvent.startTime).format('YYYY-MM-DD HH:mm:ss');

    for (var k in logData) {
        if (util.isArray(logData[k])) {
            logData[k] = util.format.apply(util, formatErrorDeep(logData[k]));
        } else if (util.isObject(logData[k])) {
            logData[k] = JSON.stringify(formatErrorDeep(logData[k]));
        } else {
            logData[k] = formatErrorDeep(logData[k]);
        }
    }
    return JSON.stringify(logData);
};
