$(document).ready(() => {
  /****************** Animation in the part of What_we_do ******************/
  /* First Time */
  document.getElementById("d1").id = "d1_show";
  setTimeout(function () {
    document.getElementById("d2").id = "d2_show";
  }, 1500);
  setTimeout(function () {
    document.getElementById("d3").id = "d3_show";
  }, 3000);
  setTimeout(function () {
    document.getElementById("d4").id = "d4_show";
  }, 4500);
  setTimeout(function () {
    document.getElementById("d5").id = "d5_show";
  }, 6000);
  setTimeout(function () {
    document.getElementById("d6").id = "d6_show";
  }, 7500);
  setTimeout(function () {
    document.getElementById("d1_show").id = "d1";
  }, 3000);
  setTimeout(function () {
    document.getElementById("d2_show").id = "d2";
  }, 4500);
  setTimeout(function () {
    document.getElementById("d3_show").id = "d3";
  }, 6000);
  setTimeout(function () {
    document.getElementById("d4_show").id = "d4";
  }, 7500);
  setTimeout(function () {
    document.getElementById("d5_show").id = "d5";
  }, 9000);
  setTimeout(function () {
    document.getElementById("d6_show").id = "d6";
  }, 10500);

  /* Replay */
  setInterval(() => {
    document.getElementById("d1").id = "d1_show";
    setTimeout(function () {
      document.getElementById("d2").id = "d2_show";
    }, 1500);
    setTimeout(function () {
      document.getElementById("d3").id = "d3_show";
    }, 3000);
    setTimeout(function () {
      document.getElementById("d4").id = "d4_show";
    }, 4500);
    setTimeout(function () {
      document.getElementById("d5").id = "d5_show";
    }, 6000);
    setTimeout(function () {
      document.getElementById("d6").id = "d6_show";
    }, 7500);
    setTimeout(function () {
      document.getElementById("d1_show").id = "d1";
    }, 3000);
    setTimeout(function () {
      document.getElementById("d2_show").id = "d2";
    }, 4500);
    setTimeout(function () {
      document.getElementById("d3_show").id = "d3";
    }, 6000);
    setTimeout(function () {
      document.getElementById("d4_show").id = "d4";
    }, 7500);
    setTimeout(function () {
      document.getElementById("d5_show").id = "d5";
    }, 9000);
    setTimeout(function () {
      document.getElementById("d6_show").id = "d6";
    }, 10500);
  }, 9000);

  /****************** Animation in the part of Our_approach ******************/
  /* First Time */
  document.getElementById("logo_2").id = "logo_2_show";
  setTimeout(function () {
    document.getElementById("logo_1").id = "logo_1_show";
  }, 1000);
  setTimeout(function () {
    document.getElementById("logo_4").id = "logo_4_show";
  }, 2000);
  setTimeout(function () {
    document.getElementById("logo_3").id = "logo_3_show";
  }, 3000);
  setTimeout(function () {
    document.getElementById("logo_2_show").id = "logo_2_hide";
  }, 4000);
  setTimeout(function () {
    document.getElementById("logo_1_show").id = "logo_1_hide";
  }, 4000);
  setTimeout(function () {
    document.getElementById("logo_4_show").id = "logo_4_hide";
  }, 4000);
  setTimeout(function () {
    document.getElementById("logo_3_show").id = "logo_3_hide";
  }, 4000);
  setTimeout(function () {
    document.getElementById("logo_2_hide").id = "logo_2";
  }, 5000);
  setTimeout(function () {
    document.getElementById("logo_1_hide").id = "logo_1";
  }, 5000);
  setTimeout(function () {
    document.getElementById("logo_4_hide").id = "logo_4";
  }, 5000);
  setTimeout(function () {
    document.getElementById("logo_3_hide").id = "logo_3";
  }, 5000);

  /* Replay */
  setInterval(() => {
    document.getElementById("logo_2").id = "logo_2_show";
    setTimeout(function () {
      document.getElementById("logo_1").id = "logo_1_show";
    }, 1000);
    setTimeout(function () {
      document.getElementById("logo_4").id = "logo_4_show";
    }, 2000);
    setTimeout(function () {
      document.getElementById("logo_3").id = "logo_3_show";
    }, 3000);
    setTimeout(function () {
      document.getElementById("logo_2_show").id = "logo_2_hide";
    }, 4000);
    setTimeout(function () {
      document.getElementById("logo_1_show").id = "logo_1_hide";
    }, 4000);
    setTimeout(function () {
      document.getElementById("logo_4_show").id = "logo_4_hide";
    }, 4000);
    setTimeout(function () {
      document.getElementById("logo_3_show").id = "logo_3_hide";
    }, 4000);
    setTimeout(function () {
      document.getElementById("logo_2_hide").id = "logo_2";
    }, 5000);
    setTimeout(function () {
      document.getElementById("logo_1_hide").id = "logo_1";
    }, 5000);
    setTimeout(function () {
      document.getElementById("logo_4_hide").id = "logo_4";
    }, 5000);
    setTimeout(function () {
      document.getElementById("logo_3_hide").id = "logo_3";
    }, 5000);
  }, 5500);
})

$('#find_btn').click(check_blank);
$("#addressBlank").on('keydown', function (e) {
  if (e.keyCode === 13) { // Detect 'enter' is pressed when focus on addressBlank
    check_blank();
  }
});

/********** Check whether the input address is empty when submitting the form ***********/
function check_blank() {
  var addr = $('#addressBlank').val();
  if (!addr.length) {
    event.preventDefault();
    alert("Please ensure that you have entered delivery address");
  }
}

