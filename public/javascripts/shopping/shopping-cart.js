/**
 * Created by e on 17/2/10.
 * 关键在于维护几个全局变量比较复杂
 */
//声明一个全局变量
let total_price = 0
    ,flag = true
    ,old_number = 1;
//点击全选
$('.shopping-cart-bottom-items.first').click(function(){
    if($('.total-select').attr('src') == '/images/shopping/no_selected.png'){
        //执行全选职能 统计价格...
        $('.total-select').attr('src','/images/shopping/selected.png');
        const num_dom = $('.number');
        $('.select').attr('src','/images/shopping/selected.png');
        select_all(num_dom);
    }else{
        $('.total-select').attr('src','/images/shopping/no_selected.png');
        $('.select').attr('src','/images/shopping/no_selected.png');
        //执行全不选职能 总价归零
        total_price = 0;
        $('.total-prices').text(parseFloat(total_price).toFixed(2));
    }
});
//选择单个商品
$('.production-container-items.first').click(function(){
    const i = $(this).children();
    const price = parseFloat($(this).next().next().find('.price')[0].dataset.price);
    const current_num = parseInt($(this).next().next().find('.number').val());
    const total = parseFloat($('.total-prices').text());
    if(i.attr('src') == '/images/shopping/no_selected.png'){
        //执行全选职能
        i.attr('src','/images/shopping/selected.png');
        //统计总价
        $('.total-prices').text(parseFloat(total_price+current_num*price).toFixed(2));
        total_price+=current_num*price;
    }else{
        i.attr('src','/images/shopping/no_selected.png');
        //统计总价
        $('.total-prices').text(parseFloat(total_price-current_num*price).toFixed(2));
        total_price-=current_num*price;
    }
});
//数量加减函数
$('.minus').click(function(){
    const num_input = $(this).next();
    flag = false;
    //当前是否选中图片
    const current_choose = $(this).parent().parent().parent().prev().prev().children();
    let current_num = parseInt(num_input.val());
    const price = parseFloat($(this).parent().prev()[0].dataset.price);
    //如果等于1 减少不做小 如果是非整形 还原为1
    if(current_num == 1){
        num_input.val('1');
        $('.total-prices').text(parseFloat(total_price).toFixed(2));
    }else{
        current_num--;
        num_input.val(current_num);
        single_op(current_choose, 1, price ,flag);
    }
});
$('.and').click(function(){
    flag = true;
    const num_input = $(this).prev();
    //当前是否选中图片
    const current_choose = $(this).parent().parent().parent().prev().prev().children();
    let current_num = parseInt(num_input.val());
    const price = parseFloat($(this).parent().prev()[0].dataset.price);
    current_num++;
    num_input.val(current_num);
    single_op(current_choose, 1, price, flag);
});
$('.number').focus(function(){
    old_number = parseInt($(this).val());
});
$('.number').blur(function(){
    const num_input = $(this);
    const current_choose = $(this).parent().parent().parent().prev().prev().children();
    let current_num = parseInt(num_input.val());
    const price = parseFloat($(this).parent().prev()[0].dataset.price);
    if(parseInt(current_num) !== parseFloat(current_num)){
        current_num = 1;
        $(this).val('1');
    }else{
        if(parseInt(current_num) <= 1){
            current_num = 1;
            $(this).val('1');
        }
    }
    flag = true;
    single_op(current_choose, current_num-old_number, price, flag);
});
//统计全选价格
function select_all(a){
    //遍历得到每个商品的价格和选中数量 马丹 贼烦
    total_price = 0;
    a.each(function(index){
        total_price += parseInt($(this).val())*parseFloat($(this).parent().prev()[0].dataset.price);
    })
    $('.total-prices').text(parseFloat(total_price).toFixed(2));
}
//统计单个加减总价 参数为当前是否选中图片DOM
function single_op(choose, number ,price ,f){
    //判断当前商品是否选中
    if(choose.attr('src') == '/images/shopping/no_selected.png'){
        //总价不变
        $('.total-prices').text(parseFloat(total_price).toFixed(2));
    }else{
        //改变总价
        if(f){
            total_price+=price*number;
        }else{
            total_price-=price*number;
        }
        $('.total-prices').text(parseFloat(total_price).toFixed(2));
    }
}
//统计单选总价
function single_select(total, number, price){
    $('.total-prices').text(parseFloat(total_price+number*price).toFixed(2));
}
$('.editor').click(function(){
    if($(this).text() == '编辑'){
        $(this).text('完成');
        $('.shopping-cart-bottom-items.second').css('opacity', '0');
        $('.shopping-cart-bottom-items.third').css('background-color','red').text('删除');
    }else{
        $(this).text('编辑');
        $('.shopping-cart-bottom-items.second').css('opacity', '1');
        $('.shopping-cart-bottom-items.third').css('background-color','orange').text('去支付');
    }
});
//去支付或者删除操作
$('.shopping-cart-bottom-items.third').click(function(){
    const text = $(this).text();
    if(text == '去支付'){
        //带着购物车信息前往支付页面
        let i = 0;
        $('.production-container-items.first').children().each(function(){
            if($(this).attr('src') == '/images/shopping/selected.png'){
                i++;
            }
        });
        if(i == 0){
            show_tool('请至少选择一个商品');
        }
    }else{
        //删除操作  删除被选中 其它不用管
        let i = 0;
        $('.production-container-items.first').children().each(function(){
            if($(this).attr('src') == '/images/shopping/selected.png'){
                i++;
                $(this).parent().parent().remove();
                total_price-=parseInt($(this).parent().next().next().find('.number').val())*parseFloat($(this).parent().next().next().find('.price')[0].dataset.price);
            }
        });
        if(!$('.production-container').length){
            let text = `<img src="/images/shopping/cart.png"/><p>您的购物车是空的</p><p class="link"><a href="/shopping">送你一张飞机票</a></p>`;
            $('.null').empty().append(text);
        }
        if(i == 0){
            show_tool('请至少选择一个商品');
        }
        $('.total-prices').text(parseFloat(total_price).toFixed(2));
    }
})
function show_tool(word){
    $('.tooltips').text(word);
    $('.tooltips').animate({'opacity' : '1'},100,function(){
        $(this).animate({'opacity' : '0'},1000);
    })
}