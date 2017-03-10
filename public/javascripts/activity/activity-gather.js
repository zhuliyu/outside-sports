/**
 * Created by e on 17/3/9.
 */
$(function () {
    let page = 1,
        limit = 10;
    const total = $('.total').text();
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight == scrollHeight){
            if ($('.activity-list-container').length >= parseInt(total)) {
                //alert('已经到底啦');
                $('.noData').show();
            } else {
                page++;
                const params = {
                    page: page,
                    limit: limit,
                };
                doPost(params);
            }
        }
    });
    $('.gather-container').on('click', '.activity-list-container', function() {
        const id = $(this)[0].dataset.id;
        location.href = `/activity/join?id=${id}`;
    })
});
function doPost(params) {
    fetch('/activity/gather', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        let text = '';
        for (let i = 0; i < data.data.length; i++) {
            text += `<div class="activity-list-container" data-id=${data.data[i].activity_id}>`+
                        `<div class="activity-list-items">${data.data[i].limit}</div>`+
                        `<div class="activity-list-items">`;
            if (data.data[i].type == 0) {
                text += `<p class="type"><img src="/images/activity/type1.png" /></p>`;
            }
            text += `<p class="activity-title">${data.data[i].activity_title}</p><p class="gather-information">${data.data[i].gather_place}</p>`+
                `<p class="launcher"><span style="color: dark">${data.data[i].launcher_name}</span> 发布于 ${data.data[i].date}</p>`;
        }
        $('.gather-container').append(text);
    })
    .catch((err) => {
        alert('数据君在冒险,请稍后');
    })
}
