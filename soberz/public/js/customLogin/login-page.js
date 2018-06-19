document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'left',
    hoverEnabled: false
  });

  var tooltipElement = document.querySelectorAll('.tooltipped');
  var toolTipInstace = M.Tooltip.init(tooltipElement, {
    position: 'top'
  });
});

$(document).ready(function () {
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
  $('#btnLogin').click(function () {
    console.log('x');
    
    var formData = $('#frmLogin').serialize();
    $.post('/api/login', formData, function (jData) {
      if (jData.status == 'ok') {
        console.log(jData);
        isLocalStorageNameSupported('loggedIn', 'yes');
        isLocalStorageNameSupported('userId', jData.response.id);
        isLocalStorageNameSupported('userFirstname', jData.response.firstname);
        isLocalStorageNameSupported('userLastname', jData.response.lastname);
        location.replace('/sober/'+ jData.response.id)
      } else if (jData.status == 'failed') {
        console.log(jData.message);
        M.toast({ html: jData.message, classes: 'rounded' });
      } else {
        location.replace('/')
      }
      $('#frmLogin').trigger("reset");
      // location.replace('/sober')
    });
  });
  $('.sidenav').sidenav();
});

