$(document).ready(function() {
  $('#ajax-form button[type="submit"]').click((event) => {
    event.preventDefault()
    var load = true;
    var account = $('#ajax-form input[name=account]').val();
    var password = $('#ajax-form input[name=password]').val();
    var password_2 = $('#ajax-form input[name=password_2]').val();
    
    if(password != password_2) {
      load = false;
      $('#check_same').text('Confiremd Password is not the same')
    }
    else {
      $('#check_same').text('')
      $.get('./sign_up', {
        account: account,
        password: password,
      }, (data) => {
        $('#userName').text(data)
        $('#userName').css('display','inline-block')
        $('#t1').css('display','inline-block') 
        $('#t2').css('display','inline-block')
        $('#ajax-form').css('display','none')
      })
      load = false;
    }

    setTimeout(() => {
      if(load)
        $('#t3').text('Loading...')
    }, 100)
  })
});
