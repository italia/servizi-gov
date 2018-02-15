if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}
//dovrebbe essere gia caricata da service<Templates
function  getQueryStringParam(name, url) {
    if  (!url) url  = window.location.href;
    name  = name.replace(/[\[\]]/g,  "\\$&");
    var  regex  = new  RegExp("[?&]"  + name  + "(=([^&#]*)|&|#|$)"),
        results  = regex.exec(url);
    if  (!results)  return null;
    if  (!results[2])  return  '';
    return  decodeURIComponent(results[2].replace(/\+/g,  " "));
}
// const serviceRow = '<tr><td data-label="{1}" class="table-th-50">{1}<div class="small text-guide">{2}</div></td><td data-label="caricamento dati"><div class="clearfix">' +
//     '<div class="float-left"><strong></strong></div><div class="float-right"><small class="text-guide">quantità di metadati caricati</small></div></div>' +
//     '<div class="progress progress-xs"> <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>' +
//     '</div></td><td data-label="Qualità"><p class="sr-only">Indice di qualità: 5 su 5</p><i class="fa fa-star fa-star-agidrate" aria-disabled="true"></i></td><td data-label="azioni" class="text-center">' +
//     '<div class="row"><div class="col-4"> <a href="/servizi/service-wizard-complete2/?serviceId={0}" title="modifica"><i class="icon-note icons font-2xl d-block"></i> </a></div><div class="col-4"><a id="rimuovi{0}" href="/service/remove?serviceId={0}" title="cancella">' +
//     '<i class="icon-close icons font-2xl d-block"></i></a></div> <div class="col-4"> <label title="Pubblica servizio" class="switch switch-3d switch-success"><input type="checkbox" class="switch-input" checked value="">' +
//     '<span class="switch-label"></span><span class="switch-handle"></span><span class="sr-only">Pubblica servizio</span></label></div></div></td></tr>'


const applicationRow = '<tr><td data-label="{1}" class="table-th-50">{1}' +
    '<div class="small text-guide">{2}</div></td>' +
    '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a onclick="loadPageApplication(\'{1}\',\'{0}\');" href="/accesscontrol/users" title="utenti"><i class="icon-user-follow icons font-2xl d-block"></i></a></div></div></td>' +
    '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a href="#" onClick="editService(\'{0}\')" title="modifica"><i class="icon-note icons font-2xl d-block"></i></a></div>' +
    '<div class="col-5"><a href="/service/?serviceDelete={0}" title="cancella"><i class="icon-close icons font-2xl d-block"></i></a></div></div></td></tr>'

var currentPos = 0;
var total;
var perPageUser = 3;
var isLoadedAttributes = false;
$(document).ready(function () {
   
    $("#btnAggiungiAttributo").click(function (e) {
        // var isValid = checkIsValidField()
        // if (isValid)
            popolateTableRoleInModal()
        // else{

        // }
    })

    $("#btnAggiungiAttributoEdit").click(function (e) {
        // var isValid = checkIsValidFieldEdit()
        // if (isValid)        
            popolateTableRoleInModalEdit()
        // else{

        // }
    })

    $("#saveApplicationForm").validate({
        ignore: ':hidden',
        rules: {
            nomeApplicazione: "required",
            urlApplicazione: "required",
            descrizioneApplicazione: "required",
            nomeAttributo:"required",
            descrizioneAttributo:"required"
        },
        messages: {
            nomeApplicazione: "Campo obbligatorio",
            urlApplicazione: "Campo obbligatorio",
            descrizioneApplicazione: "Campo obbligatorio",
            nomeAttributo:"Campo obbligatorio",
            descrizioneAttributo:"Campo obbligatorio"
        },
        errorClass: "errorText",
        highlight: function (element) {
          $(element).addClass("errorInput");
        },
        unhighlight: function (element) {
          $(element).removeClass("errorInput");
        }
      });

      $("#saveApplicationFormEdit").validate({
        ignore: ':hidden',
        rules: {
            nomeApplicazioneEdit: "required",
            urlApplicazioneEdit: "required",
            descrizioneApplicazioneEdit: "required",
            nomeAttributoEdit:"required",
            descrizioneAttributoEdit:"required"
        },
        messages: {
            nomeApplicazioneEdit: "Campo obbligatorio",
            urlApplicazioneEdit: "Campo obbligatorio",
            descrizioneApplicazioneEdit: "Campo obbligatorio",
            nomeAttributoEdit:"Campo obbligatorio",
            descrizioneAttributoEdit:"Campo obbligatorio"
        },
        errorClass: "errorText",
        highlight: function (element) {
          $(element).addClass("errorInput");
        },
        unhighlight: function (element) {
          $(element).removeClass("errorInput");
        }
      });
     
      
           
         

    injectApplication();

})

