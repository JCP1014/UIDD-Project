function showLeft()
{
    $('.order-content-left').css("display", "block");
    $('.order-content-mid').css("display", "none");
    $('.order-content-right').css("display", "none");
}

function showMid()
{
    $('.order-content-left').css("display", "none");
    $('.order-content-mid').css("display", "block");
    $('.order-content-right').css("display", "none");
}

function showRight()
{
    $('.order-content-left').css("display", "none");
    $('.order-content-mid').css("display", "none");
    $('.order-content-right').css("display", "block");
}

var count = 0;
function showDetail(myObj)
{
<<<<<<< HEAD
    

    count++;
    if (count % 2 == 1) {
        $('.order-object-detail').css("display", "inline-block");
        (myObj.id).css("transform", "rotate(180deg)");
    }
    else {
        $('.order-object-detail').css("display", "none");
        (myObj.id).css("transform", "rotate(0deg)");
=======
    if($('.order-object-detail').css("display")=='none') {
        $('.order-object-detail').css("display", "inline-block");
        $('.arrow-btn').css("transform", "rotate(180deg)");
    }
    else {
        $('.order-object-detail').css("display", "none");
        $('.arrow-btn').css("transform", "rotate(0deg)");
>>>>>>> 3ed5fc50cb46fcf07732df13ae63f91d8a9dd57a
    }
}