const applicationRow =
  '<tr><td data-label="{1}" class="table-th-50">{1}' +
  '<div class="small text-guide">{2}</div></td>' +
  '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a href="/accesscontrol/users" title="utenti"><i class="icon-user-follow icons font-2xl d-block"></i></a></div></div></td>' +
  '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a href="#" title="modifica"><i class="fa fa-edit icons font-2xl d-block"></i></a></div>' +
  '<div class="col-5"><a href="#" title="cancella"><i class="fa fa-times-circle icons font-2xl d-block"></i></a></div></div></td></tr>';
const applicationUserRow =
  '<tr>' +
  "<td>{2}</td>" +
  // "<td>{3}</td>" +
  '<td id="userToAttr">{3}</td>' +
  '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a href="#" onclick="editUsersPopolateModal(\'{0}\')" title="modifica"><i class="fa fa-edit icons font-2xl d-block"></i></a></div>' +
  '<div class="col-5"><a href="#" onclick="removeUsers(\'{0}\',this)" title="cancella"><i class="fa fa-times-circle icons font-2xl d-block"></i></a></div></div></td></tr>';

var currentPos = 0;
var total;
var perPageUser = 3;

$(document).ready(function () {
  $("#nextTabTopEdit").click(function (e) {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
    console.log(e);
    $("#tabModalEdit .active")
      .parent()
      .next("li")
      .find("a")
      .trigger("click");
  });

  $("#prevTabTopEdit").click(function (e) {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
    console.log(e);
    $("#tabModalEdit .active")
      .parent()
      .prev("li")
      .find("a")
      .trigger("click");
  });

  $("#nextTabTopSave").click(function (e) {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
    console.log(e);
    $("#tabModalAdd .active")
      .parent()
      .next("li")
      .find("a")
      .trigger("click");
  });

  $("#prevTabTopSave").click(function (e) {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
    console.log(e);
    $("#tabModalAdd .active")
      .parent()
      .prev("li")
      .find("a")
      .trigger("click");
  });

  $('#tabModalAdd a[data-toggle="tab"]').on("hide.bs.tab", function (e) {
    if (e.relatedTarget.id == "home-tab") {
      $("#prevTabTopSave").hide();
      $("#nextTabTopSave").show();
    } else
    if (e.relatedTarget.id == "profile-tab") {
      $("#prevTabTopSave").show();
      $("#nextTabTopSave").show();
    } else
    if (e.relatedTarget.id == "organizations-tab") {
      $("#prevTabTopSave").show();
      $("#nextTabTopSave").show();
    } else
    if (e.relatedTarget.id == "save-tab") {
      $("#prevTabTopSave").show();
      $("#nextTabTopSave").hide();
    }

  })

  $('#tabModalEdit a[data-toggle="tab"]').on("hide.bs.tab", function (e) {
    if (e.relatedTarget.id == "home-tab-edit") {
      $("#prevTabTopEdit").hide();
      $("#nextTabTopEdit").show();
    } else
    if (e.relatedTarget.id == "profile-tab-edit") {
      $("#prevTabTopEdit").show();
      $("#nextTabTopEdit").show();
    } else
    if (e.relatedTarget.id == "organizations-tab-edit") {
      $("#prevTabTopEdit").show();
      $("#nextTabTopEdit").show();
    } else
    if (e.relatedTarget.id == "save-tab-edit") {
      $("#prevTabTopEdit").show();
      $("#nextTabTopEdit").hide();
    }

  })


  $("#visualizzaGriglia").click(function () {
    startWait("card", "Caricamento utenti in corso..")
    var organization = $("#getOrganizationForTable").val()
    //?
    var idApp = sessionStorage.getItem("idService")
    var name = "sgiabaccontroller"
    var collection = "users"
    var query = '?filter={"where":{"organizzazioni":{"elemMatch":{"codiceIpa":"' + organization + '"}}}}';
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
      var data = objData.data
      if (data.length > 0) {
        renderApplicationToUser(data);
        $("#buttonAddUserToApplication").show();
        $("#tableUser").show();
        $("#noResults").hide();
        stopWait("card")
      } else {
        stopWait("card");
        $("#noResults").show();
      }
    } else {
      error('Impossibile caricare gli utenti autorizzati per la PA selezionata')
    }
  })
  $("#btnSaveUser").click(function (event) {
    salvaUser()
  })
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
  $("#getOrganizationForTable").keyup(function (event) {
    if (event.keyCode === 13)
      document.getElementById('visualizzaGriglia').dispatchEvent(new Event('click'))
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
      // passwordUserAgainEdit: {
      //   equalTo: "#passwordUserEdit"
      // }

    },
    messages: {
      cognomeUserEdit: "Campo obbligatorio",
      nameUserEdit: "Campo obbligatorio",
      codFiscUserEdit: "Campo obbligatorio",
      codSPIDUserEdit: "Campo obbligatorio",
      usernameUserEdit: "Campo obbligatorio",
      emailUserEdit: "Inserire email valida",
      // passwordUserAgainEdit: "Password diversa"

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

  // $("#avantiModalEdit").click(function (e) {
  //   $("#tabModalEdit .active")
  //     .parent()
  //     .next("li")
  //     .find("a")
  //     .trigger("click");
  // })
  // $("#indietroModalEdit").click(function (e) {
  //   $("#tabModalEdit .active")
  //     .parent()
  //     .prev("li")
  //     .find("a")
  //     .trigger("click");
  // })

  // $("#avantiModalAdd").click(function (e) {
  //   $("#tabModalAdd .active")
  //     .parent()
  //     .next("li")
  //     .find("a")
  //     .trigger("click");
  // })
  // $("#indietroModalAdd").click(function (e) {
  //   $("#tabModalAdd .active")
  //     .parent()
  //     .prev("li")
  //     .find("a")
  //     .trigger("click");
  // })
  if (!$("#getOrganizationForTable").is("select")) {
    $("#getOrganizationForTable").autocomplete({
      source: function (request, resolve) {
        popolateAutocompleteOrganizzUser(request.term, resolve);
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

  if (!$("#getOrganizationEditUser").is("select")) {
    $("#getOrganizationEditUser").autocomplete({
      source: function (request, resolve) {
        popolateAutocompleteOrganizzUser(request.term, resolve);
      },

      select: function (event, ui) {
        $("#getOrganizationEditUser").val(ui.item.label);
        $("#getOrganizationEditUser").attr("itemCode", ui.item.value);
        return false;
      },
      change: function (event, ui) {
        $(this).val((ui.item ? ui.item.label : ""));
      },
    });
  }

  if (!$("#getOrganizationForInsertUser").is("select")) {
    $("#getOrganizationForInsertUser").autocomplete({
      source: function (request, resolve) {
        popolateAutocompleteOrganizzUser(request.term, resolve);
      },

      select: function (event, ui) {
        $("#getOrganizationForInsertUser").val(ui.item.label);
        $("#getOrganizationForInsertUser").attr("itemCode", ui.item.value);
        return false;
      },
      change: function (event, ui) {
        $(this).val((ui.item ? ui.item.label : ""));
      },
    });
  }



  popolateSelectRole();


});

function popolateSelectRole() {
  var applicationId = sessionStorage.getItem("idService")
  var name = "sgiabaccontroller"
  var collection = "applications/" + applicationId
  var query = ""
  var environment = ""
  var url = urlComposer(name, collection, query, environment);
  var objData = callService("GET", url);
  if (objData.success) {
    var data = objData.data
    popolateSelectAttributesRole(data.attributes)

    console.log(data)
  } else {}

  if (!$("#isSuperAdminInput").val())
    $("#rolesAttributes option[value='superAdmin']").remove()

}

function popolateSelectAttributesRole(data) {
  var userIsAdmin = false;
  var userIsSuperAdmin = !$("#isSuperAdminInput").val()
  var boolAdmin = $("#roleUser").val().search("admin");
  if (boolAdmin != -1) {
    userIsAdmin = true
  }
  $.each(data, function (index, value) {
    if (value.name != "superAdmin") {
      if (userIsSuperAdmin) {
        if (value.name != "admin" && userIsAdmin) {
          var html = "<option value='" + value.name + "' description='" + value.description + "'>" + value.name + "</option>"
          $("#rolesAttributesEdit").append(html)
          $("#rolesAttributes").append(html)
        }
      } else {
        var html = "<option value='" + value.name + "' description='" + value.description + "'>" + value.name + "</option>"
        $("#rolesAttributesEdit").append(html)
        $("#rolesAttributes").append(html)
      }
    }
  })

}

function injectApplication() {
  var name = "sgiabaccontroller"
  var collection = "applications"
  var query = ""
  var environment = ""
  var url = urlComposer(name, collection, query, environment);
  var objData = callService("GET", url);
  if (objData.success) {
    var data = objData.data
    renderApplication(data);
  } else {
    error("generic error")
  }
}

function loadPageApplication(name) {
  alert(name);
}

function renderApplication(data) {
  $("#applicationBody").empty();
  $.each(data, function (index, element) {
    var applicationHtmlFormatted = String.format(
      applicationRow,
      element.id,
      element.nome,
      element.description,
      "100%"
    );
    $("#applicationBody").append(applicationHtmlFormatted);
  })
}

function renderApplicationToUser(data) {
  $("#applicationToUser").empty();
  var x;
  var attributes = "";
  var organizzazioni = "";
  var isHidden;

  $.each(data, function (index, element) {
    var applicationUserFormatted = String.format(
      applicationUserRow,
      element.id,
      element.idApplicazione,
      element.cognome + " " + element.nome,
      element.attributes[0].name,
      element.organizzazioni,
      "100%",
    );
    $("#applicationToUser").append(applicationUserFormatted);
    attributes = "";
    organizzazioni = "";
  })
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
    '<a href="#" title="cancella"><i class="fa fa-times-circle icons font-2xl d-block"></i></a>' +
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
  if ($("#rolesAttributes").val() != null) {
    //giusto
    var check = checkIfIsInTable($("#rolesAttributes").val(), $("#tableBodyParziale"));
    if (!check) {
      var ruolo = $("#rolesAttributes").val() == null ? "-" : $("#rolesAttributes").val();
      var ruoloDescription = $("#rolesAttributes").find(":selected").attr("description");
      var numberRowTableParziale = $("#tableBodyParziale tr").attr("id");
      // numberRowTableParziale = numberRowTableParziale != undefined ? numberRowTableParziale++ : 0;
      if (numberRowTableParziale == undefined) {
        numberRowTableParziale = 0
      } else
        numberRowTableParziale++
        var html =
          '<tr id="' +
          numberRowTableParziale +
          '" >' +
          '<td class="text-center" description="' + ruoloDescription + '" id="roleTableParziale_' + numberRowTableParziale + '">' +
          ruolo +
          '</td><td class="text-center"><a href="#" title="cancella" class="" onclick="removeRow(this)">' +
          '<i class="fa fa-times-circle icons font-2xl d-block"></i></a></td></tr>';
      $("#tableBodyParziale").prepend(html);
      $("#alertFieldAttributes").hide();
      $("#alertFieldGlobalSave").hide();
    }
  }

}

function checkIfIsInTable(value, elmTable) {
  var numberRowInTable = elmTable.children().attr("id");
  if (numberRowInTable == undefined) {
    return false
  } else
    numberRowInTable++
    for (var a = 0; a < numberRowInTable; a++) {
      if (($("#roleTableParziale_" + a).html() != "" || $("#roleTableParziale_" + a).html() != undefined) && $("#roleTableParziale_" + a).html() == value) {
        return true
      }
    }
  return false

}

function salvaParzialeInTabellaAttrEdit() {


  // if ($("#getOrganizationForTable").is("select")) {
  //   var optionValue = $("#getOrganizationForTable").val()
  //   // console.log($("#getOrganization option[value="+optionValue+"]").attr("itemCode"))
  //   var organizzazione = $("#getOrganizationForTable option#" + optionValue + "").attr("itemcode") == "" ? "-" : $("#getOrganizationForTable option#" + optionValue + "").attr("itemcode")

  // } else
  //   var organizzazione = $("#getOrganizationForTable").children(":selected").attr("itemcode") == "" ? "-" : $("#getOrganizationForTable").attr("itemcode")

  // var codeOrganizzazione = $("#getOrganizationForTable").val() == "" ? "-" : $("#getOrganizationForTable").val();
  if ($("#rolesAttributesEdit").val() != null) {
    var check = checkIfIsInTableEdit($("#rolesAttributesEdit").val(), $("#tableBodyParzialeAttrEdit"));
    if (!check) {
      $("#alertFieldAttributesEdit").hide();
      $("#alertFieldGlobalEdit").hide();
      var ruolo = $("#rolesAttributesEdit").val() == null ? "-" : $("#rolesAttributesEdit").val();
      var ruoloDescription = $("#rolesAttributesEdit").find(":selected").attr("description");
      var numberRowTableParziale = $("#tableBodyParzialeAttrEdit tr").attr("id");
      if (numberRowTableParziale == undefined) {
        numberRowTableParziale = 0
      } else
        numberRowTableParziale++
        var html =
          '<tr id="' +
          numberRowTableParziale +
          '" >' +
          '<td class="text-center" description="' + ruoloDescription + '" id="roleTableParzialeEdit_' + numberRowTableParziale + '">' +
          ruolo +
          '</td><td class="text-center"><a href="#" title="cancella" class="" onclick="removeRow(this)">' +
          '<i class="fa fa-times-circle icons font-2xl d-block"></i></a></td></tr>';
      $("#tableBodyParzialeAttrEdit").prepend(html);
    }
  }
}

function checkIfIsInTableEdit(value, elmTable) {
  var numberRowInTable = elmTable.children().attr("id");
  if (numberRowInTable == undefined) {
    return false
  } else
    numberRowInTable++
    for (var a = 0; a < numberRowInTable; a++) {
      if (($("#roleTableParzialeEdit_" + a).html() != "" || $("#roleTableParzialeEdit_" + a).html() != undefined) && $("#roleTableParzialeEdit_" + a).html() == value) {
        return true
      }
    }
  return false

}

function salvaUser() {
  if (validateForm()) {
    $("#alertFieldGlobalSave").hide()
    var obj = {
      "nome": "",
      "cognome": "",
      "codicefiscale": "",
      "password": "",
      "email": "",
      "codiceSPID": "",
      "isSuperAdmin": false,
      "organizzazioni": [],
      "attributes": [],
      "idApplicazione": "",
      "codiceFiscaleAdmin": ""
    };
    var objUser = parseAndInsertData(obj);
    if (saveOnDatabase(objUser)) {
      success("Utente aggiunto correttamente")
      setTimeout(function () {
        location.reload();
      }, 2000)
    }
  } else
    $("#alertFieldGlobalSave").show()
}

function validateForm() {
  var form = $("#saveUserForm").valid();
  var haveElementsInTab = $("#tableBodyParziale").children().length > 0;
  var haveElementsInTabOrg = $("#tableOrgParziale").children().length > 0;
  if (haveElementsInTab) {
    $("#alertFieldAttributes").hide()
  } else
    $("#alertFieldAttributes").show()
  if (!form)
    $("#alertFieldAttributes").show()
  else
    $("#alertFieldAttributes").hide()
  if (!haveElementsInTabOrg)
    $("#alertFieldOrganization").show()
  else
    $("#alertFieldOrganization").hide()
  return form && haveElementsInTab && haveElementsInTabOrg
}

function parseAndInsertData(jsonObj) {
  // var jsonObj=JSON.parse(obj);
  var nome = $("#nameUser").val();
  var cognome = $("#cognomeUser").val();
  var codiceFiscale = $("#codFiscUser").val();
  var password = $("#passwordUser").val();
  var email = $("#emailUser").val();
  var SPID = $("#codSPIDUser").val();
  //issuperadamin
  jsonObj.nome = nome;
  jsonObj.cognome = cognome;
  jsonObj.codicefiscale = codiceFiscale;
  jsonObj.password = password;
  jsonObj.codiceSPID = SPID
  jsonObj.email = email;
  jsonObj.codiceFiscaleAdmin = sessionStorage.getItem("userId")
  var lengthTable = $("#tableBodyParziale").children().attr("id");
  lengthTable++;
  $.each($("#tableOrgParziale .internalOrgCode"), function (index, element) {
    jsonObj.organizzazioni.push({
      codiceIpa: element.innerHTML,
      description: $(element).attr("code")
    })
  })
  for (var a = 0; a < lengthTable; a++) {
    var bool = $("#roleTableParziale_" + a).html().replace(/ /g, '') != "";
    if (bool) {
      jsonObj.attributes.push({
        name: $("#roleTableParziale_" + a).html(),
        description: $("#roleTableParziale_" + a).attr("description")
      })
    }
  }
  jsonObj.idApplicazione = sessionStorage.getItem("idService");
  var jsonToString = JSON.stringify(jsonObj);
  return jsonToString;
}

function popolateOrganizationCode(description) {
  var code;
  var name = "sgiorganization"
  var collection = "organizations"
  var query = '?filter={"where":{"name":{"like":"' + description + '"}}}';
  var environment = ""
  var url = urlComposer(name, collection, query, environment);
  var objData = callService("GET", url);
  if (objData.success) {
    var data = objData.data
    if (data[0] != undefined)
      code = data[0].organizationCode

  } else {}
  return code
}

function saveOnDatabase(user) {
  var userString = 'userToAdd=' + user
  var name = "sgiabaccontroller"
  var collection = "users/addUsersToAbac/"
  var query = ""
  var environment = ""
  var url = urlComposer(name, collection, query, environment);
  //var url = "http://localhost:3500/api/" + collection;
  var objData = callService("POST", url, userString);
  console.log(objData)
  return objData.success;
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

function popolateAutocompleteOrganizzUser(insertWord, response) {


  var name = "sgiorganization"
  var collection = "organizations"
  var query = '?filter={"where":{"or":[{"name":{"like":"' +
    insertWord +
    '.*","options":"i"}},{"organizationCode":{"like":"' +
    insertWord +
    '.*","options":"i"}}]},"limit":20}';
  var environment = ""
  var url = urlComposer(name, collection, query, environment);
  var objData = callService("GET", url);
  if (objData.success) {
    var data = objData.data
    var appName = [];

    $.each(data, function (i, field) {
      appName.push({
        value: field.name,
        label: field.organizationCode
      });
    });

    response(appName);
  } else {}
}

function removeUsers(id, self) {


  var message = "Rimozione utente";
  var description = "Sei sicuro di voler rimuovere definitivamente questo utente?";
  swal({
      title: message,
      text: description,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      buttons: ["Annulla", "Conferma"]
    })
    .then((willDelete) => {
      if (willDelete) {
        var codiceFiscaleAdmin = sessionStorage.getItem("userId");
        var objToPost = 'userToDelete={"codiceFiscaleAdmin":"' + codiceFiscaleAdmin + '","idUserToDelete":"' + id + '"}';
        var name = "sgiabaccontroller"
        var collection = 'users';
        var query = ""
        var environment = ""
        var url = urlComposer(name, collection, query, environment);
        var objData = callService("POST", url, objToPost);
        if (objData.success) {
          var data = objData.data
          $(self).parent().parent().parent().parent().remove()
        } else {}
        swal("Rimozione effettuata!", {
          icon: "success",
        });
        return true;
      } else {
        swal("Operazione annullata");
        return false;
      }
    });

}

function editUsersPopolateModal(id) {
  blankTable();
  $(".modal-lg-EditUser").modal("show");
  var user = getUserById(id)
  popolateModalUserEdit(user);

}

function blankTable() {
  $("#tableOrgParzialeEdit").empty();
  $("#tableBodyParzialeAttrEdit").empty();
}

function getUserById(id) {
  var user;
  var name = "sgiabaccontroller"
  var collection = "/users/" + id;
  var query = ""
  var environment = ""
  var url = urlComposer(name, collection, query, environment);
  var objData = callService("GET", url);
  if (objData.success) {
    var data = objData.data
    user = data
  } else {}
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
  var attributes = user.attributes;
  $("#idUserToEdit").val(id)
  $("#cognomeUserEdit").val(cognome);
  $("#nameUserEdit").val(nome);
  $("#codFiscUserEdit").val(codiceFiscale);
  $("#codSPIDUserEdit").val(SPID);
  $("#usernameUserEdit").val(username);
  $("#emailUserEdit").val(email);

  if (!isSuperAdmin) {

    $.each(attributes, function (index, value) {
      salvaParzialeInTabellaEditAttributes(value.description, value.name);
    })
    $.each(organizzazioni, function (index, value) {
      salvaParzialeInTabellaEditOrg(value.description, value.codiceIpa);
    })
  }
}

// function salvaParzialeInTabellaEdit() {
//   $("#tableBodyParzialeEdit").html()
//   if ($("#getOrganizationForTable").is("select")) {
//     var optionValue = $("#getOrganizationForTable").val()
//     // console.log($("#getOrganization option[value="+optionValue+"]").attr("itemCode"))
//     var organizzazione = $("#getOrganizationForTable option#" + optionValue + "").attr("itemcode") == "" ? "-" : $("#getOrganizationForTable option#" + optionValue + "").attr("itemcode")
//   } else
//     var organizzazione = $("#getOrganizationForTable").children(":selected").attr("itemcode") == "" ? "-" : $("#getOrganizationForTable").attr("itemcode")

//   var codeOrganizzazione = $("#getOrganizationForTable").val() == "" ? "-" : $("#getOrganizationForTable").val();
//   var ruolo = $("#rolesAttributesEdit").val() == null ? "-" : $("#rolesAttributesEdit").val();
//   var ruoloDescription = $("#rolesAttributesEdit").find(":selected").attr("description");
//   var numberRowTableParziale = $("#tableBodyParzialeEdit").children().length++;
//   var html =
//     '<tr id="' +
//     numberRowTableParziale +
//     '" ><td class="text-center" code="' + codeOrganizzazione + '" id="organizzTableParzialeEdit_' + numberRowTableParziale + '">' +
//     organizzazione +
//     "</td>" +
//     '<td class="text-center" description="' + ruoloDescription + '" id="roleTableParzialeEdit_' + numberRowTableParziale + '">' +
//     ruolo +
//     '</td><td class="text-center"><a href="#" title="cancella" class="ml-5" onclick="deleteRowTableParzialeEdit(' +
//     numberRowTableParziale +
//     ')">' +
//     '<i class="icon-trash icons font-2xl d-block"></i></a></td></tr>';
//   $("#tableBodyParzialeEdit").prepend(html);
// }

function salvaParzialeOrgInTabella() {
  if ($("#getOrganizationForInsertUser").val() != "" && ($("#getOrganizationForInsertUser").val() != undefined || $("#getOrganizationForInsertUser").val() != null)) {
    if ($("#getOrganizationForInsertUser").is("select")) {
      var check = checkIfIsInTableOrg($("#getOrganizationForInsertUser").children(":selected").attr("itemcode"), $("#tableOrgParzialeEdit"));
    } else
      var check = checkIfIsInTableOrg($("#getOrganizationForInsertUser").val(), $("#tableOrgParziale"));
    if (!check) {
      $("#alertFieldOrganization").hide();
      $("#alertFieldGlobalSave").hide();
      let html = "";
      var numberRowTableParziale = $("#tableOrgParziale tr").attr("id");
      if (numberRowTableParziale == undefined) {
        numberRowTableParziale = 0
      } else
        numberRowTableParziale++
        var rowFormat = '<tr id="{0}"><td id="rowOrganization_{0}" code="{2}" class="text-center internalOrgCode">{1}</td><td class="text-center"><a href="#" onclick="removeRow(this)" title="cancella" class=""><i class="fa fa-times-circle icons font-2xl d-block"></i></a></td></tr>';
      if ($("#getOrganizationForTable").is("select"))
        html = String.format(rowFormat, numberRowTableParziale, $("#getOrganizationForInsertUser").val(), $("#getOrganizationForInsertUser").children(":selected").attr("itemcode"));
      else
        html = String.format(rowFormat, numberRowTableParziale, $("#getOrganizationForInsertUser").val(), $("#getOrganizationForInsertUser").attr("itemcode"));
      $("#tableOrgParziale").prepend(html);
    }
  }
}
/**
 * Aggiunge alla tabella
 */
function salvaParzialeOrgInTabellaEdit() {

  if ($("#getOrganizationEditUser").val() != "" && ($("#getOrganizationEditUser").val() != undefined || $("#getOrganizationEditUser").val() != null)) {
    if ($("#getOrganizationEditUser").is("select")) {
      var check = checkIfIsInTableOrgEdit($("#getOrganizationEditUser").children(":selected").attr("itemcode"), $("#tableOrgParzialeEdit"));
    } else
      var check = checkIfIsInTableOrgEdit($("#getOrganizationEditUser").val(), $("#tableOrgParzialeEdit"));

    if (!check) {
      $("#alertFieldOrganizationEdit").hide()
      $("#alertFieldGlobalEdit").hide()
      let html = ""
      var numberRowTableParziale = $("#tableOrgParzialeEdit tr").attr("id");
      if (numberRowTableParziale == undefined) {
        numberRowTableParziale = 0
      } else
        numberRowTableParziale++
        var rowFormat = '<tr id="{0}"><td id="rowOrganizationEdit_{0}" code="{2}" class="text-center internalOrgCode">{1}</td><td class="text-center"><a href="#" onclick="removeRow(this)" title="cancella" class=""><i class="fa fa-times-circle icons font-2xl d-block"></i></a></td></tr>';
      if ($("#getOrganizationForTable").is("select"))
        html = String.format(rowFormat, numberRowTableParziale, $("#getOrganizationEditUser").val(), $("#getOrganizationEditUser").children(":selected").attr("itemcode"));
      else
        html = String.format(rowFormat, numberRowTableParziale, $("#getOrganizationEditUser").val(), $("#getOrganizationEditUser").attr("itemcode"));
      $("#tableOrgParzialeEdit").prepend(html);
    }
  }
}

function checkIfIsInTableOrg(value, elmTable) {
  var numberRowInTable = elmTable.children().attr("id");
  if (numberRowInTable == undefined) {
    return false
  } else
    numberRowInTable++
    for (var a = 0; a < numberRowInTable; a++) {
      if (($("#rowOrganization_" + a).html() != "" || $("#rowOrganization_" + a).html() != undefined) && $("#rowOrganization_" + a).html() == value) {
        return true
      }
    }
  return false
}

function checkIfIsInTableOrgEdit(value, elmTable) {
  var numberRowInTable = elmTable.children().attr("id");
  if (numberRowInTable == undefined) {
    return false
  } else
    numberRowInTable++
    for (var a = 0; a < numberRowInTable; a++) {
      if (($("#rowOrganizationEdit_" + a).html() != "" || $("#rowOrganizationEdit_" + a).html() != undefined) && $("#rowOrganizationEdit_" + a).html() == value) {
        return true
      }
    }
  return false
}
/**
 * Carica nella tabella
 * @param {string} organizzazioneEdit
 * @param {string} codeOrganizz
 * @returns {string}
 */
function salvaParzialeInTabellaEditOrg(organizzazioneEdit, codeOrganizz) {

  $("#alertFieldOrganizationEdit").hide()
  $("#alertFieldGlobalEdit").hide()
  let html = ""
  var numberRowTableParziale = $("#tableOrgParzialeEdit tr").attr("id");
  if (numberRowTableParziale == undefined) {
    numberRowTableParziale = 0
  } else
    numberRowTableParziale++
    var rowFormat = '<tr id="{0}"><td id="rowOrganizationEdit_{0}" code="{2}" class="text-center internalOrgCode">{1}</td><td class="text-center"><a href="#" onclick="removeRow(this)" title="cancella" class=""><i class="fa fa-times-circle icons font-2xl d-block"></i></a></td></tr>';

  html = String.format(rowFormat, numberRowTableParziale, codeOrganizz, organizzazioneEdit);

  $("#tableOrgParzialeEdit").prepend(html);
}


// $("#tableBodyParzialeEdit").html("");
// var organizzazioneCode = codeOrganizz;
// var organizzazione = organizzazioneEdit;
// var numberRowTableParziale = $("#tableBodyParziale").children().length++;
// var rowFormat = '<tr id="{0}"><td class="text-center internalOrgCode" code="{2}">{1}</td><td class="text-center"><a href="#" onclick="removeRow(this)" title="cancella" class=""><i class="fa fa-times-circle icons font-2xl d-block"></i></a></td></tr>';
// var html = String.format(rowFormat, numberRowTableParziale, codeOrganizz, organizzazioneEdit);
// $("#tableOrgParzialeEdit").prepend(html);


function salvaParzialeInTabellaEditAttributes(description, name) {
  $("#tableBodyParzialeEdit").html("");
  var description = description;
  var name = name;
  var numberRowTableParziale = $("#tableBodyParzialeAttrEdit").children().length++;
  var html =
    '<tr id="' +
    numberRowTableParziale +
    '" >' +
    '<td class="text-center" description="' + description + '" id="roleTableParzialeEdit_' + numberRowTableParziale + '">' +
    name +
    '</td><td class="text-center"><a href="#" onclick="removeRow(this)" title="cancella" class="" onclick="removeRow(this)">' +
    '<i class="fa fa-times-circle icons font-2xl d-block"></i></a></td></tr>';
  $("#tableBodyParzialeAttrEdit").prepend(html);
}

function editUser() {
  if (validateFormEdit()) {
    $("#alertFieldGlobalEdit").hide()
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
      "attributes": [],
      "idApplicazione": "",
      "codiceFiscaleAdmin": ""
    };
    var objUser = parseAndEditData(obj);
    editUserOnDatabase(objUser);
    $(".modal-lg-EditUser").modal("hide");
    blanckFields();
  } else
    $("#alertFieldGlobalEdit").show();
}

function validateFormEdit() {
  var form = $("#editUserFormEdit").valid();
  var tableAttributes = $("#tableBodyParzialeAttrEdit").children().length > 0;
  var tableOrganization = $("#tableOrgParzialeEdit").children().length > 0;
  if (!form)
    $("#alertFieldEdit").show();
  else
    $("#alertFieldEdit").hide();
  if (!tableAttributes)
    $("#alertFieldAttributesEdit").show();
  else
    $("#alertFieldAttributesEdit").hide();
  if (!tableOrganization)
    $("#alertFieldOrganizationEdit").show();
  else
    $("#alertFieldOrganizationEdit").hide();


  return form && tableAttributes && tableOrganization;
}

function editUserOnDatabase(user) {
  var userString = 'userToUpdate=' + user;
  var name = "sgiabaccontroller";
  var collection = "users/updateUser/";
  var query = "";
  var environment = "";
  var url = urlComposer(name, collection, query, environment);
  //var url = "http://localhost:3500/api/" + collection
  var objData = callService("POST", url, userString);
  if (objData.success) {
    var message = objData.data.result;
    success(message);
    setTimeout(function () {
      location.reload();
    }, 2000);
  } else {
    error("Impossibile modificare l'utente. Controllare che i valori inseriti siano corretti ");
  }
}

function parseAndEditData(jsonObj) {
  // var jsonObj=JSON.parse(obj);
  var nome = $("#nameUserEdit").val();
  var cognome = $("#cognomeUserEdit").val();
  var codiceFiscale = $("#codFiscUserEdit").val();
  var loginName = $("#usernameUserEdit").val();
  // var password = $("#passwordUserEdit").val();
  var email = $("#emailUserEdit").val();
  var SPID = $("#codSPIDUserEdit").val();
  //issuperadamin

  jsonObj.nome = nome;
  jsonObj.cognome = cognome;
  jsonObj.codicefiscale = codiceFiscale;
  jsonObj.loginName = loginName;
  // if (password != "") {
  //   jsonObj.password = password;
  // }
  jsonObj.email = email;
  jsonObj.codiceSPID = SPID;
  jsonObj.organizzazioni = []
  jsonObj.attributes = []
  jsonObj.codiceFiscaleAdmin = sessionStorage.getItem("userId")
  var lengthTableEdit = $("#tableBodyParzialeAttrEdit").children().attr("id");
  lengthTableEdit++

  $.each($("#tableOrgParzialeEdit .internalOrgCode"), function (index, element) {
    jsonObj.organizzazioni.push({
      codiceIpa: element.innerHTML,
      description: $(element).attr("code")
    })
  })

  for (var a = 0; a < lengthTableEdit; a++) {
    var bool = $("#roleTableParzialeEdit_" + a).html().replace(/ /g, '') != "";
    if (bool) {
      jsonObj.attributes.push({
        name: $("#roleTableParzialeEdit_" + a).html(),
        description: $("#roleTableParzialeEdit_" + a).attr("description")
      })
    }
  }
  jsonObj.idApplicazione = sessionStorage.getItem("idService");
  jsonObj.id = $("#idUserToEdit").val()
  var jsonToString = JSON.stringify(jsonObj);
  return jsonToString;

}

function removeRow(elm) {
  $(elm).parent().parent().remove();
}




// function parseAndInsertData(jsonObj) {
//   // var jsonObj=JSON.parse(obj);
//   var nome = $("#nameUser").val();
//   var cognome = $("#cognomeUser").val();
//   var codiceFiscale = $("#codFiscUser").val();
//   var loginName = $("#usernameUser").val();
//   var password = $("#passwordUser").val();
//   var email = $("#emailUser").val();
//   var SPID = $("#codSPIDUser").val();
//   //issuperadamin
//   jsonObj.nome = nome;
//   jsonObj.cognome = cognome;
//   jsonObj.codicefiscale = codiceFiscale;
//   jsonObj.password = password;
//   jsonObj.codiceSPID = SPID
//   jsonObj.email = email;
//   var lengthTable = $("#tableBodyParziale").children().attr("id");
//   lengthTable++;
//   $.each($("#tableOrgParziale .internalOrgCode"), function (index, element) {
//     jsonObj.organizzazioni.push({
//       codiceIpa: element.innerHTML,
//       description: $(element).attr("code")
//     })
//   })
//   for (var a = 0; a < lengthTable; a++) {
//     jsonObj.attributes.push({
//       name: $("#roleTableParziale_" + a).html(),
//       description: $("#roleTableParziale_" + a).attr("description")
//     })
//   }
//   jsonObj.idApplicazione = sessionStorage.getItem("idService");
//   var jsonToString = JSON.stringify(jsonObj);
//   return jsonToString;
// }