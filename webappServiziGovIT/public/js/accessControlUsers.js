if (!String.format) {
  String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != "undefined" ? args[number] : match;
    });
  };
}
//dovrebbe essere gia caricata da service<Templates
function getQueryStringParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


// const serviceRow = '<tr><td data-label="{1}" class="table-th-50">{1}<div class="small text-guide">{2}</div></td><td data-label="caricamento dati"><div class="clearfix">' +
//     '<div class="float-left"><strong></strong></div><div class="float-right"><small class="text-guide">quantità di metadati caricati</small></div></div>' +
//     '<div class="progress progress-xs"> <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>' +
//     '</div></td><td data-label="Qualità"><p class="sr-only">Indice di qualità: 5 su 5</p><i class="fa fa-star fa-star-agidrate" aria-disabled="true"></i></td><td data-label="azioni" class="text-center">' +
//     '<div class="row"><div class="col-4"> <a href="/servizi/service-wizard-complete2/?serviceId={0}" title="modifica"><i class="icon-note icons font-2xl d-block"></i> </a></div><div class="col-4"><a id="rimuovi{0}" href="/service/remove?serviceId={0}" title="cancella">' +
//     '<i class="icon-close icons font-2xl d-block"></i></a></div> <div class="col-4"> <label title="Pubblica servizio" class="switch switch-3d switch-success"><input type="checkbox" class="switch-input" checked value="">' +
//     '<span class="switch-label"></span><span class="switch-handle"></span><span class="sr-only">Pubblica servizio</span></label></div></div></td></tr>'

const applicationRow =
  '<tr><td data-label="{1}" class="table-th-50">{1}' +
  '<div class="small text-guide">{2}</div></td>' +
  '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a href="/accesscontrol/users" title="utenti"><i class="icon-user-follow icons font-2xl d-block"></i></a></div></div></td>' +
  '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a href="#" title="modifica"><i class="icon-note icons font-2xl d-block"></i></a></div>' +
  '<div class="col-5"><a href="#" title="cancella"><i class="icon-close icons font-2xl d-block"></i></a></div></div></td></tr>';

const applicationUserRow =
  '<tr><td data-label="{1}" class="table-th-30">{1}' +
  "<td>{2}</td>" +
  "<td>{3}</td>" +
  '<td id="userToAttr">{4}</td>' +
  '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a href="#" onclick="editUsersPopolateModal(\'{0}\')" title="modifica"><i class="icon-note icons font-2xl d-block"></i></a></div>' +
  '<div class="col-5"><a href="#" onclick="removeUsers(\'{0}\',this)" title="cancella"><i class="icon-close icons font-2xl d-block"></i></a></div></div></td></tr>';
var currentPos = 0;
var total;
var perPageUser = 3;

