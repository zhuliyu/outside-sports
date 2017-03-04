/**
 * Created by Session on 16/7/1.
 */

var Promise = require('promise');
var async = require('async');

/**
 * execute a specific function with retry
 *
 * @param fn sepcific function to retry
 * @param maxTimes max execute time
 * @param delay wait some time to retry
 * @returns {Promise} a promise
 */
module.exports = function (fn, maxTimes, delay) {
    return new Promise(function (resolve, reject) {
        var times = 0;
        maxTimes = maxTimes || 3;

        /**
         * retry some times
         * default 3 times
         */
        async.doUntil(function (cb) {
            if (times == 0 || !delay) {
                fn(cb);
            } else {
                setTimeout(function () {
                    fn(cb);
                }, delay);
            }
        }, function () {
            ++times;
            return times > maxTimes;
        }, function () {
            // timeout
            reject(new Error('retry max times.'));
        });
    });
};
