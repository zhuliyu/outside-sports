/**
 * Created by e on 17/2/9.
 */
let choose=0;
//点击加入购物车或者立即购买
$('.shopping-deteil-bottom-items.addCart,.shopping-deteil-bottom-items.bought').click(function(){
    const op=$(this).text();
    switch(op){
        case "加入购物车":
            $('.fixed-bottom .btn').val('预计明日发货 | 加入购物车');
            break;
        case "立即购买":
            $('.fixed-bottom .btn').val('预计明日发货 | 下一步');
            break;
    }
    $('.shopping-detail-modal').show();
});
$('.shopping-detail-modal').click(function(){
    $(this).hide();
});
$('.fixed-bottom').click(function(e){
    e.stopPropagation();
});
//点击商品属性标签
$('.modal-production-guige li.useful').click(function(){
    $('.modal-production-guige').find('.useful').css('color','black');
    $(this).css('color','orange');
    let price=$(this)[0].dataset.price;
    choose=price;
    //总价
    $('.modal-production-total-price .total-price').text(parseFloat(price).toFixed(2)+'');
    //数量恢复成1
    $('.modal-production-amount .number').val('1');
});
$('.modal-production-amount .minus').click(function(){
    let current_num=parseInt($('.number').val());
    //如果等于1 减少不做小 如果是非整形 还原为1
    if(current_num == 1){
        $('.number').val('1');
    }else{
        current_num--;
        $('.number').val(current_num);
        $('.modal-production-total-price .total-price').text(parseFloat(current_num*choose).toFixed(2)+'');
    }
});
$('.modal-production-amount .and').click(function(){
    let current_num=parseInt($('.number').val());
    current_num++;
    $('.number').val(current_num);
    $('.modal-production-total-price .total-price').text(parseFloat(current_num*choose).toFixed(2)+'');
});
$('.modal-production-amount .number').blur(function(){
    let current_num=$('.number').val();
    if(parseInt(current_num) !== parseFloat(current_num)){
        current_num=1;
        $('.number').val('1');
    }else{
        if(parseInt(current_num) <= 1){
            current_num=1;
            $('.number').val('1');
        }
    }
    $('.modal-production-total-price .total-price').text(parseFloat(current_num*choose).toFixed(2)+'');
});
//模态窗加入购物车或者购买
$('.fixed-bottom .btn').click(function(){
    const text = $(this).val();
    if(text == '预计明日发货 | 加入购物车'){
        //如果有所选择的话
        if(_choose()()){
            show_tool('选的不错!');
            //加入购物车
            //商品信息插入数据库
            show_tool('加入购物车成功!')
            $('.shopping-detail-modal').hide();
        }else{
            show_tool('请选择商品类型!');
        }
    }else{
        //带着商品信息进入购买页
        location.href = '/shopping/purchase';
    }
});
function show_tool(word){
    $('.tooltips').text(word);
    $('.tooltips').animate({'opacity' : '1'},100,function(){
        $(this).animate({'opacity' : '0'},1000);
    })
}
function _choose(){
    //判断是否选择商品类型
    return function(){
        if($('.total-price').text() == '0.00'){
            //表示没有选择
            return false;
        }
        return true;
    }
}