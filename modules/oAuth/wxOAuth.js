var url = require('url');
var Promise = require('promise');
var wechat = require('../wechat');

module.exports = {
    getBaseRedirect: function (appId, u, state) {
        var u = url.parse(u, true);
        delete u.search;
        delete u.query.code;
        delete u.query.state;
        u = url.format(u);

        var redirect = url.parse('https://open.weixin.qq.com/connect/oauth2/authorize');
        delete redirect.search;
        redirect.query = {
            appid: appId,
            redirect_uri: u,
            response_type: 'code',
            scope: 'snsapi_base',
            state: state
        };
        redirect.hash = '#wechat_redirect';
        redirect = url.format(redirect);

        return redirect;
    },
    getUInfoRedirect: function (appId, u, state) {
        var u = url.parse(u, true);
        delete u.search;
        delete u.query.code;
        delete u.query.state;
        u = url.format(u);

        var redirect = url.parse('https://open.weixin.qq.com/connect/oauth2/authorize');
        delete redirect.search;
        redirect.query = {
            appid: appId,
            redirect_uri: u,
            response_type: 'code',
            scope: 'snsapi_userinfo',
            state: state
        };
        redirect.hash = '#wechat_redirect';
        redirect = url.format(redirect);

        return redirect;
    },
    grant: function (appId, appSecret, code) {
        return new Promise(function (resolve, reject) {
            var wxapi = new wechat.Api(appId, appSecret, {});

            wxapi.request('sns/oauth2/access_token', {
                base: wxapi.url.base,
                requireAccessToken: false,
                query: {
                    appid: wxapi.appId,
                    secret: wxapi.appSecret,
                    code: code,
                    grant_type: 'authorization_code'
                }
            }, function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            });
        });
    },
    uInfoGrant: function (appId, appSecret, code) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var wxapi = new wechat.Api(appId, appSecret, {});

            self.grant(appId, appSecret, code)
                .then(function (result) {
                    wxapi.request('sns/userinfo', {
                        base: wxapi.url.base,
                        requireAccessToken: false,
                        query: {
                            access_token: result.access_token,
                            openid: result.openid,
                            lang: 'zh_CN'
                        }
                    }, function (err, user) {
                        if (!err && user) {
                            resolve(user);
                        } else {
                            reject(err);
                        }
                    });
                }, reject);
        });
    }
};
