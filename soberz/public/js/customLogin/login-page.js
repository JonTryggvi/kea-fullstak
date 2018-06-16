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
    var formData = $('#frmLogin').serialize();
    $.post('/api/login', formData, function (jData) {
      if (jData.message == 'ok') {
        console.log(jData);
        isLocalStorageNameSupported('loggedIn', 'yes')
        isLocalStorageNameSupported('userId', jData.response.id)
        location.replace('/sober/'+ jData.response.id)
      } else {
        location.replace('/')
      }
      $('#frmLogin').trigger("reset");
      // location.replace('/sober')
    });
  });

  var navId = $('#headerNav');
  var userId = window.localStorage.userId
  if (navId) {
    var sNavHtml = ` 
      <div class="nav-wrapper container">
        <a href="#!" class="brand-logo">Soberz</a>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul class="right hide-on-med-and-down">
          <li><a href="#">Sign up</a></li>
         
          <li><a href="#">About</a></li>
        </ul>
      </div>`;

    navId.html(sNavHtml);
  }


  $('.sidenav').sidenav();
 
});