/**
 * Created by e on 17/3/10.
 */
const info = $('.activity-content')[0].dataset.info;
$('.activity-content').append(info);

const params = {
    activity_id: $('.activity_id').val(),
};
getLeast(params);
$('.open_info').click(function () {
    if ($('.open_info img').attr('src') === '/images/activity/arrow_down.png') {
        $('.open_info img').attr('src', '/images/activity/arrow_up.png');
        $('.activity-content').show();
    } else {
        $('.open_info img').attr('src', '/images/activity/arrow_down.png');
        $('.activity-content').hide();
    }
});
$('#join').click(function() {
    if ($('.leastNum').text() !== '0') {
        $('.activity-join-modal').show();
        $('.telephone').focus();
    } else {
        alert('名额已满');
    }
});
$('.close').click(function() {
    $('.activity-join-modal').hide();
});
$('.activity-join-modal').click(function() {
    $('.activity-join-modal').hide();
});
$('.join-container').click(function(e) {
    e.stopPropagation();
});
$('#myform').submit(function() {
    const l = $('.telephone').val().length;
    if (l !== 11) {
        alert('请输入正确的号码');
        return false;
    }
    return true;
});

function getLeast(params) {
    fetch('/activity/join/leastNum', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
    .then((response) => {
        return response.json();
    })
    .then((body) => {
        const limit = parseInt($('.total-num').text());
        $('.leastNum').text(limit - parseInt(body.total) -1);
        if (limit - parseInt(body.total) -1 == 0) {
            $('#join').attr('disabled', true);
        }
    })
    .catch((e) => {
        alert('网络异常,获取失败');
    })
}
