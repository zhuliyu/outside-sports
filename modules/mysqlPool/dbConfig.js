/**
 * Created by e on 17/2/26.
 */
const config = require('../../config/development');
const options = {
    host: config.mysql.host,
    port: config.mysql.port,
    database: 'outside-sports',
    user: 'root',
    password: 'ZC199592',
};
exports.options = options;