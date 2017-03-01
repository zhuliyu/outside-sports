/**
 * Created by e on 17/2/28.
 */
const content = $('.content-container')[0].dataset.content;
$('.content-container').append(content);
let flag = true;
$('.static span.do').click(function(){
    if (flag) {
        const params = {
            id: $(this)[0].dataset.id,
        };
        flag = ! flag;
        let num = parseInt($('.num').text());
        num++;
        $('.num').text(num);
        $('.zan').attr('src', '/images/youji/zan_close.png');
        $('.increase').animate({'opacity': '1', 'top': '-20px'}, 500, function() {
            $('.increase').animate({'opacity': '0'}, 50, function() {
                $('.increase').css('top', '0');
            });
        });
        $.post('/youji/read/zan', params);
    }
});