/**
 * Created by e on 17/3/6.
 */
$(function() {
    let items = $('.article-list-item');
    const items_width = $('.article-list-item').width();
    const arr = [];
    for (let j = 0; j < items.length; j++) {
        if (j < 3) {
            let left = items_width*(j)+j*5;
            items.eq(j).css({'left': left, 'top': 0});
            arr.push(parseFloat(items.eq(j).css('height'))+5);
        } else {
            let mix = Math.min.apply(null, arr);
            let index = findIndex(mix, arr);
            let left = items_width*index+index*5;
            items.eq(j).css({'left': left, 'top': arr[index]});
            let height = parseFloat(items.eq(j).css('top')) + items.eq(j).height()+5;
            arr[index] = height;
        }
    }
    const max_height = Math.max.apply(null, arr);
    $('.activity-guanfang-container.third').css('height', max_height+ 100);

    items.click(function(){
        const id = $(this)[0].dataset.id;
        location.href = `/youji/read?id=${id}`;
    })
});
function findIndex(mix, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == mix) {
            return i;
        }
    }
}