$(document).ready(function () {


  $("#visualizzaGriglia").click(function () {
    // alert($("#getOrganizationForTable").val())


    var organization = $("#getOrganizationForTable").val()

    var url = '?filter={"where":{"organizzazioni":{"elemMatch":{"codiceIpa":"' + organization + '"}}}}';

    $.ajax({
      type: "GET",
      url: url,
      async: false,
      success: function (data) {
        if (data.length > 0) {
          renderApplicationToUser(data);
          $("#buttonAddUserToApplication").show();
          $("#tableUser").show();
          $("#noResults").hide();
        } else
          $("#noResults").show();
      },
      error: function (data) {

      }
    })
  })


  // cognomeUserEdit
  // nameUserEdit
  // codFiscUserEdit
  // codSPIDUserEdit
  // usernameUserEdit
  // emailUserEdit
  // passwordUserEdit
  // getOrganizationEdit
  // rolesAttributesEdit



  // cognomeUser
  // nameUser
  // codFiscUser
  // codSPIDUser
  // usernameUser
  // emailUser
  // passwordUser
  // passwordUserAgain
  // getOrganization
  // rolesAttributes

  $("#saveUserForm").validate({
    ignore: [],
    rules: {
      cognomeUser: "required",
      nameUser: "required",
      codFiscUser: "required",
      codSPIDUser: "required",
      usernameUser: "required",
      emailUser: "email",
      passwordUser: "required",
      passwordUserAgain: {
        equalTo: "#passwordUser"
      }

    },
    messages: {
      cognomeUser: "Campo obbligatorio",
      nameUser: "Campo obbligatorio",
      codFiscUser: "Campo obbligatorio",
      codSPIDUser: "Campo obbligatorio",
      usernameUser: "Campo obbligatorio",
      emailUser: "Inserire email valida",
      passwordUser: "Campo obbligatorio",
      passwordUserAgain: "Password diversa"

    },
    errorClass: "errorText",
    highlight: function (element) {
      $(element).addClass("errorInput");
    },
    unhighlight: function (element) {
      $(element).removeClass("errorInput");
    }
  });


  $("#editUserFormEdit").validate({
    ignore: [],
    rules: {
      cognomeUserEdit: "required",
      nameUserEdit: "required",
      codFiscUserEdit: "required",
      codSPIDUserEdit: "required",
      usernameUserEdit: "required",
      emailUserEdit: "email",
      passwordUserEdit: "required",
      passwordUserAgainEdit: {
        equalTo: "#passwordUserEdit"
      }

    },
    messages: {
      cognomeUserEdit: "Campo obbligatorio",
      nameUserEdit: "Campo obbligatorio",
      codFiscUserEdit: "Campo obbligatorio",
      codSPIDUserEdit: "Campo obbligatorio",
      usernameUserEdit: "Campo obbligatorio",
      emailUserEdit: "Inserire email valida",
      passwordUserEdit: "Campo obbligatorio",
      passwordUserAgainEdit: "Password diversa"

    },
    errorClass: "errorText",
    highlight: function (element) {
      $(element).addClass("errorInput");
    },
    unhighlight: function (element) {
      $(element).removeClass("errorInput");
    }
  });







  getNameService();
  // applicationToUser();
  $("#btnAggiungiAttributo").click(function (e) {
    popolateAttributeFields();
  });


  //   $("#getOrganization").autocomplete({
  //     source: function (request, resolve) {
  //         popolateAutocompleteOrganizz(request.term, resolve);
  //     },
  //     minLenngth: 4
  // });

  // $("#getOrganization").autocomplete({
  //   source: optionAutocomplete
  // });

  // $("#getOrganization").autocomplete({
  //   source: function (request, resolve) {
  //     popolateAutocompleteOrganizz(request.term, resolve);
  //   },


  //   select: function (event, ui) {
  //     $("#getOrganization").val(ui.item.label);
  //     $("#getOrganization").attr("itemCode", ui.item.value);
  //     return false;
  //   }
  // });

  // $("#getOrganizationEdit").autocomplete({
  //   source: function (request, resolve) {
  //     popolateAutocompleteOrganizz(request.term, resolve);
  //   },

  //   select: function (event, ui) {
  //     $("#getOrganizationEdit").val(ui.item.label);
  //     $("#getOrganizationEdit").attr("itemCode", ui.item.value);
  //     return false;
  //   }
  // });



  $("#avantiModalEdit").click(function (e) {
    $("#tabModalEdit .active")
      .parent()
      .next("li")
      .find("a")
      .trigger("click");
  })
  $("#indietroModalEdit").click(function (e) {
    $("#tabModalEdit .active")
      .parent()
      .prev("li")
      .find("a")
      .trigger("click");
  })

  $("#avantiModalAdd").click(function (e) {
    $("#tabModalAdd .active")
      .parent()
      .next("li")
      .find("a")
      .trigger("click");
  })
  $("#indietroModalAdd").click(function (e) {
    $("#tabModalAdd .active")
      .parent()
      .prev("li")
      .find("a")
      .trigger("click");
  })



if(!$("#getOrganizationForTable").is("select")){
  $("#getOrganizationForTable").autocomplete({
    source: function (request, resolve) {
      popolateAutocompleteOrganizz(request.term, resolve);
    },

    select: function (event, ui) {
      $("#getOrganizationForTable").val(ui.item.label);
      $("#getOrganizationForTable").attr("itemCode", ui.item.value);
      return false;
    },
    change: function (event, ui) {
      $(this).val((ui.item ? ui.item.label : ""));
    },
  });
}

  popolateSelectRole()


});


function popolateAutocompleteOrganizz(insertWord, response) {
  $("#wait").css("display", "block");

  //liv interazione
  $.ajax({
      dataType: "json",
      url: '?filter={"where":{"or":[{"name":{"like":"' +
        insertWord +
        '.*","options":"i"}},{"organizationCode":{"like":"' +
        insertWord +
        '.*","options":"i"}}]},"limit":20}',
      success: function (data) {
        $("#wait").css("display", "block");
        var appName = [];

        $.each(data, function (i, field) {
          appName.push({
            value: field.organizationCode,
            label: field.name
          });
        });

        response(appName);
      },
      error: function (data) {
        $("#wait").css("display", "block");
      }
    })
    .done(function () {
      $("#wait").css("display", "none");
    })
    .fail(function () {
      $("#wait").css("display", "none");
    });
}

