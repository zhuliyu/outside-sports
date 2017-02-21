/**
 * Created by e on 16/12/28.
 */
exports.MD5=function(data) {
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    var crypto = require("crypto");
    return crypto.createHash("md5").update(str).digest("hex");
}