/********** Control animations in the part of who_we_are *************/
window.on_a = function () {
  document.getElementById("pic_a").className = "pic_a_in";
  document.getElementById("cover_a").className = "cover_a_open";
  document.getElementById("name_a").className = "name_a_in";
  document.getElementById("intro_a").className = "intro_a_in";
}
window.out_a = function () {
  document.getElementById("cover_a").className = "cover_a_close";
  document.getElementById("name_a").className = "name_a_out";
  document.getElementById("intro_a").className = "intro_a_out";
}
window.on_b = function () {
  document.getElementById("pic_b").className = "pic_a_in";
  document.getElementById("cover_b").className = "cover_b_open";
  document.getElementById("name_b").className = "name_b_in";
  document.getElementById("intro_b").className = "intro_b_in";
}
window.out_b = function () {
  document.getElementById("cover_b").className = "cover_b_close";
  document.getElementById("name_b").className = "name_b_out";
  document.getElementById("intro_b").className = "intro_b_out";
}
window.on_c = function () {
  document.getElementById("pic_c").className = "pic_a_in";
  document.getElementById("cover_c").className = "cover_b_open";
  document.getElementById("name_c").className = "name_b_in";
  document.getElementById("intro_c").className = "intro_b_in";
}
window.out_c = function () {
  document.getElementById("cover_c").className = "cover_b_close";
  document.getElementById("name_c").className = "name_b_out";
  document.getElementById("intro_c").className = "intro_b_out";
}
window.on_d = function () {
  document.getElementById("pic_d").className = "pic_a_in";
  document.getElementById("cover_d").className = "cover_a_open";
  document.getElementById("name_d").className = "name_a_in";
  document.getElementById("intro_d").className = "intro_a_in";
}
window.out_d = function () {
  document.getElementById("cover_d").className = "cover_a_close";
  document.getElementById("name_d").className = "name_a_out";
  document.getElementById("intro_d").className = "intro_a_out";
}
window.on_e = function () {
  document.getElementById("pic_e").className = "pic_a_in";
  document.getElementById("cover_e").className = "cover_a_open";
  document.getElementById("name_e").className = "name_a_in";
  document.getElementById("intro_e").className = "intro_a_in";
}
window.out_e = function () {
  document.getElementById("cover_e").className = "cover_a_close";
  document.getElementById("name_e").className = "name_a_out";
  document.getElementById("intro_e").className = "intro_a_out";
}
window.on_all = function () {
  document.getElementById("pic_a").className = "pic_a_in";
  document.getElementById("cover_a").className = "cover_a_open";
  document.getElementById("name_a").className = "name_a_in";
  document.getElementById("intro_a").className = "intro_a_in";
  document.getElementById("pic_b").className = "pic_a_in";
  document.getElementById("cover_b").className = "cover_b_open";
  document.getElementById("name_b").className = "name_b_in";
  document.getElementById("intro_b").className = "intro_b_in";
  document.getElementById("pic_c").className = "pic_a_in";
  document.getElementById("cover_c").className = "cover_b_open";
  document.getElementById("name_c").className = "name_b_in";
  document.getElementById("intro_c").className = "intro_b_in";
  document.getElementById("pic_d").className = "pic_a_in";
  document.getElementById("cover_d").className = "cover_a_open";
  document.getElementById("name_d").className = "name_a_in";
  document.getElementById("intro_d").className = "intro_a_in";
  document.getElementById("pic_e").className = "pic_a_in";
  document.getElementById("cover_e").className = "cover_a_open";
  document.getElementById("name_e").className = "name_a_in";
  document.getElementById("intro_e").className = "intro_a_in";
}
window.out_all = function () {
  document.getElementById("pic_a").className = "pic_a_in";
  document.getElementById("cover_a").className = "cover_a_close";
  document.getElementById("name_a").className = "name_a_out";
  document.getElementById("intro_a").className = "intro_a_out";
  document.getElementById("pic_b").className = "pic_a_in";
  document.getElementById("cover_b").className = "cover_b_close";
  document.getElementById("name_b").className = "name_b_out";
  document.getElementById("intro_b").className = "intro_b_out";
  document.getElementById("pic_c").className = "pic_a_in";
  document.getElementById("cover_c").className = "cover_b_close";
  document.getElementById("name_c").className = "name_b_out";
  document.getElementById("intro_c").className = "intro_b_out";
  document.getElementById("pic_d").className = "pic_a_in";
  document.getElementById("cover_d").className = "cover_a_close";
  document.getElementById("name_d").className = "name_a_out";
  document.getElementById("intro_d").className = "intro_a_out";
  document.getElementById("pic_e").className = "pic_a_in";
  document.getElementById("cover_e").className = "cover_a_close";
  document.getElementById("name_e").className = "name_a_out";
  document.getElementById("intro_e").className = "intro_a_out";
}
function reset_animation() {
  var slogan = document.getElementById('slogan');
  var searchBar = document.getElementById('search_bar');
  slogan.style.animation = 'none';
  slogan.offsetHeight; /* trigger reflow */
  slogan.style.animation = null;
  searchBar.style.animation = 'none';
  searchBar.offsetHeight; /* trigger reflow */
  searchBar.style.animation = null;
}

//back to top
$(function () {

  var $win = $(window);

  //var $backToTop = $('.back_btn');
  var $backToTop = $('footer');

  // 當用戶點擊按鈕時，通過動畫效果返回頭部

  $backToTop.click(function () {

    $('html, body').animate({ scrollTop: 0 }, 200);
  });

});

$(window).scroll(function () {
  if ($(window).scrollTop() > $(window).height() * 1 && $(window).scrollTop() <= $(window).height() * 1.5) {
    reset_animation();
  }
})
