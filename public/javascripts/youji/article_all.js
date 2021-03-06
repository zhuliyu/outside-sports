/**
 * Created by e on 17/2/28.
 */
let page = 1;
let list = true;
$('.youji-index-container').on('click', '.youji-list-all-container', function() {
    const id = $(this)[0].dataset.id;
    location.href = `/youji/read?id=${id}`;
});
$('.loadMore').click(function(){
    page++;
    $('body').scrollTop($(this).offset().top);
    if (list) {
        $('.loading')[0].style.display='block';
        setTimeout(function() {
            getMore(page);
        }, 500);
    } else {
        alert('到底啦');
    }
});
$('.toTop').click(function(){
    $('body').animate({scrollTop: '0px'}, 1000, function() {
        $('.toTop').hide();
    });
})
//loading();
function getMore(page) {
    $.post('/youji', {
        page: page,
    }, function(err, res, data) {
        if (data.responseJSON.length == 0) {
            list = false;
            $('.loading').hide();
        } else {
            if (data.responseJSON.length < 10) {
                list = false;
            }
            $('.toTop').show();
            let text = '';
            for(let i = 0; i < data.responseJSON.length; i++) {
                text += `<div class="youji-list-all-container" data-id=${data.responseJSON[i].article_id}>`+
                    `<div class="youji-list-all-container-item first">`+
                    `<p class="good">`+
                    `<img class="zan" src="/images/youji/good.png" align="top"/>&nbsp;${data.responseJSON[i].good}&nbsp;`+
                    `</p>`+
                    `<img class="cover" src=${data.responseJSON[i].cover}/>`+
                    `</div>`+
                    `<div class="youji-list-all-container-item second">`+
                    `<p>${data.responseJSON[i].title}</p>`+
                    `<p class="author">${data.responseJSON[i].author}&nbsp;<span>${data.responseJSON[i].date}</span></p>`+
                    `<p class="content">${data.responseJSON[i].contentText.slice(0, 20)+'...'}</p>`+
                    `</div>`+
                    `</div>`;
            }
            $('.youji-index-container').append(text);
            $('.loading')[0].style.display='none';
        }
    });
}