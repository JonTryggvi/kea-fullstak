socket.on('activeUsers', function (jData) {
  // console.log(jData);
  var aActiveUsers = jData.activeUsers;
  // console.log(aActiveUsers);

  var elActiveLi = '<li class="activeUser" data-userid="'+aActiveUsers.id+'">' + aActiveUsers.name +'</li>';
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
  var sModMessage = sMessage
    .replace(':)', '&#x1F603')
    .replace(': )', '&#x1F603')
    .replace(':-)', '&#x1F603')
    .replace('(:', '&#x1F603')
    .replace('( :', '&#x1F603')
    .replace('(-:', '&#x1F603')
    .replace(';)', '&#x1f609')
    .replace(':\')', '&#x1f622')
    .replace(':)', '&#x1f622');
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

