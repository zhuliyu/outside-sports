/**
 * Created by Session on 15/11/23.
 */

var crypto = require('crypto');
var fs = require('fs');
module.exports = {
    sign: function (params, secret) {
        params = this.parseFilter(params);
        params = this.argSort(params);
        var paramsStr = this.createLinkStr(params);

        paramsStr += '&key=' + secret;
        paramsStr = (new Buffer(paramsStr)).toString('binary');

        return crypto.createHash('md5').update(paramsStr).digest('hex').toUpperCase();
    },
    verify: function (params, secret) {
        if (!'sign' in params)
            return false;

        return this.sign(params, secret) === params.sign;
    },
    parseFilter: function (params) {
        var newParams = {};
        for (var key in params) {
            if (key != 'sign' && key != 'sign_type' && params[key] != '') {
                newParams[key] = params[key];
            }
        }
        return newParams;
    },
    parseAlipayOpenFilter: function (params) {
        var newParams = {};
        for (var key in params) {
            if (key != 'sign' && params[key] != '') {
                newParams[key] = params[key];
            }
        }
        return newParams;
    },
    argSort: function (params) {
        var newParams = {};
        Object.keys(params).sort().forEach(function (key) {
            newParams[key] = params[key];
        });
        return newParams;
    },
    createLinkStr: function (params) {
        var result = '';
        for (var key in params) {
            result += key + '=' + params[key] + '&';
        }

        result = result.slice(0, -1);
        return result;
    },
    signWithRSA: function (data, privateKey) {
        var privatePem = fs.readFileSync(privateKey);
        var key = privatePem.toString();
        var sign = crypto.createSign('RSA-SHA1');
        sign.update(data, 'utf8');
        return sign.sign(key, 'base64');

    },
    getPraramsSignature: function (data, privateKey) {
        data = this.parseAlipayOpenFilter(data);
        data = this.argSort(data);

        var paramsStr = this.createLinkStr(data);
        return this.signWithRSA(paramsStr, privateKey);

    }
};
