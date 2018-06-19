
$('.btnDeleteUser').click(function () {
  var userId = $(this).attr('data-userid');

  $.post('/api/delete-user', { userId: userId }, function (jDataFromServer) {
    var status = jDataFromServer.status;
    // console.log(jDataFromServer);
    if (status == 'ok') {
      $('tr [data-userid="' + userId + '"]').parent().remove();
        
    }
  });

});

$('.modalClick').click(function () {
  var userId = $(this).attr('data-userid');
  // $('.modal').modal(); 
  $('#theRoleSwitch').attr('checked', false);
  // $('#theRoleSwitch').val(setUserVal);
  $('.modal-content h4').text('Sett {{modalUserName}} as Admin?');
  $.post('/api/get-loggedin-user', { userId: userId }, function (jData) {
    var modalHeadingText = $('.modal-content h4').text().replace('{{modalUserName}}', jData.response.firstname);
    var setUserVal = jData.response.role == 'Admin' ? '1' : '2';
    var setBool = setUserVal == '1' ? true : false;
    $('.modal-content h4').text(modalHeadingText);
    $('#theRoleSwitch').attr('data-userid', jData.response.id);
    $('#theRoleSwitch').attr('checked', setBool);
    // $('#theRoleSwitch').val(setUserVal);
    // console.log(jData);
    // $('.modal').modal();
   
  });
});

$('#theRoleSwitch').on('change', function () {
  var userId = $(this).attr('data-userid');
  var inputName = $(this).attr('name');
  var roleVal = $(this).val();
  var checkVal = roleVal == 'on' ? 1 : 2;
  var jPackage = { name: inputName, value: checkVal, userId: userId }
  console.log(jPackage);
  
  $.post('/api/update-user', jPackage, function (jData) {
    console.log(jData);
    
  })
  // console.log(userId);
  
});

$(document).ready(function () {
  $('.modal').modal();
});