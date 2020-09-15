$(function() {
    // This button will increment the value
    $('.spc-qty-plus').click(function(e) {
      // Stop acting like a button
      e.preventDefault();
      // Get the field name
      fieldName = $(this).attr('field');
      // Get its current value
      var currentVal = parseInt($('input[name=' + fieldName + ']').val());
      // If is not undefined
      if (!isNaN(currentVal)) {
        // Increment
        $('input[name=' + fieldName + ']').val(currentVal + 1);
      } else {
        // Otherwise put a 0 there
        $('input[name=' + fieldName + ']').val(0);
      }
    });
    // This button will decrement the value till 0
    $(".spc-qty-minus").click(function(e) {
      // Stop acting like a button
      e.preventDefault();
      // Get the field name
      fieldName = $(this).attr('field');
      // Get its current value
      var currentVal = parseInt($('input[name=' + fieldName + ']').val());
      // If it isn't undefined or its greater than 0
      if (!isNaN(currentVal) && currentVal > 0) {
        // Decrement one
        $('input[name=' + fieldName + ']').val(currentVal - 1);
      } else {
        // Otherwise put a 0 there
        $('input[name=' + fieldName + ']').val(0);
     }
   });
});

function SelectAll(obj,cName) {
    var checkboxs = document.getElementsByName(cName);
    for(var i=0;i<checkboxs.length;i++){checkboxs[i].checked = obj.checked;}
};

/*$(function () {
    var checkboxs = document.getElementsByClassName("spc-checkbox");
    var orderButton = document.getElementById("spc-order");
    
    for(var i=0;i<checkboxs.length;i++){
        var a = 0;

        if(checkboxs[i].checked == true) { a++; }

        if(a != 0){
            orderButton.disabled = false;
        }else{
            orderButton.disabled = true;
        }
    }
     
});*/

function SwitchToCheckout(){
    $('.screen').css("display","none");
    $('#check-out').css("display","block");
}
function SwitchToShoppingcart(){
    $('.screen').css("display","none");
    $('#shopping-cart').css("display","block");
}
function SpcEdit(Obj){
    Obj.innerText = "完成";
    Obj.setAttribute("onclick","SpcEditDone(this)");
    $('.spc-qty').css("display","none");
    $('.spc-item-delete').css("display","block");
}
function SpcEditDone(Obj){
    Obj.innerText = "編輯";
    Obj.setAttribute("onclick","SpcEdit(this)");
    $('.spc-qty').css("display","block");
    $('.spc-item-delete').css("display","none");
}

/* group share */
function GroupShare(){
  $('#group-share').css("display","block");
}
$(document).mouseup(function(e){
  var _con = $('#group-share');
  if(!_con.is(e.target) && _con.has(e.target).length === 0){ 
    $('#group-share').css("display","none");
  }
});

/* map position */
function OpenMap(){
  $('#map-position').css("display","block");
}
function CloseMap(){
  $('#map-position').css("display","none");
}
$(document).mouseup(function(e){
  var _con = $('#map-position');
  if(!_con.is(e.target) && _con.has(e.target).length === 0){ 
    $('#map-position').css("display","none");
  }
});

/* payment choose */
function OpenPayment(){
  $('#choose-payment').css("display","block");
}
function ClosePayment(){
  $('#choose-payment').css("display","none");
}
var cash = document.getElementById('choose-payment-cash');
var bank = document.getElementById('choose-payment-bank');
var card = document.getElementById('choose-payment-card');
var payment = document.getElementById('cko-payment-choose');
function PaymentCash(){
  payment.innerHTML = '貨到付款';
  payment.style.color = 'white';
  payment.style.backgroundColor = '#F38200';
  cash.style.color = 'white';
  cash.style.backgroundColor = '#F38200';
  bank.style.color = '#F38200';
  bank.style.backgroundColor = 'white';
  card.style.color = '#F38200';
  card.style.backgroundColor = 'white';
}
function PaymentBank(){
  payment.innerHTML = '銀行轉帳';
  payment.style.color = 'white';
  payment.style.backgroundColor = '#F38200';
  bank.style.color = 'white';
  bank.style.backgroundColor = '#F38200';
  cash.style.color = '#F38200';
  cash.style.backgroundColor = 'white';
  card.style.color = '#F38200';
  card.style.backgroundColor = 'white';
}
function PaymentCard(){
  payment.innerHTML = '信用卡 / 金融卡';
  payment.style.color = 'white';
  payment.style.backgroundColor = '#F38200';
  card.style.color = 'white';
  card.style.backgroundColor = '#F38200';
  cash.style.color = '#F38200';
  cash.style.backgroundColor = 'white';
  bank.style.color = '#F38200';
  bank.style.backgroundColor = 'white';
}
$(document).mouseup(function(e){
  var _con = $('#choose-payment');
  if(!_con.is(e.target) && _con.has(e.target).length === 0){ 
    $('#choose-payment').css("display","none");
  }
});