function popolateSelectRole() {




  var applicationId = sessionStorage.getItem("idService")


  $.ajax({
      type: "GET",
      async:false,
      url: "/"+applicationId,
      success: function (data) {
        popolateSelectAttributesRole(data.attributes)

        console.log(data)
      },
      error: function (data) {

      }
    })

    if(!$("#isSuperAdminInput").val())
      $("#rolesAttributes option[value='superAdmin']").remove()

}

function popolateSelectAttributesRole(data) {
  $.each(data, function (index, value) {
    var html = "<option value='" + value.name + "' description='" + value.description + "'>" + value.name + "</option>"
    $("#rolesAttributesEdit").append(html)
    $("#rolesAttributes").append(html)
  })
}

function injectApplication() {
  var url = "";
  $.ajax({
      url: url
    })
    .done(function (data) {
      renderApplication(data);
    })
    .fail(function () {
      //alert("errore nella ricerca")
    });
}

function loadPageApplication(name) {
  alert(name);
}

// function applicationToUser() {
//   var url = "http://localhost:3500/api/users";
//   $.ajax({
//       url: url
//     })
//     .done(function (data) {
//       renderApplicationToUser(data);
//     })
//     .fail(function () {
//       //alert("errore nella ricerca")
//     });
// }

function renderApplication(data) {
  $("#applicationBody").empty();
  data.forEach(element => {
    var applicationHtmlFormatted = String.format(
      applicationRow,
      element.id,
      element.nome,
      element.description,
      "100%"
    );
    $("#applicationBody").append(applicationHtmlFormatted);
  });
}

function renderApplicationToUser(data) {
  $("#applicationToUser").empty();
  var x;
  var attributes = "";
  var organizzazioni = "";
  data.forEach(element => {
    $.each(element.attributes, function (i, field) {
      attributes += field.codiceIpa;
    });
    $.each(element.organizzazioni, function (i, field) {
      organizzazioni += field.description;
    });

    var applicationUserFormatted = String.format(
      applicationUserRow,
      element.id,
      element.idApplicazione,
      element.cognome + " " + element.nome,
      organizzazioni,
      attributes,
      element.organizzazioni,
      "100%"
    );

    $("#applicationToUser").append(applicationUserFormatted);
    attributes = "";
    organizzazioni = "";
  });
}




function popolateAttributeFields() {
  var number = $("#attributeList")
    .children()
    .attr("tr");
  number++;

  //    if (number == "" || number == undefined)
  //        number=0;

  var container = $("#attributeList");
  var html = "";
  var rowFormGroup = "<tr>";
  var labelNome =
    '<td class="text-center">' +
    $("#nomeAttributo").val() +
    "</td>" +
    '<td class="inline text-center">' +
    '<a href="#" title="modifica" class="m-left-39 m-right-10"><i class="icon-note icons font-2xl d-block"></i></a>' +
    '<a href="#" title="cancella"><i class="icon-close icons font-2xl d-block"></i></a>' +
    "</td>";
  var closeDiv = "</tr>";

  html += rowFormGroup;
  html += labelNome;
  html += closeDiv;

  container.prepend(html);
  $("#addAttributeCollapse").modal("hide");
}

function getNameService() {
  var nameService = sessionStorage.getItem("nameService");
  $("#serviceName").html(nameService);
}

function deleteRowTableParziale(row) {
  $("#tableBodyParziale #" + row).remove();
}

function deleteRowTableParzialeEdit(row) {
  $("#tableBodyParzialeEdit #" + row).remove();
}

