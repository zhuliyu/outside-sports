var url = require('url');
var Promise = require('promise');
var moment = require('moment');
var crypt = require('../../libs/encrypt');
var request = require('request');

module.exports = {
    getRedirect: function (appId, u) {
        var u = url.parse(u, true);
        delete u.search;
        delete u.query.code;
        u = url.format(u);

        var redirect = url.parse('https://openauth.alipay.com/oauth2/publicAppAuthorize.htm');
        delete redirect.search;
        redirect.query = {
            app_id: appId,
            redirect_uri: u,
            response_type: 'code',
            scope: 'auth_base'
        };
        redirect = url.format(redirect);

        return redirect;
    },
    grant: function (appId, privateKey, code) {
        return new Promise(function (resolve, reject) {
            var params = {
                app_id: appId,
                method: 'alipay.system.oauth.token',
                charset: 'UTF-8',
                sign_type: 'RSA',
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                version: '1.0',
                grant_type: 'authorization_code',
                code: code
            };
            /**
             alipay返回的数据格式
             {
             "alipay_system_oauth_token_response": {
                "access_token": "authbseB4e17e86e1bf04a8e9bc19bcd88665X84",
                "alipay_user_id": "20881073303205650834700282012184",
                "expires_in": 1296000,
                "re_expires_in": 31536000,
                "refresh_token": "authbseB79e4ef406f7643248832ec4019f3bE84",
                "user_id": "2088102158522844"
                },
                "sign": "Ik+CowwNKI85tRJccQaPVA7lWGKZbxMNLwt9du2HUrM1wuLm0fhFG7Aq2c1DrcVSe1ihGcxTe1CWx8OmNGfi2YiA2DS+L+29+GQYIyZZSlsnY18uPGhaRhAcVGtGuZBZ7vS2nKHhvnR4bmjyTbMb0S4Q2MWnP4OaIUpHevRMOr8="
             }
             **/
            params.sign = crypt.getPraramsSignature(params, privateKey);

            request.post('https://openapi.alipay.com/gateway.do', {
                qs: params,
                json: true
            }, function (err, response, body) {
                if (err) {
                    reject(err);
                } else if (response.statusCode != 200) {
                    reject(new Error(response.statusCode))
                } else {
                    resolve(body);
                }
            });
        });
    }
};

