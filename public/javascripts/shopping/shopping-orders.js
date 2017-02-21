/**
 * Created by e on 17/2/13.
 */
//orderType=0: 所有订单
//orderType=1: 待付款订单
//orderType=2: 待发货订单
//orderType=3: 待收货订单
//orderType=4: 完成订单
const type = window.location.search.split('=')[1];
$('.shopping-orders-top-items:nth-child('+(parseInt(type)+1)+')').addClass('active').siblings().removeClass('active');
$('.shopping-orders-top-items').click(function(){
    const choose = $(this).attr('id');
    const ORDER_TYPE = choose.slice(choose.length-1, choose.length);
    location.href = `/shopping/orders?order_type=${ORDER_TYPE}`;
});
$('.cancel-order').click(function(){

});
$('.quick-pay').click(function(){

});
$('.delete-pay').click(function(){

});
$('.call-order').click(function(){
    show_tool('提醒发货成功');
});
$('.apply-tuihuo').click(function(){

});
$('.observe-wuliu').click(function(){

});
$('.confirm-get').click(function(){

});
function show_tool(word){
    $('.tooltips').text(word);
    $('.tooltips').animate({'opacity' : '1'},100,function(){
        $(this).animate({'opacity' : '0'},1000);
    })
}