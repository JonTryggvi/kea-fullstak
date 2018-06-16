$(document).ready(function () {
  
  var userId = window.localStorage.userId;
  $.post('/api/get-loggedin-user', { userId }, function (jData) {
    var jUser = jData.response;
    var sFirstname = jUser.firstname;
    var sLastname = jUser.lastname;
    var sFullName = `${sFirstname} ${sLastname}`;
    var sImgData = jUser.userImg;
    var jImgData = JSON.parse(sImgData);
    console.log(jImgData);
    var sImg = `<img class="circle responsive-img" src="${jImgData.imgPath}"  alt="${sFirstname}" />`;
    
    $('#userName').val(sFirstname);
    $('#userImg').html(sImg);

    console.log(jData);
    
  });

  var navId = $('#headerNav');
  var userId = window.localStorage.userId
  if (navId) {
    var sNavHtml = ` 
      <div class="nav-wrapper container">
        <a href="#!" class="brand-logo">Soberz</a>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul class="right hide-on-med-and-down">
          <li><a href="#">Chat</a></li>
          <li><a href="#">Users</a></li>
          <li><a href="/sober/${userId}">Profile</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </div>`;

    navId.html(sNavHtml);
  }

  $('.sidenav').sidenav();


  $(document).click(function (e) {
    var dataActivateInput = $(e.target).attr("data-findclick");
    if (dataActivateInput && dataActivateInput === 'activateInputfirstname') {
      // console.log('x');
      var thisInput = e.target;
      $(thisInput).removeAttr('disabled')
      .focus()
      .next().text(`Edit ${$(thisInput).attr('name')}`).addClass('active');
      $('.btnEdit')
        .removeClass('red')
        .addClass('green').addClass('btnSave')
        .css('visibility', 'visible').css('transform', 'scale(1)').css('right','3em')
        .children().text('check');
      $('.hidden').removeClass('hidden');
    } 
// get the cancel button going 
    var cancelInput = $(e.target).attr('data-btninput');
    if (cancelInput && cancelInput === 'cancelinput') {
      var inputReset = e.target.parentElement.nextElementSibling;
      var parentElement = e.target.parentElement;
      $(inputReset).attr('disabled', true);
      $(inputReset).blur().removeClass('valid');
      $(parentElement).siblings('label').text('').removeClass('active');
      console.dir($(parentElement).siblings('label'));
      $('.btnEdit')
        .addClass('red')
        .removeClass('green').removeClass('btnSave')
        .css('visibility', 'hidden').css('transform', 'scale(0.8)').css('right', '0em')
        .children().text('mode_edit')
        .next().addClass('hidden');
    }
  // and then send the new edit data to server todo
    
  });
});