function salvaParzialeInTabella() {
  if ($("#getOrganizationForTable").is("select")) {
    var optionValue = $("#getOrganizationForTable").val()
    // console.log($("#getOrganization option[value="+optionValue+"]").attr("itemCode"))
    var organizzazione = $("#getOrganizationForTable option#" + optionValue + "").attr("itemcode") == "" ? "-" : $("#getOrganizationForTable option#" + optionValue + "").attr("itemcode")

  } else
    var organizzazione = $("#getOrganizationForTable").children(":selected").attr("itemcode") == "" ? "-" : $("#getOrganizationForTable").attr("itemcode")

  var codeOrganizzazione = $("#getOrganizationForTable").val() == "" ? "-" : $("#getOrganizationForTable").val();
  var ruolo = $("#rolesAttributes").val() == null ? "-" : $("#rolesAttributes").val();
  var ruoloDescription = $("#rolesAttributes").find(":selected").attr("description");
  var numberRowTableParziale = $("#tableBodyParziale").children().length++;
  var html =
    '<tr id="' +
    numberRowTableParziale +
    '" ><td class="text-center" code="' + codeOrganizzazione + '" id="organizzTableParziale_' + numberRowTableParziale + '">' +
    organizzazione +
    "</td>" +
    '<td class="text-center" description="' + ruoloDescription + '" id="roleTableParziale_' + numberRowTableParziale + '">' +
    ruolo +
    '</td><td class="text-center"><a href="#" title="cancella" class="ml-5" onclick="deleteRowTableParziale(' +
    numberRowTableParziale +
    ')">' +
    '<i class="icon-close icons font-2xl d-block"></i></a></td></tr>';
  $("#tableBodyParziale").prepend(html);


}

function salvaUser() {
  if (validateForm()) {
    var obj = {
      "nome": "",
      "cognome": "",
      "codicefiscale": "",
      "loginName": "",
      "password": "",
      "email": "",
      "codiceSPID": "",
      "isSuperAdmin": false,
      "organizzazioni": [],
      "idApplicazione": ""
    };
    var objUser = parseAndInsertData(obj);
    saveOnDatabase(objUser);

    blanckFields();
  }

}

function validateForm() {
  var form = $("#saveUserForm").valid();
  var validTable = false;
  var haveElementsInTab = $("#tableBodyParziale").children().length;
  if (haveElementsInTab > 0) {
    $("#alertTable").hide()
    validTable = true;
  } else
    $("#alertTable").show()
  if (!form)
    $("#alertField").show()
  else
    $("#alertField").hide()



  return form && validTable
}

function parseAndInsertData(jsonObj) {
  // var jsonObj=JSON.parse(obj);
  var nome = $("#nameUser").val();
  var cognome = $("#cognomeUser").val();
  var codiceFiscale = $("#codFiscUser").val();
  var loginName = $("#usernameUser").val();
  var password = $("#passwordUser").val();
  var email = $("#emailUser").val();
  var SPID = $("#codSPIDUser").val();
  //issuperadamin
  jsonObj.nome = nome;
  jsonObj.cognome = cognome;
  jsonObj.codicefiscale = codiceFiscale;
  jsonObj.loginName = loginName;
  jsonObj.password = password;
  jsonObj.codiceSPID = SPID
  jsonObj.email = email;
  var lengthTable = $("#tableBodyParziale").children().attr("id");
  lengthTable++;
  for (var a = 0; a < lengthTable; a++) {
    // var code = popolateOrganizationCode($("#organizzTableParziale_" + a).html());
    jsonObj.organizzazioni.push({
      codiceIpa: $("#organizzTableParziale_" + a).attr("code"),
      description: $("#organizzTableParziale_" + a).html(),
      attributes: [{
        name: $("#roleTableParziale_" + a).html(),
        description: $("#roleTableParziale_" + a).attr("description")
      }]
    });
  }
  jsonObj.idApplicazione = sessionStorage.getItem("idService");
  var jsonToString = JSON.stringify(jsonObj);
  return jsonToString;




}

function popolateOrganizationCode(description) {

  var code;
  $.ajax({
      async: false,
      type: "GET",
      url: '?filter={"where":{"name":{"like":"' + description + '"}}}',
      success: function (data) {
        if (data[0] != undefined)
          code = data[0].organizationCode

      },
      error: function (data) {

      }
    })
    .done(function () {

    })
    .fail(function () {

    });
  return code
}

function saveOnDatabase(user) {


  var userString = 'userToAdd=' + user
  $.ajax({
      type: "POST",
      data: userString,
      url: "/addUsersToAbac/",
      success: function (data) {


        console.log(data)
        location.reload();
      },
      error: function (data) {

      }
    })
    .done(function () {

    })
    .fail(function () {

    });
}

function blanckFields() {
  $("#cognomeUser").val("");
  $("#nameUser").val("");
  $("#codFiscUser").val("");
  $("#codSPIDUser").val("");
  $("#usernameUser").val("");
  $("#emailUser").val("");
  $("#passwordUser").val("");
  $("#getOrganization").val("");
  $("#ruoloUser").val("");
}

