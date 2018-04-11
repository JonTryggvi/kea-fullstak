$('form').on('keyup', function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    $('form button').click();
    return false;
  }
});
// just to be sure that forms wont do anything unwanted I added the keaypress listener
$('form').on('keypress', function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    // $('form button').click();
    return false;
  }
});

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$('#btnSignUp').click(function () {
  // console.log('x');
  var signinData = $('#frmSignUp').serialize();
  $.post('/save-user', signinData, function (aData) {
    var apiToken = aData[0];
    var mobile = aData[1];
    var code = aData[2];
    var sApiRequest = 'apiToken=' + apiToken + '&mobile=' + mobile + '&message=' + code;
    
    $.post('http://smses.io/api-send-sms', sApiRequest, function (sData) {
      var jData = JSON.parse(sData);
      var status = jData.status;
      var responseCode = jData.code;
      var sResponseMessage = jData.message;
      console.log(jData);
      
      if (status != "ok") {
        console.log('something whent wrong with the sms servise ' + sResponseMessage);
        return;
      }
     
      $('#verifyCode').addClass('openVerify');
    });
  });
});

$('#btnVerifyCode').click(function () {
  var frmCode = $('#frmVerify').serialize();
  // console.log(frmCoders);
  
  $.post('/validate-code', frmCode, function (jData) {
    if (jData == "unsuccessful") {
      console.log('the code did not match our records');
      // return  
    }
    var userCode = jData.code
    setCookie('cValidCode', userCode, 1);
    $('#verifyCode').removeClass('openVerify');
    $('#frmVerify').trigger("reset");
    console.log(jData);
  })
})

// testing service
// http://smses.io/api-send-sms

