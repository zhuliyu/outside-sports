/**
 * Created by e on 17/3/1.
 */
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

    console.log();
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
});
$('.youji-index-container').on('click', '.operator-my-item.first', function(e) {
    e.stopPropagation();
    const id = $(this).parent().parent()[0].dataset.id;
    const flag = confirm('确定要删除吗?');
    if (flag) {
        const params = {
            id: id,
        };
        $.post('/youji/myArticles/delete', params, (err, res, body) => {
            if (body.responseJSON.result == 1) {
                alert('删除成功!');
                $(this).parent().parent().remove();
            } else {
                alert('网络异常,请重试!');
            }
        })
    }
});
$('.youji-index-container').on('click', '.operator-my-item.second', function(e) {
    e.stopPropagation();
    const id = $(this).parent().parent()[0].dataset.id;
    location.href= `/news/travelNotes/edit?id=${id}`;
});

//loading();
function getMore(page) {
    $.post('/youji/myArticles', {
        page: page,
    }, function(err, res, data) {
        if (data.responseJSON.length == 0) {
            $('.loading').hide();
            list = false;
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
                    `<p class="author"><span>${data.responseJSON[i].date}</span></p>`+
                    `<p class="content">${data.responseJSON[i].contentText.slice(0, 20)+'...'}</p>`+
                    `</div>`+
                        `<div class="operator_my">`+
                            `<div class="operator-my-item first">`+
                                `<img class="delete" src="/images/youji/delete1.png" />`+
                            `</div>`+
                            `<div class="operator-my-item second">`+
                                `<img class="editor" src="/images/youji/edit4.png" />`+
                            `</div>`+
                        `</div>`+
                    `</div>`;
            }
            $('.youji-index-container').append(text);
            $('.loading')[0].style.display='none';
        }
    });
}
//每个文章动画效果切入js  从右至左
function loading() {
    $('.youji-list-all-container').animate({'left': '3%'}, 500);
    let num = $('.youji-list-all-container').length;
    let i = 1;
    ahah(i, num);
}
function ahah(i, num) {
    if(i <= num) {
        $(`.youji-list-all-container:nth-child(${i+1})`).animate({'top': (i-1)*130+140+'px'}, function(){
            i++;
            ahah(i, num);
        })
    } else {

    }
}