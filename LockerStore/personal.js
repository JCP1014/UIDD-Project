// var count = 0;
// function showDetail()
//  {
//      count++;
//      if (count % 2 == 0) {
//          $('.right_side').css("display", "inline-block");
//          $('.arrow-img').css("transform", "rotate(180deg)");
//       $('.middle').css("float", "left");
//       $('.left_side').css("display", "none");
//      }
//      else {
//          $('.right_side').css("display", "none");
//          $('.arrow-img').css("transform", "rotate(0deg)");
//       $('.middle').css("float", "right");
//       $('.left_side').css("display", "inline-block");
//      }
//  }

var personal_state = 1;
$('#menu_btn').click(function () {
    $('#hamburger').animate({ left: "0" }, 200);
});
$('#foldPersonal_btn').click(function () {
    switch (personal_state) {
        case 1:
            {
                $('#hamburger').animate({ left: "-100vw" }, 200);
                personal_state = 1;
                break;
            }
        case 2:
            {
                $('.right_side').css("display", "none");
                $('.arrow-img').css("transform", "rotate(0deg)");
                $('.middle').css("float", "right");
                $('.left_side').css("display", "inline-block");
                personal_state = 1;
                break;
            }
    }
});

$('#showDetail_btn').click(function () {
    personal_state = 2;
    $('.right_side').css("display", "inline-block");
    $('.arrow-img').css("transform", "rotate(180deg)");
    $('.middle').css("float", "left");
    $('.left_side').css("display", "none");
});