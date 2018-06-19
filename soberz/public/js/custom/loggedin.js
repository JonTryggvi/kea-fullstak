$(document).ready(function () {
 

  var userId = window.localStorage.userId;
  if (userId) {
    $.post('/api/get-loggedin-user', { userId }, function (jData) {
      
      var jUser = jData.response;
      var sFirstname = jUser.firstname;
      var sLastname = jUser.lastname;
      var sFullName = `${sFirstname} ${sLastname}`;
      var sImgData = jUser.userImg;
      var jImgData = JSON.parse(sImgData);
      var sEmail = jUser.email;
      var sMobile = jUser.mobile;
      var sMobileModified = sMobile.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
      var sAbout = jUser.about;
      var sGender = jUser.gender;
      // console.log(jImgData);
      var sImg = $('#imgFile').attr('data-default-file', jImgData.imgPath);
//  <input type="file" class="dropify" data-default-file="url_of_your_file" />
      // <input id="imgFile" type="file" class="dropify" name="imgFile" data-height="200" data-default-file="${jImgData.imgPath}"/>
      $('#userName').text(sFullName);
      $('#userImg').html(sImg);
      $('#firstname').val(sFirstname);
      $('#lastname').val(sLastname);
      $('#email').val(sEmail);
      $('#mobile').val(sMobileModified);
      $('#about').val(sAbout);
      console.log(jUser);
      var selectedVal = $('#userProfileGenders option').filter(function () { return $(this).html() == sGender; }).val();
      $('#userProfileGenders').val(selectedVal[0]);
      $('select').formSelect(); // reset the the pretty select
      $('.dropify').dropify();


      // chang user img
      $('#userImg').on('change', '#imgFile', function () {
        console.log('x');
        var file_data = $("#imgFile").get(0).files[0];   // Getting the properties of file from file field
        // console.log(file_data);

        var formData = new FormData();
        formData.append('userImg', file_data);
        
        var obj = { id: userId, fileToDelete: jImgData.imgPath, userName: sFirstname };
        
        // console.log(objArr);

        //JSON obj
        formData.append('formData', JSON.stringify(obj));
        $.ajax({
          url: '/api/update-user-img',
          type: "POST",
          processData: false,
          contentType: false,
          data: formData,
          complete: function (jResData) {
            // console.log(data);
            if (jResData.status == 200) {
              // location.replace('/');
              M.toast({ html: jResData.responseJSON.message, classes: 'rounded' });
            }
          }
        });
      });

    });
  }

 
 
  

 

  $(document).click(function (e) {
    var dataActivateInput = $(e.target).attr("data-findclick");
    if (dataActivateInput && dataActivateInput === 'activateInput') {
      // console.log('x');
      var thisInput = e.target;
   
      $(thisInput).removeAttr('disabled')
      .focus()
      .next().text(`Edit ${$(thisInput).attr('name')}`).addClass('active');
      $(thisInput).siblings('.btnEdit')
        .removeClass('red')
        .addClass('green').addClass('btnSave')
        .css('visibility', 'visible').css('transform', 'scale(1)').css('right','3em')
        .children().text('check');
      $(thisInput).siblings('.hidden').removeClass('hidden');
    } 

// get the cancel button going 
    var cancelInput = $(e.target).attr('data-btninput');
    if (cancelInput && cancelInput === 'cancelinput') {
      // cancelInput(e.target);
      var inputReset = e.target.parentElement.nextElementSibling;
      var parentElement = e.target.parentElement;
      $(inputReset).attr('disabled', true);
      $(inputReset).blur().removeClass('valid');
      $(parentElement).siblings('label').text('').removeClass('active');
      // console.dir($(parentElement).siblings('label'));
      $(inputReset).siblings('.btnEdit')
        .addClass('red')
        .removeClass('green').removeClass('btnSave')
        .css('visibility', 'hidden').css('transform', 'scale(0.8)').css('right', '0em')
        .children().text('mode_edit');
      $(inputReset).siblings('.btnCancel').addClass('hidden');
    }
  // and then send the new edit data to server todo
    
  });

  $('.btnEdit').click(function () {
    var inputValue = $(this).siblings('.inpClick').val();

    var inputName = $(this).siblings('.inpClick').attr('name');
    if (inputName == 'mobile' && inputValue.length > 8) {
      inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1$2$3$4$5").substring(3);
  
    }
    // console.log(inputName);
    var jData = { value: inputValue, name: inputName, userId: userId}
    $.post('/api/update-user', jData, function (jResData) {
      var resColName = jResData.updatedData.name;
      var resColValue = jResData.updatedData.value;
      switch (resColName) {
        case 'firstname':
          $('#firstname').val(resColValue)
          break;
        case 'lastname':
          $('#lastname').val(resColValue)
          break;
        default:
          break;
      }
      sFullName = $('#firstname').val() + ' ' + $('#lastname').val();
      $('#userName').text(sFullName);

      $('.inpClick').attr('disabled', true);
      $('.inpClick').blur().removeClass('valid');
      $('.inpClick').siblings('label').text('').removeClass('active');
      // console.dir($(parentElement).siblings('label'));
      $('.inpClick').siblings('.btnEdit')
        .addClass('red')
        .removeClass('green').removeClass('btnSave')
        .css('visibility', 'hidden').css('transform', 'scale(0.8)').css('right', '0em')
        .children().text('mode_edit');
      $('.inpClick').siblings('.btnCancel').addClass('hidden');
      M.toast({ html: jResData.message, classes: 'rounded' });
      // console.log(jResData);
    })
  })

  $('select').on('change', function () {
    console.log('x');
    
    var selectValue = $(this).val();
    var selectName = $(this).attr('name');
    var jData = { value: selectValue, name: selectName, userId: userId };
    $.post('/api/update-user', jData, function (jResData) {
      // 
      
      M.toast({ html: jResData.message, classes: 'rounded' });
    } )
  })
  

  

});

