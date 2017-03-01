/**
 * Created by e on 17/2/26.
 */
const mysql = require('mysql');
const mysqlPool = require('../../modules/mysqlPool');
const Promise = require('promise');

exports.shoppingDao = {
    //模板
    get_information: function* () {
        const sql = 'select * from users';
        const client = yield mysqlPool.connectMysql();
        const result = yield queryUsers(client, sql);
        return result;
    },
};
function queryUsers(client, sql) {
    return new Promise((resolve, reject) => {
        client.query(sql, (error, result) => {
            if (error) {
                reject(error);
            }
            client.release();
            resolve(result);
        })
    })
}