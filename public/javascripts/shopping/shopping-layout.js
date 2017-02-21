/**
 * Created by e on 17/2/7.
 */
$('.divide').click(function(){
    $('.shopping-index-fenlei').toggle();
})
if(window.location.pathname.match('/shopping/search') || window.location.pathname.match('/shopping/orders')){
    $('.shopping-index-top').remove();
}