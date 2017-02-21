/**
 * Created by e on 17/1/22.
 */
$(function () {
    $('nav.headerbar').css('top','0');
    const direct=window.location;
    $('#carousel-ad').carousel();
    let flag = true;
    $('.navbar-header button').click(function(){
        if(flag){
            $('.index-container').css('top', '200px');
            flag=!flag;
        }else{
            $('.index-container').css('top', '40px');
            flag=!flag;
        }
    })
    $('.login').click(function(){
        location.href='/users/login';
    })
    $('.register').click(function () {
        location.href = '/users/regist';
    })
})