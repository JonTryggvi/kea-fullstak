$(document).ready(function () {
  $('select').formSelect();
});
$('.dropify').dropify();

$('#btnSbmSignup').click(function () {
  // var imgFile = $('#imgFile')[0].files;
  // console.log(imgFile);
  var form = $('#frmSignup').serializeArray()
  var file_data = $("#imgFile").get(0).files[0];   // Getting the properties of file from file field
  // console.log(file_data);
  
  var formData = new FormData();
  formData.append('userImg', file_data);
  var obj = {};
  for (let i = 0; i < form.length; i++) {
    obj[form[i].name] = form[i].value; 
  }

  // JSON obj
  formData.append('formData', JSON.stringify(obj));
  $.ajax({
    url: '/api/save-user',
    type: "POST",
    processData: false,
    contentType: false,
    data: formData,
    complete: function (data) {
      // console.log(data);
      if (data.status == 200) {
        location.replace('/');
      }
    }
  });
});