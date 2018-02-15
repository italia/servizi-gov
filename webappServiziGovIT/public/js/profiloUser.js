$(document).ready(function(){
    //validatore password
    $("#changePasswordForm").validate({
        ignore: ':hidden',
        rules: {
          currentPassword: "required",
          newPassword: "required",
          repeatNewPassword: {
            equalTo: "#newPassword"
          }
        },
        messages: {
          currentPassword: "Campo obbligatorio",
          newPassword: "Campo obbligatorio",
          repeatNewPassword: "Password diversa"
        },
        errorClass: "errorText",
        highlight: function (element) {
          $(element).addClass("errorInput");
        },
        unhighlight: function (element) {
          $(element).removeClass("errorInput");
        }
      });
    $("#changePassword").click(function(e){
        changePassword();
    })




    // router.post('/profilo', ensureAuthenticated, function (req, res) {
    //   var password = req.body.currentPassword;
    //   var newPassword = req.body.newPassword;
    //   var repeatNewPassword = req.body.repeatNewPassword;
    //   var codiceFiscale = req.body.codFisc;
    
    //   // Validation
    
    //   req.checkBody('password', 'password is required')
    //   req.checkBody('newPassword', 'newPassword is required')
    //   req.checkBody('repeatNewPassword', 'Passwords do not match').equals(req.body.newPassword);
    //   req.checkBody('codiceFiscale', 'password is required')
    
    //   var errors = req.validationErrors();
    
    //   if (errors) {
    //     res.render('profilo', {
    //       errors: errors
    //     });
    //   } else {
    //     User.getUserByUsernameAbac(codiceFiscale, function (err, user) {
    //       if (err) throw err;
    //       if (!user) {
    //         return false
    //       }
    //     User.comparePassword(password, user.password, function (err, isMatch) {
    //       if (err) throw err;
    //       if (isMatch) {
    //         bcrypt.genSalt(10, function (err, salt) {
          
    //           bcrypt.hash(newPassword, salt, function (err, hash) {
    //           console.log(newPassword)
    //           console.log(hash)
    //           user.set({password:hash})
    //           // user.password = hash
    //           user.save(function (err, user) {
    //             if (err) throw err;
    //             res.send(user);
    //             });
          
    //           })
    //         })
            
    //       } else {
    //         return 
    //       }
    //     });
    //     })
    //   }
    // });
    


})

function changePassword(){
    var isValid = validateForm();
    if(isValid){
      changePasswordService();




    }
}
function validateForm(){
    return $("#changePasswordForm").valid()
}

function changePasswordService(){
  var password=$("#currentPassword").val();
  var newPassword=$("#newPassword").val();
  var id=$("#idUser").val();
  var user = createUserToUpdate();
  user = JSON.stringify(user)
  var userString = 'userToChangePassword=' + user


  $.ajax({
      type: "POST",
      data: userString,
      //url: "http://localhost:3500/api/users/changePassword/",
      url: "/api/users/changePassword/",
      success: function (data) {
        console.log(data)
        $("#msgResult").html(data.result)
      },
      error: function (data) {

      }
    })
    .done(function () {

    })
    .fail(function () {

    });
}

function createUserToUpdate(){
  var passwordUser=$("#currentPassword").val();
  var newPasswordUser=$("#newPassword").val();
  var idUser=$("#idUser").val();
  var user = {'id':idUser, 'password' : passwordUser,'newPassword':newPasswordUser}
  return user
}