function popolateAutocompleteOrganizz(insertWord, response) {
  $("#wait").css("display", "block");
  $.ajax({
      dataType: "json",
      url: 'organizations?filter={"where":{"or":[{"name":{"like":"' +
        insertWord +
        '.*","options":"i"}},{"organizationCode":{"like":"' +
        insertWord +
        '.*","options":"i"}}]},"limit":20}',
      success: function (data) {
        $("#wait").css("display", "block");
        var appName = [];

        $.each(data, function (i, field) {
          appName.push({
            value: field.name,
            label: field.organizationCode
          });
        });

        response(appName);
      },
      error: function (data) {
        $("#wait").css("display", "block");
      }
    })
    .done(function () {
      $("#wait").css("display", "none");
    })
    .fail(function () {
      $("#wait").css("display", "none");
    });
}

function removeUsers(id, self) {
  $.ajax({
      type: "DELETE",
      url: '/users/' + id,
      success: function (data) {
        $(self).parent().parent().parent().parent().remove()
      },
      error: function (data) {
        $("#wait").css("display", "block");
      }
    })
    .done(function () {
      $("#wait").css("display", "none");
    })
    .fail(function () {
      $("#wait").css("display", "none");
    });


}

function editUsersPopolateModal(id) {

  $(".modal-lg-EditUser").modal("show");
  var user = getUserById(id)
  popolateModalUserEdit(user);




}

function getUserById(id) {
  var user;
  var url = "api/users/" + id;
  $.ajax({
    method: "GET",
    url: url,
    async: false,
    success: function (data) {
      user = data
    }
  })
  return user
}

function popolateModalUserEdit(user) {
  $("#tableBodyParzialeEdit").html("")
  var nome = user.nome
  var id = user.id
  var cognome = user.cognome
  var codiceFiscale = user.codicefiscale
  var email = user.email
  var id = user.id
  var isSuperAdmin = user.isSuperAdmin
  var username = user.loginName
  var password = user.password
  var organizzazioni = user.organizzazioni
  var SPID = user.codiceSPID;

  $("#idUserToEdit").val(id)
  $("#cognomeUserEdit").val(cognome);
  $("#nameUserEdit").val(nome);
  $("#codFiscUserEdit").val(codiceFiscale);
  $("#codSPIDUserEdit").val(SPID);
  $("#usernameUserEdit").val(username);
  $("#emailUserEdit").val(email);
  // $("#passwordUserEdit").val(password);
  // $("#getOrganizationEdit").val("");
  // $("#ruoloUserEdit").val("");

  if (!isSuperAdmin) {
    // var length = organizzazioni.length
    // for (var a = 0;a<length;a++)
    // salvaParzialeInTabella()
    $.each(organizzazioni, function (index, value) {
      salvaParzialeInTabellaEditLoad(value.attributes[0].name, value.attributes[0].description, value.description, value.codiceIpa);
    })

  }







}

function salvaParzialeInTabellaEdit() {
  $("#tableBodyParzialeEdit").html()
  if ($("#getOrganizationForTable").is("select")) {
    var optionValue = $("#getOrganizationForTable").val()
    // console.log($("#getOrganization option[value="+optionValue+"]").attr("itemCode"))
    var organizzazione = $("#getOrganizationForTable option#" + optionValue + "").attr("itemcode") == "" ? "-" : $("#getOrganizationForTable option#" + optionValue + "").attr("itemcode")
  } else
    var organizzazione = $("#getOrganizationForTable").children(":selected").attr("itemcode") == "" ? "-" : $("#getOrganizationForTable").attr("itemcode")

  var codeOrganizzazione = $("#getOrganizationForTable").val() == "" ? "-" : $("#getOrganizationForTable").val();
  var ruolo = $("#rolesAttributesEdit").val() == null ? "-" : $("#rolesAttributesEdit").val();
  var ruoloDescription = $("#rolesAttributesEdit").find(":selected").attr("description");
  var numberRowTableParziale = $("#tableBodyParzialeEdit").children().length++;
  var html =
    '<tr id="' +
    numberRowTableParziale +
    '" ><td class="text-center" code="' + codeOrganizzazione + '" id="organizzTableParzialeEdit_' + numberRowTableParziale + '">' +
    organizzazione +
    "</td>" +
    '<td class="text-center" description="' + ruoloDescription + '" id="roleTableParzialeEdit_' + numberRowTableParziale + '">' +
    ruolo +
    '</td><td class="text-center"><a href="#" title="cancella" class="ml-5" onclick="deleteRowTableParzialeEdit(' +
    numberRowTableParziale +
    ')">' +
    '<i class="icon-close icons font-2xl d-block"></i></a></td></tr>';
  $("#tableBodyParzialeEdit").prepend(html);


}

