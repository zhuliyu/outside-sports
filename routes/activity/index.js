/**
 * Created by e on 17/2/28.
 */
const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('activity/main_activity/index', {title: '活动'});
});
module.exports = router;