function injectApplication() {

    var url = ""
    $.ajax({
        url: url
    }).done(function (data) {
        renderApplication(data)
    }).fail(function () {
        //alert("errore nella ricerca")
    })

}

function renderApplication(data) {
    $("#applicationBody").empty()
    data.forEach(element => {
        var applicationHtmlFormatted = String.format(applicationRow,
            element.id,
            element.nome,
            element.description,
            "100%")
        $("#applicationBody").append(applicationHtmlFormatted)
    })
}

function loadPageApplication(name, id) {
    sessionStorage.setItem("nameService", name)
    sessionStorage.setItem("idService", id)


}

function popolateTableRoleInModal() {
    var nameRole = $("#nomeAttributo").val() == "" ? "-" : $("#nomeAttributo").val();
    var descrizioneRole = $("#descrizioneAttributo").val() == "" ? "-" : $("#descrizioneAttributo").val();
    var lastId = $("#bodyTableCreateApplication tr").attr("id");
    lastId++;
    var newId = lastId
    var html =
        '<tr id="' + newId + '"><td class="text-center" id="roleName_' + newId + '">' + nameRole + '</td>' +
        '<td class="text-center" id="roleDescription_' + newId + '">' + descrizioneRole + '</td>' +
        '<td class="inline text-center">' +
        '<a href="#" title="modifica" class="m-left-39 m-right-10">' +
        // '<i class="icon-note icons font-2xl d-block"></i></a>' +
        '<a href="#" class="ml-15" onClick="deleteRow(' + newId + ')" title="cancella">' +
        '<i class="icon-close icons font-2xl d-block"></i></a> </td></tr>'

    $("#bodyTableCreateApplication").prepend(html);
    $("#nomeAttributo").val("")
    $("#descrizioneAttributo").val("")
    $("#addAttributeCollapse").collapse("hide")


}

function popolateTableRoleInModalEdit(){
    var nameRole = $("#nomeAttributoEdit").val() == "" ? "-" : $("#nomeAttributoEdit").val();
    var descrizioneRole = $("#descrizioneAttributoEdit").val() == "" ? "-" : $("#descrizioneAttributoEdit").val();
    var lastId = $("#bodyTableCreateApplicationEdit tr").attr("id");
    lastId++;
    var newId = lastId
    var html =
        '<tr id="' + newId + '"><td class="text-center" id="roleNameEdit_' + newId + '">' + nameRole + '</td>' +
        '<td class="text-center" id="roleDescriptionEdit_' + newId + '">' + descrizioneRole + '</td>' +
        '<td class="inline text-center">' +
        '<a href="#" title="modifica" class="m-left-39 m-right-10">' +
        // '<i class="icon-note icons font-2xl d-block"></i></a>' +
        '<a href="#" class="ml-15" onClick="deleteRowEdit(' + newId + ')" title="cancella">' +
        '<i class="icon-close icons font-2xl d-block"></i></a> </td></tr>'

    $("#bodyTableCreateApplicationEdit").prepend(html);
    $("#nomeAttributoEdit").val("");
    $("#descrizioneAttributoEdit").val("");
    $("#addAttributeCollapseEdit").collapse("hide")
}