function salvaParzialeInTabellaEditLoad(ruoloEdit, descrizioneRuoloEdit, organizzazioneEdit, codeOrganizz) {
  $("#tableBodyParzialeEdit").html("")
  var organizzazioneCode = codeOrganizz
  var organizzazione = organizzazioneEdit
  var ruolo = ruoloEdit
  var ruoloDescription = descrizioneRuoloEdit
  var numberRowTableParziale = $("#tableBodyParzialeEdit").children().length++;
  var html =
    '<tr id="' +
    numberRowTableParziale +
    '" ><td class="text-center" code="' + organizzazioneCode + '" id="organizzTableParzialeEdit_' + numberRowTableParziale + '">' +
    organizzazione +
    "</td>" +
    '<td class="text-center" description="' + ruoloDescription + '" id="roleTableParzialeEdit_' + numberRowTableParziale + '">' +
    ruolo +
    '</td><td class="text-center"><a href="#" title="cancella" class="ml-5" onclick="deleteRowTableParzialeEdit(' +
    numberRowTableParziale +
    ')">' +
    '<i class="icon-close icons font-2xl d-block"></i></a></td></tr>';
  $("#tableBodyParzialeEdit").prepend(html);


}

function editUser() {
  if (validateFormEdit()) {
    var obj = {
      "nome": "",
      "cognome": "",
      "codicefiscale": "",
      "loginName": "",
      "password": "",
      "email": "",
      "codiceSPID": "",
      "isSuperAdmin": false,
      "organizzazioni": [],
      "idApplicazione": ""
    };
    var objUser = parseAndEditData(obj);
    editUserOnDatabase(objUser);
    $(".modal-lg-EditUser").modal("hide")
    blanckFields();
  }
}

function validateFormEdit() {
  var form = $("#editUserFormEdit").valid();
  if (!form)
    $("#alertFieldEdit").show()
  else
    $("#alertFieldEdit").hide()

  return form
}

function editUserOnDatabase(user) {


  var userString = 'userToUpdate=' + user

  $.ajax({
      type: "POST",
      data: userString,
      url: "api/users/updateUser/",
      success: function (data) {


        console.log(data)
        location.reload();
      },
      error: function (data) {

      }
    })
    .done(function () {

    })
    .fail(function () {

    });
}

function parseAndEditData(jsonObj) {
  // var jsonObj=JSON.parse(obj);
  var nome = $("#nameUserEdit").val();
  var cognome = $("#cognomeUserEdit").val();
  var codiceFiscale = $("#codFiscUserEdit").val();
  var loginName = $("#usernameUserEdit").val();
  var password = $("#passwordUserEdit").val();
  var email = $("#emailUserEdit").val();
  var SPID = $("#codSPIDUserEdit").val();
  //issuperadamin

  jsonObj.nome = nome;
  jsonObj.cognome = cognome;
  jsonObj.codicefiscale = codiceFiscale;
  jsonObj.loginName = loginName;
  if (password != "") {
    jsonObj.password = password;
  }

  jsonObj.email = email;
  jsonObj.codiceSPID = SPID;

  var lengthTable = $("#tableBodyParzialeEdit").children().attr("id");
  lengthTable++;
  for (var a = 0; a < lengthTable; a++) {
    // var code = popolateOrganizationCode($("#organizzTableParzialeEdit_" + a).html());
    jsonObj.organizzazioni.push({
      codiceIpa: $("#organizzTableParzialeEdit_" + a).attr("code"),
      description: $("#organizzTableParzialeEdit_" + a).html(),
      attributes: [{
        name: $("#roleTableParzialeEdit_" + a).html(),
        description: $("#roleTableParzialeEdit_" + a).attr("description")
      }]
    });
  }
  jsonObj.idApplicazione = sessionStorage.getItem("idService");
  jsonObj.id = $("#idUserToEdit").val()
  var jsonToString = JSON.stringify(jsonObj);
  return jsonToString;

}