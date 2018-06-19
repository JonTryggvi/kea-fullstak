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

function whatBrowser() {
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browserName = navigator.appName;
  var fullVersion = '' + parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset;
  var verOffset;
  var ix;

  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
    browserName = 'Opera';
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
      fullVersion = nAgt.substring(verOffset + 8);
    }
    // return browserName;
  } else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
    browserName = 'Microsoft Internet Explorer';
    fullVersion = nAgt.substring(verOffset + 5);
    // return browserName;
  } else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
    browserName = 'Chrome';
    fullVersion = nAgt.substring(verOffset + 7);
    // return browserName;
  } else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
    browserName = 'Safari';
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
      fullVersion = nAgt.substring(verOffset + 8);
    }
    // return browserName;
  } else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
    browserName = 'Firefox';
    fullVersion = nAgt.substring(verOffset + 8);
    // return browserName;
  } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() === browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix = fullVersion.indexOf(';')) !== -1) {
    fullVersion = fullVersion.substring(0, ix);
  }
  if ((ix = fullVersion.indexOf(' ')) !== -1) {
    fullVersion = fullVersion.substring(0, ix);
  }

  majorVersion = parseInt('' + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }
  // console.log(browserName);

  return browserName;
}

// console.log(window.location.hostname);
var sHostName = window.location.hostname;
var serverLoactation;
if (sHostName == 'localhost' || sHostName == '10.0.0.209') {
  serverLoactation = "10.0.0.209:3000";
} else {
  serverLoactation = '18.216.169.68:3000';
}

var socket = io('localhost:3000');
;
// console.log(location);
function isLocalStorageNameSupported(key, value) {
  var testKey = key,
      storage = window.localStorage;
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
    console.log(data);
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
//# sourceMappingURL=login-scripts.js.map
