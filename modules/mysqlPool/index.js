/**
 * Created by e on 17/2/26.
 */
const db = require('./dbConfig');
const mysql = require('mysql');
const mysqlPool = mysql.createPool(db.options);
const Promise = require('promise');

mysqlPool.connectionLimit = 20;
mysqlPool.queueLimit = 12;
function connectMysql() {
    return new Promise((resolve, reject) => {
        mysqlPool.getConnection((err, client) => {
            if (err) {
                reject(err);
                setTimeout(connectMysql, 2000);
            }
            resolve(client);
        })
    })
}
exports.connectMysql = connectMysql;