function OpenOption(){
  $('#item-option').css("display","block");
}
function CloseOption(){
  $('#item-option').css("display","none");
}
$(document).mouseup(function(e){
  var _con = $('#item-option');
  if(!_con.is(e.target) && _con.has(e.target).length === 0){ 
    $('#item-option').css("display","none");
  }
});

var i10 = document.getElementById('item-option-ice-10');
var i7 = document.getElementById('item-option-ice-7');
var i3 = document.getElementById('item-option-ice-3');
var i0 = document.getElementById('item-option-ice-0');
var s10 = document.getElementById('item-option-sugar-10');
var s5 = document.getElementById('item-option-sugar-5');
var s3 = document.getElementById('item-option-sugar-3');
var s0 = document.getElementById('item-option-sugar-0');

function Ice10(){
  i10.style.color = 'white';
  i10.style.backgroundColor = '#F38200';
  i7.style.color = '#717071';
  i7.style.backgroundColor = '#C9C9CA';
  i3.style.color = '#717071';
  i3.style.backgroundColor = '#C9C9CA';
  i0.style.color = '#717071';
  i0.style.backgroundColor = '#C9C9CA';
}
function Ice7(){
  i7.style.color = 'white';
  i7.style.backgroundColor = '#F38200';
  i10.style.color = '#717071';
  i10.style.backgroundColor = '#C9C9CA';
  i3.style.color = '#717071';
  i3.style.backgroundColor = '#C9C9CA';
  i0.style.color = '#717071';
  i0.style.backgroundColor = '#C9C9CA';
}
function Ice3(){
  i3.style.color = 'white';
  i3.style.backgroundColor = '#F38200';
  i7.style.color = '#717071';
  i7.style.backgroundColor = '#C9C9CA';
  i10.style.color = '#717071';
  i10.style.backgroundColor = '#C9C9CA';
  i0.style.color = '#717071';
  i0.style.backgroundColor = '#C9C9CA';
}
function Ice0(){
  i0.style.color = 'white';
  i0.style.backgroundColor = '#F38200';
  i7.style.color = '#717071';
  i7.style.backgroundColor = '#C9C9CA';
  i3.style.color = '#717071';
  i3.style.backgroundColor = '#C9C9CA';
  i10.style.color = '#717071';
  i10.style.backgroundColor = '#C9C9CA';
}
function Sugar10(){
  s10.style.color = 'white';
  s10.style.backgroundColor = '#F38200';
  s5.style.color = '#717071';
  s5.style.backgroundColor = '#C9C9CA';
  s3.style.color = '#717071';
  s3.style.backgroundColor = '#C9C9CA';
  s0.style.color = '#717071';
  s0.style.backgroundColor = '#C9C9CA';
}
function Sugar5(){
  s5.style.color = 'white';
  s5.style.backgroundColor = '#F38200';
  s10.style.color = '#717071';
  s10.style.backgroundColor = '#C9C9CA';
  s3.style.color = '#717071';
  s3.style.backgroundColor = '#C9C9CA';
  s0.style.color = '#717071';
  s0.style.backgroundColor = '#C9C9CA';
}
function Sugar3(){
  s3.style.color = 'white';
  s3.style.backgroundColor = '#F38200';
  s5.style.color = '#717071';
  s5.style.backgroundColor = '#C9C9CA';
  s10.style.color = '#717071';
  s10.style.backgroundColor = '#C9C9CA';
  s0.style.color = '#717071';
  s0.style.backgroundColor = '#C9C9CA';
}
function Sugar0(){
  s0.style.color = 'white';
  s0.style.backgroundColor = '#F38200';
  s5.style.color = '#717071';
  s5.style.backgroundColor = '#C9C9CA';
  s3.style.color = '#717071';
  s3.style.backgroundColor = '#C9C9CA';
  s10.style.color = '#717071';
  s10.style.backgroundColor = '#C9C9CA';
}