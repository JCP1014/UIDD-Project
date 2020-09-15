var count = 0;
function showDetail()
 {
     count++;
     if (count % 2 == 0) {
         $('.right_side').css("display", "inline-block");
         $('.arrow-img').css("transform", "rotate(180deg)");
      $('.middle').css("float", "left");
      $('.left_side').css("display", "none");
     }
     else {
         $('.right_side').css("display", "none");
         $('.arrow-img').css("transform", "rotate(0deg)");
      $('.middle').css("float", "right");
      $('.left_side').css("display", "inline-block");
     }
 }
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