function deleteRow(row) {
    $("#bodyTableCreateApplication tr#" + row).remove();
}
function deleteRowEdit(row) {
    $("#bodyTableCreateApplicationEdit tr#" + row).remove();
}
function getFieldsToCreateApplication() {
    if($("#saveApplicationForm").valid()){
    var objApplication = app = {
        nome: "",
        url: "",
        description: "",
        attributes: [],
    }

    objApplication.nome = $("#nomeApplicazione").val();
    objApplication.url = $("#urlApplicazione").val();
    objApplication.description = $("#descrizioneApplicazione").val();
    //prendere tutti gli elementi della tabella
    var lengthTable = $("#bodyTableCreateApplication tr").attr("id");
    lengthTable++
    for (var a = 0; a < lengthTable; a++) {
        var roleName = $("#roleName_" + a).html()
        var roleDesc = $("#roleDescription_" + a).html()
        var attribute = '{"name":"' + roleName + '", "description":"' + roleDesc + '"}';
        objApplication.attributes.push(JSON.parse(attribute))
    }
    insertInDatabase(objApplication)
}

}

function insertInDatabase(obj) {
    obj = JSON.stringify(obj);
    obj = JSON.parse(obj)
    $.ajax({
        type: "POST",
        async: false,
        data: obj,
        url: "",
        success: function (data) {


            console.log(data)
        },
        error: function (data) {

        }
    })
}

function editService(service) {
    if(!isLoadedAttributes){
    var objService = getService(service)
    // console.log(objService)
    popolateModalEdit(objService);
    isLoadedAttributes = true
}
    $(".modalEditApplication").modal("show")
}

function getService(id) {
    var obj;
    $.ajax({
        type: "GET",
        async: false,
        url: "" + id,
        success: function (data) {
            obj = data
        },
        error: function (data) {}
    })
    return obj
}

function popolateModalEdit(objService) {
    var nomeApp = objService.nome;
    var urlApp = objService.url;
    var descrizioneApp = objService.description;
    var attributi = objService.attributes;
    $("#nomeApplicazioneEdit").val(nomeApp)
    $("#urlApplicazioneEdit").val(urlApp)
    $("#descrizioneApplicazioneEdit").val(descrizioneApp)
    $("#idApplication").val(objService.id)

    popolateTableInModal(attributi);
}

function popolateTableInModal(attr) {

    $("#bodyTableCreateApplicationEdit").html()
    var container = $("#bodyTableCreateApplicationEdit")
    var lastId = $("#bodyTableCreateApplicationEdit tr").attr("id");
    lastId++;
    var newId = lastId
    $.each(attr, function (index, value) {
        var html = '<tr id="' + newId + '"><td class="text-center" id="roleName_' + newId + '">' + value.name + '</td>' +
            '<td class="text-center" id="roleDescription_' + newId + '">' + value.description + '</td>' +
            '<td class="inline text-center">' +
            '<a href="#" title="modifica" class="m-left-39 m-right-10">' +
            // '<i class="icon-note icons font-2xl d-block"></i></a>' +
            '<a href="#" class="ml-15" onClick="deleteRow(' + newId + ')" title="cancella">' +
            '<i class="icon-close icons font-2xl d-block"></i></a> </td></tr>'
        if (value.name != 'admin' && value.name != 'superAdmin') {
            container.prepend(html);

        }

    })



}
function removeAttributesLoad(){
    var lastId = $("#bodyTableCreateApplicationEdit tr").attr("id");

}

function updateApplication(){
var obj = popolateObjToUpdate();
    console.log(obj)
    var objToString = JSON.stringify(obj)
    objToString = 'appToAdd='+objToString
    $.ajax({
        type: "POST",
        async: false,
        data:objToString,
        url: "",
        success: function (data) {
            console.log(data)
        },
        error: function (data) {}
    })
}

function popolateObjToUpdate(){
    var objApplication = app = {
        nome: "",
        url: "",
        description: "",
        attributes: [],
        id:""
    }
    objApplication.nome = $("#nomeApplicazioneEdit").val();
    objApplication.url = $("#urlApplicazioneEdit").val();
    objApplication.description = $("#descrizioneApplicazioneEdit").val();
    objApplication.id=$("#idApplication").val()
    //prendere tutti gli elementi della tabella
    var lengthTable = $("#bodyTableCreateApplicationEdit tr").attr("id");
    lengthTable++
    for (var a = 0; a < lengthTable; a++) {
        var roleName = $("#roleNameEdit_" + a).html()
        var roleDesc = $("#roleDescriptionEdit_" + a).html()
        var attribute = '{"name":"' + roleName + '", "description":"' + roleDesc + '"}';
        objApplication.attributes.push(JSON.parse(attribute))
    }
    return objApplication

}