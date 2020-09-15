var VisibleMenu = ''; // 記錄目前顯示的子選單的 ID

// 顯示或隱藏子選單
function switchMenu( theMainMenu, theSubMenu, theEvent ){
    var SubMenu = document.getElementById( theSubMenu );
    if( SubMenu.style.display == 'none' ){ // 顯示子選單
        SubMenu.style.minWidth = theMainMenu.clientWidth; // 讓子選單的最小寬度與主選單相同 (僅為了美觀)
        SubMenu.style.display = 'block';
        hideMenu(); // 隱藏子選單
        VisibleMenu = theSubMenu;
    }
    else{ // 隱藏子選單
        if( theEvent != 'MouseOver' || VisibleMenu != theSubMenu ){
            SubMenu.style.display = 'none';
            VisibleMenu = '';
        }
    }
}

// 隱藏子選單
function hideMenu(){
    if( VisibleMenu != '' ){
        document.getElementById( VisibleMenu ).style.display = 'none';
    }
    VisibleMenu = '';
}


// 滑動監聽
window.onscroll = function (){
// 滑到底部時footer定於最下方,假定<footer>的height為60 
if ((getScrollHeight() - getScrollTop() - getWindowHeight()) > 51 )    
  $('.footer').css('position',' fixed' );        
 else
   $('.footer').css('position','relative' );
   }


$('.modal').on('shown.bs.modal', function() {
   $(".modal-body").css("padding",'0px');
});


function submit(Obj) {
/*if(Obj.className =="default")
{Obj.className = "after_click";}
    else {Obj.className ="default";}*/
  Obj.className =  (Obj.className =="item1_all")? "after_click":"item1_all";
};

var count = 0;
 function showDetail()
 {
     count++;
     if (count % 2 == 1) {
         $('.sub-menu').css("display", "inline-block");
         $('.arrow-btn').css("transform", "rotate(180deg)");
     }
     else {
         $('.sub-menu').css("display", "none");
         $('.arrow-btn').css("transform", "rotate(0deg)");
     }
 }

