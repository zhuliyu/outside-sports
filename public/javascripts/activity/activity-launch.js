/**
 * Created by e on 17/3/8.
 */
$(function() {
   $('#launchForm').submit(function() {
       const content = editor.getContent();
       const time = new Date($('#launch-endDate').val()) - (new Date());
       if (time > 0) {
           if (isPhoneNo($('#launch-tel').val())) {
               const flag = confirm('请核对您的信息, 一经提交无法修改');
               if (flag) {
                   const data = `${$(this).serialize()}&activity_introduction=${content}&type=1`;
                   $.post('/activity/launch', data, function(err, res, body) {
                       if (err) {
                           alert('网络异常请重试!');
                       }
                       if (body.responseText == '1') {
                           alert('正在召集天下英豪!');
                           location.href = '/activity/gather';
                       }
                   })
               }
           } else {
               alert('请填写有效手机号!');
           }
       } else {
           alert('请选择正确时间');
       }
       return false;
   })
});
function isPhoneNo(phone) {
    var pattern = /^1[34578]\d{9}$/;
    return pattern.test(phone);
}