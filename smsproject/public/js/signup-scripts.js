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
  //1. first sendum við inn í okkar gagnagrunn upplýsingarnar okkar og bíðum eftri svari frá server á servernum útbúm við randam 4 digit kóða sem við sendum inn 
  $.post('/save-user', signinData, function (aData) {
    var apiToken = aData[0];
    var mobile = aData[1];
    var code = aData[2];
    var sApiRequest = 'apiToken=' + apiToken + '&mobile=' + mobile + '&message=' + code;
  // 2 server svarar og við getum sett upp requerst fyrir hanns þjónustu sApiRequest
    $.post('http://smses.io/api-send-sms', sApiRequest, function (sData) {
      var jData = JSON.parse(sData);
      var status = jData.status;
      var responseCode = jData.code;
      var sResponseMessage = jData.message;
      // console.log(jData);
      
      if (status != "ok") {
        console.log('something whent wrong with the sms servise ' + sResponseMessage);
        return;
      }
    //  3 hanns þánusta svarar og við sláum inn staðfestingar kóða í inðput sem ég birti hér  að neðan
      $('#verifyCode').addClass('openVerify');
    });
  });
});
 

$('#btnVerifyCode').click(function () {
  var frmCode = $('#frmVerify').serialize();
  // console.log(frmCoders);
  // 4 við sendum á okkar server og berum saman kóðan sem við sendum inn 
  $.post('/validate-code', frmCode, function (jData) {
    if (jData == "unsuccessful") {
      console.log('the code did not match our records');
      // return  
    }
    var userCode = jData.code;
    setCookie('cValidCode', userCode, 1/24);
    $('#verifyCode').removeClass('openVerify');
    $('#frmVerify').trigger("reset");
    window.location.replace('/valid-user');
    // console.log(jData);
  })
})

// testing service
// http://smses.io/api-send-sms

