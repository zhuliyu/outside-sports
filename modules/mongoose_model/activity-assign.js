/**
 * Created by e on 17/3/6.
 */
/*活动报名表*/
require('../mongoConfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activityAssign_Schema = new Schema({
    activity_id: String,
    telephone: Number,
    join_openId: String,
    join_telephone: String,
}, {
    versionKey: false,
});

const activityAssign = mongoose.model("activity-assign", activityAssign_Schema);
exports.activityAssign = activityAssign;