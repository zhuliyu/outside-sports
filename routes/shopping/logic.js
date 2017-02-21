/**
 * Created by e on 17/2/10.
 */
var express = require('express');
//const auth = require('../../middleware/login');
const config =require('../../config/development');
var router = express.Router();

router.get('/for_search', (req, res) => {
    const keyword = req.query.keyword;
    console.log(keyword);
    const productionList=[
        {
            production_title: '新版小米手环',
            production_price: '129',
            production_imgUrl: 'http://i8.mifile.cn/v1/a1/97c2e91e-523e-3988-3abc-aacc824f2737.webp?width=300&height=300',
            production_id: 4,
            production_url: '/shopping/production?id=4',
        },
        {
            production_title: '新版小米手环专用充电器',
            production_price: '11',
            production_imgUrl: 'http://i8.mifile.cn/v1/a1/ddf9230b-3634-a9d3-1c37-fe71da8eec4e.webp?width=300&height=300',
            production_id: 3,
            production_url: '/shopping/production?id=3',
        },
        {
            production_title: '小米手环2腕带',
            production_price: '19.9',
            production_imgUrl: 'http://i8.mifile.cn/v1/a1/47c687cd-166a-b196-4a3a-188c71df808f.webp?width=300&height=300',
            production_id: 2,
            production_url: '/shopping/production?id=2',
        }
    ];
    res.json(productionList);
})
router.post('/get_orders', (req, res) => {
    switch(req.body.orderType){
        case '0':
            //do...
            const result = [
                {
                    order_date: '2017-02-13 10:03:44',
                    order_type: '1',
                    production_id: 1,
                    order_id: 'isdhoiaoiof',
                    production_information: {
                        production_title: '新版小米手环专用充电器',
                        production_price: '11',
                        production_imgUrl: 'http://i8.mifile.cn/v1/a1/ddf9230b-3634-a9d3-1c37-fe71da8eec4e.webp?width=300&height=300',
                        production_id: 3,
                        production_url: '/shopping/production?id=3',
                    },
                    order_price: '396',
                },
                {
                    order_date: '2017-02-13 10:03:44',
                    order_type: '2',
                    production_id: 1,
                    order_id: 'hdahoisoasd',
                    production_information: {
                        production_title: '新版小米手环专用充电器',
                        production_price: '11',
                        production_imgUrl: 'http://i8.mifile.cn/v1/a1/ddf9230b-3634-a9d3-1c37-fe71da8eec4e.webp?width=300&height=300',
                        production_id: 3,
                        production_url: '/shopping/production?id=3',
                    },
                    order_price: '396',
                },
                {
                    order_date: '2017-02-13 10:03:44',
                    order_type: '3',
                    production_id: 1,
                    order_id: 1,
                    production_information: {
                        production_title: '新版小米手环专用充电器',
                        production_price: '11',
                        production_imgUrl: 'http://i8.mifile.cn/v1/a1/ddf9230b-3634-a9d3-1c37-fe71da8eec4e.webp?width=300&height=300',
                        production_id: 3,
                        production_url: '/shopping/production?id=3',
                    },
                    order_price: '396',
                },
                {
                    order_date: '2017-02-13 10:03:44',
                    order_type: '4',
                    production_id: 1,
                    order_id: 1,
                    production_information: {
                        production_title: '新版小米手环专用充电器',
                        production_price: '11',
                        production_imgUrl: 'http://i8.mifile.cn/v1/a1/ddf9230b-3634-a9d3-1c37-fe71da8eec4e.webp?width=300&height=300',
                        production_id: 3,
                        production_url: '/shopping/production?id=3',
                    },
                    order_price: '396',
                }
            ];
            res.json(result);
            break;
        case '1':
            //do...
            break;
        case '2':
            //do...
            break;
        case '3':
            //do...
            break;
        case '4':
            //do...
            break;
    }
});
module.exports = router;