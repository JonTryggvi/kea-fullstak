
// console.log(location);
function isLocalStorageNameSupported(key, value) {
  var testKey = key, storage = window.localStorage;
  try {
    storage.setItem(testKey, value);
    // storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}
// console.log(isLocalStorageNameSupported());
$('#btnSubmit').click(function () {
  var oFrmLogin = $('#frmLogin').serialize();
  var aData;
  // console.log(oFrmLogin);
  // console.log('x');
  $(this).text('loading');
  $.post('logger', oFrmLogin, function (data) {
    // console.log(data);
    if (typeof data[0][1] == 'string') {
      var sData = data[0][1];
      aData = JSON.parse(sData);
    } else {
      aData = [data[0][1]];
      // console.log(aData);
    }
    
    userId = aData[0].id;

    // window.localStorage.userId = userId;
    isLocalStorageNameSupported('userId', userId);
    // chat.on('connect', function () {
    //   chat.broadcast.emit(aData[0].name);
    // });
   
    // console.log(aData[0].id);
    $('#frmLogin').trigger("reset");
    location.replace(location.origin + '/chat');
  });
 
  
});