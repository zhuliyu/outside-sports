/**
 * Created by e on 17/3/10.
 */
const info = $('.activity-content')[0].dataset.info;
$('.activity-content').append(info);

const params = {
    activity_id: $('.activity_id').val(),
};
/*获取剩余积分*/
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
/*弹出模态框*/
$('#join').click(function() {
    if ($('.leastNum').text() !== '0') {
        $('.activity-join-modal').show();
        $('.telephone').focus();
    } else {
        alert('名额已满');
    }
});
/*退出活动*/
$('#exit').click(function() {
    let flag = confirm('请确定与令主沟通后再退出本次活动吧~');
    if (flag) {
        console.log($(this)[0].dataset.object);
        const _params = {
            _id: $(this)[0].dataset.object,
        };
        exit_activity(_params);
    }
});

/*令主删除活动*/
$('#delete').click(function() {
    let flag = confirm('确定要撤销本次活动?别忘了和参与者打个招呼哦~');
    if (flag) {
        cancel(params);
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
function exit_activity(params) {
    fetch('/activity/join/exit', {
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
        alert('删除成功');
        location.href = window.location;
    })
    .catch((e) => {
        alert('网络异常,请重试');
    })
}

function cancel(params) {
    fetch('/activity/join/cancel', {
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
            if (data.result == 1) {
                alert('删除成功');
                location.href = '/activity/gather';
            } else {
                alert('网络异常,请刷新后重试~');
                location.href= window.location;
            }
        })
        .catch((e) => {
            alert('网络异常,请重试');
        })
}
