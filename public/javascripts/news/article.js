/**
 * Created by e on 17/2/27.
 */
let cover = '';
//上传封面
$('.choose-container').change(function(e){
    var file= e.target.files[0];
    var img = new Image(), url = img.src = URL.createObjectURL(file);
    var $img = $(img);
    var le=$('.inputFile').val().split('.')[1];
    if(le=='jpeg'||le=='png'||le=='gif'||le=='jpg'){
        var formData=new FormData($('#img-upload')[0]);
        $.ajax({
            type: 'post',
            url: '/news/travelNotes/upload',
            data: formData,
            dataType: 'json',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.result==2){
                    showResult('服务器异常');
                }else{
                    showResult('封面上传成功');
                    var img='<img src="'+data.image+'" style="width:100%;height:100%;"/>';
                    $('.target').empty().append(img);
                    cover = data.image;
                }
            },
            error:function(data){
                showResult('图片格式不正确');
            }
        })
    }else{
        showResult('图片格式不正确');
    }
});
$('.save').click(function() {
    const content = editor.getContent();         //所有内容
    const contentText = editor.getContentTxt();   //纯文本
    const title = $('.youji-input').val();
    if (content == '' || cover == '' || title == '' || contentText == '') {
        showResult('请补全信息');
    } else {
        const data = {
            title: title,
            content: content,
            contentText: contentText,
            cover: cover,
            date: new Date(),
            read: 0,
            good: 0,
        }
        $.post('/news/travelNotes/save', data, (err, body) => {
            if (err) {
                showResult('服务器异常');
            }
            showResult('保存成功');
            setTimeout(function () {
                location.href= '/youji/myArticles';
            }, 1300);
        })
    }
});
$('.yulan').click(function() {
    const title = $('.youji-input').val();
    const content = editor.getContent();
    $('.modal .title').empty().append(title);
    $('.modal .content').empty().append(content);
    $('.modal').show();
});
$('.close-modal').click(function() {
    $('.modal').hide();
});
$('.back').click(function() {
    const f = confirm('放弃本次编辑?');
    if (f) {
        location.href = '/youji/myArticles';
    }
});
function showResult(b){
    $('.word').text(b);
    $('.showResult').animate({'opacity':'1'},100,function(){
        $(this).animate({'opacity':'0'},1000);
    })
}