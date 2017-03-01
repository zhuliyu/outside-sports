/**
 * Created by e on 17/2/7.
 */
var express = require('express');
//const auth = require('../../middleware/login');
const config =require('../../config/development');
const request=require('request');
var router = express.Router();
router.all('*', function(req, res, next) {
    if(!req.headers['user-agent'].match('MicroMessenger')){
        res.render('errorUserAgent', { title: 'error' });
    }
    next();
});
//商城home页
router.get('/', (req, res) => {
    const indexProduction = [
        {
            production_imgUrl: 'https://piccdn.luojilab.com/store-pc/image/201702/1487739128249.jpg@405w_2e_1l_1an.src',
            production_url: '/shopping/production?id=5',
        },
        {
            production_imgUrl: 'https://piccdn.luojilab.com/store-pc/image/201701/1484095676474.jpg@400w_2e_1l_1an.src',
            production_url: '/shopping/production?id=6',
        },
        {
            production_imgUrl: 'https://piccdn.luojilab.com/store-pc/image/201702/1486427525752.jpg@405w_2e_1l_1an.src',
            production_url: '/shopping/production?id=7',
        },
        {
            production_imgUrl: 'https://piccdn.luojilab.com/store-pc/image/201702/1486364795200.png@406w_2e_1l_1an.src',
            production_url: '/shopping/production?id=8',
        },
    ]
    res.render('shopping/index',{title: '绿野仙踪官方店-主页',indexProduction: indexProduction});
});
//最新产品页
router.get('/lastest',(req, res) => {
    const productionList = [
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
    res.render('shopping/lastest',{title: '商品列表-绿野仙踪2017', productions: productionList});
});
//商品详情页
router.get('/production',(req, res) => {
    const production_id = req.query.id;
    //通过id获取商品的信息
    //轮播图片地址 以','分隔
    let carousel_imgUrl = 'http://i8.mifile.cn/v1/a1/26e25458-e350-f4e2-cd55-d0eedbfc0d46.jpg,http://i8.mifile.cn/v1/a1/fb54f6d2-b515-1359-a5cd-6d8b922b0f89.jpg,http://i8.mifile.cn/v1/a1/99bb5a3e-a1e5-90d1-bd2b-cf23f35365de.jpg'
    let imgUrl = carousel_imgUrl.split(',');
    const introduction = {
        imgUrl: imgUrl,
        production_title: '新版小米手环专用充电器',
        production_price: '129',
        production_imgUrl: 'http://i8.mifile.cn/v1/a1/97c2e91e-523e-3988-3abc-aacc824f2737.webp?width=300&height=300',
        production_introduction: '<p><img src="http://images.wosaimg.com/d3/a42c130f0df842a9e3f2b4a716dd8ac0e3f83f.png" title="" alt="blob.png"/></p><p><img src="http://images.wosaimg.com/e6/f5b5d3ed43d0eb25b83f3908fed8aeaab6ed13.png" title="" alt="blob.png"/></p><p><img src="http://images.wosaimg.com/82/eb2827d8df1999dc4f01d093d411f3379a98f4.png" title="" alt="blob.png"/></p>',
        styles: [
            {
                appearance: '白色',
                price: 129.9,
                amounts: 99,
            },
            {
                appearance: '黑色',
                price: 120,
                amounts: 99,
            },
            {
                appearance: '绿色',
                price: 139,
                amounts: 0,
            },
            {
                appearance: '蓝色',
                price: 129,
                amounts: 10,
            },
        ]
    };
    res.render('shopping/production-detail',{title: '小米手环,明智之选',introduction: introduction});
});
//微信oauth授权
router.get('/get_user', (req, res) => {
    //获取access_token
    const url = config.remote.get_access_token+'?grant_type=client_credential&appid='+config.weixin.appId+'&secret='+config.weixin.appSecret;
    request.get(url,(err, response, data) => {
        if(err){
            console.log(err);
            return ;
        }
        req.session.token=JSON.parse(data).access_token;
        console.log(req.session.token);
    })
});
//商品搜索页
router.get('/search', (req, res) => {
    if(req.query.keyword == undefined){
        res.render('shopping/shopping-search', {title: '绿野仙踪'});
    }else{
        const keyword = req.query.keyword;
        const productionList = [
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
        res.render('shopping/shopping-search', {title: '搜索结果', productionList: productionList});
    }
});
//购物车页面
router.get('/cart', (req, res) => {
    const introduction = [
        {
            production_title: '新版小米手环',
            production_price: '129',
            production_imgUrl: 'http://i8.mifile.cn/v1/a1/97c2e91e-523e-3988-3abc-aacc824f2737.webp?width=300&height=300',
            styles: '蓝色',
            production_url: '/shopping/production?id=4',
        },
        {
            production_title: '新版小米手环专用充电器',
            production_price: '11',
            production_imgUrl: 'http://i8.mifile.cn/v1/a1/ddf9230b-3634-a9d3-1c37-fe71da8eec4e.webp?width=300&height=300',
            styles: '白色',
            production_url: '/shopping/production?id=3',
        },
        {
            production_title: '小米手环2腕带',
            production_price: '19.9',
            production_imgUrl: 'http://i8.mifile.cn/v1/a1/47c687cd-166a-b196-4a3a-188c71df808f.webp?width=300&height=300',
            styles: '黑色',
            production_url: '/shopping/production?id=2',
        }
    ];
    res.render('shopping/shopping-cart', {title: '购物车', introduction: introduction});
});
//订单页
router.get('/orders', (req, res) => {
    const order_type = req.query.order_type;
    let result = [];
    switch(order_type){
        case '0':
            //得到全部订单 根据type区分订单状态...
            result = [
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
            res.render('shopping/shopping-order' , {title: '订单列表', result: result});
            break;
        case '1':
            result = [
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
                    order_type: '1',
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
                }
            ];
            res.render('shopping/shopping-order' , {title: '订单列表', result: result});
            break;
        case '2':
            result = [
                {
                    order_date: '2017-02-13 10:03:44',
                    order_type: '2',
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
                }
            ];
            res.render('shopping/shopping-order' , {title: '订单列表', result: result});
            break;
        case '3':
            result = [
                {
                    order_date: '2017-02-13 10:03:44',
                    order_type: '3',
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
                }
            ];
            res.render('shopping/shopping-order' , {title: '订单列表', result: result});
            break;
        case '4':
            result = [];
            res.render('shopping/shopping-order' , {title: '订单列表', result: result});
            break;
    }
});
//购物车跳转的支付页
router.get('/purchase', (req, res) => {
    res.render('shopping/shopping-purchase', {title: '确认订单'});
});
module.exports = router;