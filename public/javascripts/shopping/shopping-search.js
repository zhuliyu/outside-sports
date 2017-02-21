/**
 * Created by e on 17/2/9.
 */
$('.search-content').focus(function(){
    $('.cancel').css('opacity',1);
})
$('.search-content').blur(function(){
    $('.cancel').css('opacity',0);
})
$('.cancel').click(function(){
    $('.search-content').val('');
})
$('.search-content').keypress(function(e){
    var keyCode = (event.keyCode ? event.keyCode : event.which);
    if(keyCode == '13'){
        const keyword = $(this).val();
        $(this).blur();
        search(keyword);
    }
})
//搜索
function search(a){
    if(a != ''){
        location.href = `/shopping/search?keyword=${a}`;
    }
}