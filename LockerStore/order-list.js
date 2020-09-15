var a = document.getElementById('ol-grouping-button');
var b = document.getElementById('ol-undelivered-button');
var c = document.getElementById('ol-arrived-button');
var d = document.getElementById('ol-done-button');

function SwitchToGrouping(){
  $('.ol-page').css("display","none");
  $('#ol-grouping').css("display","block");
  a.style.color = 'white';
  a.style.backgroundColor = '#2C50A1';
  b.style.color = '#2C50A1';
  b.style.backgroundColor = 'white';
  c.style.color = '#2C50A1';
  c.style.backgroundColor = 'white';
  d.style.color = '#2C50A1';
  d.style.backgroundColor = 'white';
}
function SwitchToUndelivered(){
  $('.ol-page').css("display","none");
  $('#ol-undelivered').css("display","block");
  b.style.color = 'white';
  b.style.backgroundColor = '#2C50A1';
  a.style.color = '#2C50A1';
  a.style.backgroundColor = 'white';
  c.style.color = '#2C50A1';
  c.style.backgroundColor = 'white';
  d.style.color = '#2C50A1';
  d.style.backgroundColor = 'white';
}
function SwitchToArrived(){
  $('.ol-page').css("display","none");
  $('#ol-arrived').css("display","block");
  c.style.color = 'white';
  c.style.backgroundColor = '#2C50A1';
  a.style.color = '#2C50A1';
  a.style.backgroundColor = 'white';
  b.style.color = '#2C50A1';
  b.style.backgroundColor = 'white';
  d.style.color = '#2C50A1';
  d.style.backgroundColor = 'white';
}
function SwitchToDone(){
  $('.ol-page').css("display","none");
  $('#ol-done').css("display","block");
  d.style.color = 'white';
  d.style.backgroundColor = '#2C50A1';
  a.style.color = '#2C50A1';
  a.style.backgroundColor = 'white';
  b.style.color = '#2C50A1';
  b.style.backgroundColor = 'white';
  c.style.color = '#2C50A1';
  c.style.backgroundColor = 'white';
}

function SeeDetail(Obj){
  Obj.setAttribute("onclick","UnSeeDetail(this)");
  Obj.setAttribute("style", "transform:rotate(180deg)");
  $('.ol-item-list').css("display","block");
}
function UnSeeDetail(Obj){
  Obj.setAttribute("onclick","SeeDetail(this)");
  Obj.setAttribute("style", "transform:rotate(0)");
  $('.ol-item-list').css("display","none");
}

function SeeDetailPickup(Obj){
  Obj.setAttribute("onclick","UnSeeDetailPickup(this)");
  Obj.setAttribute("style", "transform:rotate(180deg)");
  $('.ol-pickup-info').css("display","block");
}
function UnSeeDetailPickup(Obj){
  Obj.setAttribute("onclick","SeeDetailPickup(this)");
  Obj.setAttribute("style", "transform:rotate(0)");
  $('.ol-pickup-info').css("display","none");
}

function SwitchToOrderlist(){
  $('.screen').css("display","none");
  $('#order-list').css("display","block");
}