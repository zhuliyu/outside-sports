/**
 * 喔噻 oAuth 获取跳转地址和信息的实现
 * Created by Session on 16/9/8.
 */

const url = require('url')
    , request = require('request')
    , Promise = require('promise');

const API = 'http://cronut.shouqianba.com';

module.exports = {
    /**
     * 获取 oAuth 授权登录跳转地址
     * @param clientId
     * @param u
     * @returns String {*}
     */
    getRedirect: function (clientId, u) {
        u = url.parse(u, true);
        delete u.search;
        delete u.query.code;

        var redirect = url.parse(`${API}/api/authorize`);
        delete redirect.search;
        redirect.query = {
            client_id: clientId,
            redirect_uri: url.format(u),
            response_type: 'code'
        };

        return url.format(redirect);
    },
    /**
     * oAuth 获取 access_token
     * @param clientId
     * @param clientSecret
     * @param code
     * @param u
     * @returns Promise {*}
     */
    grant: function (clientId, clientSecret, code, u) {
        u = url.parse(u, true);
        delete u.search;
        delete u.query.code;

        return new Promise((resolve, reject)=> {
            request.post(`${API}/api/access_token`, {
                form: {
                    client_id: clientId,
                    code: code,
                    grant_type: 'authorization_code',
                    client_secret: clientSecret,
                    redirect_uri: url.format(u)
                },
                pool: false,
                json: true
            }, (err, res, body)=> {
                if (err) {
                    reject(err);
                } else if (res.statusCode != 200) {
                    reject(new Error('http response status code is not 200, code is ' + res.statusCode));
                } else {
                    resolve(body);
                }
            });
        });
    },
    /**
     * oAuth 获取 access_token 和用户信息
     * @param clientId
     * @param clientSecret
     * @param code
     * @param u
     * @returns Promise {*}
     */
    uInfoGrant: function (clientId, clientSecret, code, u) {
        return new Promise(function (resolve, reject) {
            this.grant(clientId, clientSecret, code, u)
                .then(token=> {
                    request.post(`${API}/api/get_info`, {
                        qs: {
                            access_token: token.access_token
                        },
                        pool: false
                    }, function (err, res, user) {
                        if (err) {
                            reject(err);
                        } else if (res.statusCode != 200) {
                            reject(new Error('http response status code is not 200, code is ' + res.statusCode));
                        } else {
                            try {
                                resolve([JSON.parse(decodeURIComponent(user)), token]);
                            } catch (e) {
                                reject(e);
                            }
                        }
                    });
                }, reject);
        }.bind(this));
    }
};
