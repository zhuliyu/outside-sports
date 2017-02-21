/**
 * Created by e on 17/2/8.
 */
$('.lastest-title-items').click(function(e){
    const flag=$(this).text();
    $(this).css('color','orange');
    $(this).siblings().css('color','black');
    switch(flag){
        case "最新":
            //最新反序排列
            $(this).find('.sort').attr('src','/images/shopping/sort_down_orange.png');
            $('.third .sort').attr('src','/images/shopping/sort_down.png');
            $('.second .sort').attr('src','/images/shopping/sort_normal.png');
            break;
        case "金额":
            //最新反序排列
            $(this).find('.sort').attr('src','/images/shopping/sort.png');
            $(this).siblings().find('.sort').attr('src','/images/shopping/sort_down.png');
            break;
        case "销量":
            //最新反序排列
            $(this).find('.sort').attr('src','/images/shopping/sort_down_orange.png');
            $('.first .sort').attr('src','/images/shopping/sort_down.png');
            $('.second .sort').attr('src','/images/shopping/sort_normal.png');
            break;
    }
})