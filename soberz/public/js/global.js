$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.tooltipped').tooltip();
  $('.backdrop').css('margin-bottom', '100px');
  $('.tooltipped').on('hover', function () {
    console.log('s');
    
    $('.material-tooltip').css('translateY', '-200px')
  })
});
window.onload = function () {
  $('.loader').addClass('hideLoader');
};

var ioLocation = location.hostname + ':3000';
// console.log(location.protocol + '//' + location.hostname +':3000');

var socket = io(location.hostname +':3000');
var userId = localStorage.userId;
// var navChat = $('.ancId').attr('href');
// let navAddId = navChat + '/' + userId;
// var navUsers = $('.ancId').attr('href');
// $('.ancId').attr('href', navAddId);
// let navAddUsersId = navUsers + '/' + userId;
// $('#ancUsers').attr('href', navAddUsersId);

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




$.get('/api/get-genders', function (jData) {
  var jGenders = jData.response;
  var sOptions = `<option value="3" disabled selected>Choose gender</option>`;
  var genderId;
  var genderName;
  var selected;
  for (let i = 0; i < jGenders.length; i++) {
    genderId = jGenders[i].id;
    genderName = jGenders[i].gender_name;
    
  
    sOptions += `<option value="${genderId}" >${genderName}</option>`;
  }
  // console.log(sOptions);

  $('#userProfileGenders').append(sOptions);
  $('select').formSelect();
  // $('.loader').addClass('hideLoader');
})


$('.btnLogout').click(function () {
  console.log('x');
  
  $.post('/api/logout', {id : userId}, function(jData){
    console.log(jData);
    var status = jData.status;
    if (status == 'ok') {
      localStorage.clear();
      location.replace('/');
    }
    
  })
})


document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'left',
    hoverEnabled: false
  });
});