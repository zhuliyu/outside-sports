/**
 * Created by e on 17/2/6.
 */
/**
 * Redis client connection pool
 * Created by Session on 16/6/30.
 */

const redis = require('redis')
    , config = require('../../config/development')
    , Promise = require('promise')
    , clients = {};

const DEFAULT_INDEX = 0
    , DEFAULT_HOST = config.redis.host
    , DEFAULT_PORT = config.redis.port
    , DEFAULT_OPTION = config.redis.options;

module.exports = function (index = DEFAULT_INDEX, host = DEFAULT_HOST, options = DEFAULT_OPTION) {
    return new Promise((resolve, reject)=> {
        console.log('>>>>正在尝试连接redis');
        var clientKey = `${host}:${index}`;

        if (!clients[clientKey]) {
            var redisClient = clients[clientKey] = redis.createClient(DEFAULT_PORT, host, options);

            if (index != 0)
                redisClient.select(index);

            redisClient.on('error', (err)=> {
                console.log(`occur error of redis client ${clientKey}`);
            });

            redisClient.on('disconnect', ()=> {
                console.log(`client ${clientKey} already disconnect`);
            });

        }

        resolve(clients[clientKey]);
    });
};
