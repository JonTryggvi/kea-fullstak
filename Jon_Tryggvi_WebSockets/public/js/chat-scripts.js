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
;socket.on('activeUsers', function (jData) {
  // console.log(jData);
  var aActiveUsers = jData.activeUsers;
  // console.log(aActiveUsers);

  var elActiveLi = '<li class="activeUser" data-userid="' + aActiveUsers.id + '">' + aActiveUsers.name + '</li>';
  activeUsers.insertAdjacentHTML('beforeend', elActiveLi);

  // activeUsers.innerHTML = sUserItem;
});
socket.send('connection', { "userId": localStorage.userId });
socket.on('chat', function (jData) {
  var browserImg = '';
  // console.log(jData);

  var messages = sMessageDisplay;
  var sentBrowser = jData.userBrowser;
  var localUserId = window.localStorage.userId;
  var msgUserId = jData.userId;
  var thisBrowser = whatBrowser();
  var senderClass = localUserId != msgUserId ? 'externalMsg' : 'localMsg';
  // console.log(senderClass);
  // console.log(jData);
  switch (senderClass) {
    case 'externalMsg':
      sMessage = '<li class="message ' + senderClass + '">  <p>' + jData.message + '</p><span>' + jData.userName + '</span></li>';
      break;
    case 'localMsg':
      sMessage = '<li class="message ' + senderClass + '"><span>' + jData.userName + '</span>  <p>' + jData.message + '</p></li>';
      break;

    default:
      break;
  }
  messages.innerHTML += sMessage;
  $(".sMessageDisplay").stop().animate({ scrollTop: $(".sMessageDisplay")[0].scrollHeight }, 1000);
});

socket.on('isConnected', function (jData) {
  // console.log(jData);  
  connStatus.innerHTML = 'status: ' + jData.status;
  sBrowser = whatBrowser();
  var userId = localStorage.userId;
  // console.log(userId);
  var browserData = {
    "browser": sBrowser,
    "userId": userId
  };
  socket.emit('whatBrowser', browserData);
  var browserImg = '';
  switch (sBrowser) {
    case 'Chrome':
      browserImg = '/img/chrome.png';
      // browserIcon.innerHTML = browserImg;
      break;
    case 'Safari':
      browserImg = '/img/safari.png';
      // browserIcon.innerHTML = browserImg;
      break;
    case 'Firefox':
      browserImg = '/img/firefox.png';
      // browserIcon.innerHTML = browserImg;
      break;
    default:
      break;
  }

  $(document.body).css('background-image', 'url(' + browserImg + ')');
});

$('#btnSend').click(function () {
  // console.dir(window);
  var sMessage = $('#txtMessage').val();
  // console.log(sMessage);
  var sModMessage = sMessage.replace(':)', '&#x1F603').replace(': )', '&#x1F603').replace(':-)', '&#x1F603').replace('(:', '&#x1F603').replace('( :', '&#x1F603').replace('(-:', '&#x1F603').replace(';)', '&#x1f609').replace(':\')', '&#x1f622').replace(':)', '&#x1f622');
  var userBrowser = whatBrowser();
  var sMessageAndUserData = { "message": sModMessage, "userId": localStorage.userId, "userBrowser": userBrowser };
  socket.emit('grabbMessage', sMessageAndUserData);
  // $(".sMessageDisplay").stop().animate({ scrollTop: $(".sMessageDisplay")[0].scrollHeight }, 1000);
  $('#txtMessage').val('');
});

$('#btnLogout').click(function () {
  var userId = window.localStorage.userId;
  $.post('/logout', { "userId": userId }, function (data) {
    // console.log(data);
    if (data) {
      if (userId == $('.activeUser').attr('data-userid')) {
        $('.activeUser').remove();
      }
      localStorage.userId = '';
      location.replace(location.origin);
    }
  });
});
//# sourceMappingURL=chat-scripts.js.map
