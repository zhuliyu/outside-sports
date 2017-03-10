/**
 * Created by e on 17/3/6.
 */
/*活动发起表*/
require('../mongoConfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Activity_Schema = new Schema({
    activity_id: String,
    activity_title: String,
    activity_introduction: String,
    launcher_openId: String | null,         //若为空则为官方发布
    launcher_telephone: String,      //发起者联系方式
    launcher_name: String,
    limit: Number,                   //活动限制人数
    gather_place: String,            //活动集合地点
    end_date: Date,                  //报名结束时间
    type: Number,                     //1代表民间发布 0代表官方发布
    date: Date | null,
}, {
    versionKey: false,
});

const Activity = mongoose.model("Activity", Activity_Schema);
exports.activity = Activity;