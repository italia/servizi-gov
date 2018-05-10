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
function getQueryStringParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// const serviceRow = '<tr><td data-label="{1}" class="table-th-50">{1}<div class="small text-guide">{2}</div></td><td data-label="caricamento dati"><div class="clearfix">' +
//     '<div class="float-left"><strong></strong></div><div class="float-right"><small class="text-guide">quantità di metadati caricati</small></div></div>' +
//     '<div class="progress progress-xs"> <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>' +
//     '</div></td><td data-label="Qualità"><p class="sr-only">Indice di qualità: 5 su 5</p><i class="fa fa-star fa-star-agidrate" aria-disabled="true"></i></td><td data-label="azioni" class="text-center">' +
//     '<div class="row"><div class="col-4"> <a href="/servizi/service-wizard-complete2/?serviceId={0}" title="modifica"><i class="icon-note icons font-2xl d-block"></i> </a></div><div class="col-4"><a id="rimuovi{0}" href="/service/remove?serviceId={0}" title="cancella">' +
//     '<i class="icon-close icons font-2xl d-block"></i></a></div> <div class="col-4"> <label title="Pubblica servizio" class="switch switch-3d switch-success"><input type="checkbox" class="switch-input" checked value="">' +
//     '<span class="switch-label"></span><span class="switch-handle"></span><span class="sr-only">Pubblica servizio</span></label></div></div></td></tr>'


// const applicationRow = '<tr><td data-label="{1}" class="table-th-50">{1}' +
//     '<div class="small text-guide">{2}</div></td>' +
//     '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a onclick="loadPageApplication(\'{1}\',\'{0}\');" href="/accesscontrol/users" title="utenti"><i class="icon-user-follow icons font-2xl d-block"></i></a></div></div></td>' +
//     '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a href="#" onClick="editService(\'{0}\')" {4} title="modifica"><i class="icon-note icons font-2xl d-block"></i></a></div>' +
//     '<div class="col-5"><a href="/service/?serviceDelete={0}" {4} title="cancella"><i class="icon-trash icons font-2xl d-block"></i></a></div></div></td></tr>'

const applicationRow = '<tr><td data-label="{1}" class="table-th-50">{1}' +
    '<div class="small text-guide">{2}</div></td>' +
    '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a onclick="loadPageApplication(\'{1}\',\'{0}\');" href="/accesscontrol/users" title="utenti"><i class="fa fa-user-plus icons font-2xl d-block"></i></a></div></div></td>' +
    '<td data-label="azioni" class="text-center"><div class="row"><div class="col-5"><a href="#" onClick="editService(\'{0}\')" {4} title="modifica"><i class="fa fa-edit icons font-2xl d-block"></i></a></div>' +
    '</div></td></tr>'


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
            nomeAttributo: "required",
            descrizioneAttributo: "required"
        },
        messages: {
            nomeApplicazione: "Campo obbligatorio",
            urlApplicazione: "Campo obbligatorio",
            descrizioneApplicazione: "Campo obbligatorio",
            nomeAttributo: "Campo obbligatorio",
            descrizioneAttributo: "Campo obbligatorio"
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
            nomeAttributoEdit: "required",
            descrizioneAttributoEdit: "required"
        },
        messages: {
            nomeApplicazioneEdit: "Campo obbligatorio",
            urlApplicazioneEdit: "Campo obbligatorio",
            descrizioneApplicazioneEdit: "Campo obbligatorio",
            nomeAttributoEdit: "Campo obbligatorio",
            descrizioneAttributoEdit: "Campo obbligatorio"
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

    var name = "sgiabaccontroller"
    var collection = "applications"
    var query = ""
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        renderApplication(data)
    } else {

    }

}

function renderApplication(data) {
    $("#applicationBody").empty()
    var isHidden;
    $.each(data, function (index, element) {
        isHidden = $("#isSuperAdmin").val() == "true" ? "" : "hidden";
        var applicationHtmlFormatted = String.format(applicationRow,
            element.id,
            element.nome,
            element.description,
            "100%",
            isHidden)
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
        '<i class="fa fa-times-circle icons font-2xl d-block"></i></a> </td></tr>'

    $("#bodyTableCreateApplication").prepend(html);
    $("#nomeAttributo").val("")
    $("#descrizioneAttributo").val("")
    $("#addAttributeCollapse").collapse("hide")


}

function popolateTableRoleInModalEdit() {
    if ($("#nomeAttributoEdit").val() != "" && $("#nomeAttributoEdit").val() != undefined) {
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
            '<a href="#" class="ml-15" onClick="deleteRow(' + newId + ')" title="cancella">' +
            '<i class="fa fa-times-circle icons font-2xl d-block"></i></a> </td></tr>'

        $("#bodyTableCreateApplicationEdit").prepend(html);
        $("#nomeAttributoEdit").val("");
        $("#descrizioneAttributoEdit").val("");
        $("#addAttributeCollapseEdit").collapse("hide");
    }
}

function deleteRow(row) {
    var message = "Rimozione utente";
    var description = "Sei sicuro di voler rimuovere definitivamente l'attibuto?";
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
                $("#bodyTableCreateApplicationEdit tr#" + row).remove();
                updateApplication();
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

function getFieldsToCreateApplication() {
    if ($("#saveApplicationForm").valid()) {
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
            var roleName = $("#roleName_" + a).html().replace(/\s\s+/g, ' ');
            var roleDesc = $("#roleDescription_" + a).html().replace(/\s\s+/g, ' ');
            var attribute = '{"name":"' + roleName + '", "description":"' + roleDesc + '"}';
            var test = JSON.parse(attribute)
            objApplication.attributes.push(JSON.parse(attribute))
        }
        obj.codiceFiscaleAdmin = sessionStorage.getItem("userId")
        insertInDatabase(objApplication)
    }

}

function insertInDatabase(obj) {
    obj = JSON.stringify(obj);
    obj = JSON.parse(obj)

    var objToString = JSON.stringify(obj)
    objToString = 'appObj=' + objToString

    //createApplication
    var name = "sgiabaccontroller"
    var collection = "applications/createApplication"
    var query = ""
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("POST", url, objToString);
    if (objData.success) {
        var data = objData.data
        console.log(data)
        self.location.assign(location)
    } else {

    }
}

function editService(service) {
    if (!isLoadedAttributes) {
        var objService = getApplication(service)
        // console.log(objService)
        popolateModalEdit(objService);
        isLoadedAttributes = true
    }
    $(".modalEditApplication").modal("show")
}

function getApplication(id) {
    var obj;

    var name = "sgiabaccontroller"
    var collection = "applications/" + id;
    var query = ""
    var environment = ""
    //TODO
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        obj = data
    } else {}
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

    $.each(attr, function (index, value) {
        if (value.name != 'admin' && value.name != 'superAdmin') {
            lastId++;

            var html = '<tr id="' + lastId + '"><td class="text-center" id="roleNameEdit_' + lastId + '">' + value.name + '</td>' +
                '<td class="text-center" id="roleDescriptionEdit_' + lastId + '">' + value.description + '</td>' +
                '<td class="inline text-center">' +
                '<a href="#" title="modifica" class="m-left-39 m-right-10">' +
                // '<i class="icon-note icons font-2xl d-block"></i></a>' +
                '<a href="#" class="ml-15" onClick="deleteRow(' + lastId + ')" title="cancella">' +
                '<i class="fa fa-times-circle icons font-2xl d-block"></i></a> </td></tr>'
            container.prepend(html);

        }

    })



}

// function removeAttributesLoad() {
//     var lastId = $("#bodyTableCreateApplicationEdit tr").attr("id");

// }

function updateApplication() {
    var obj = popolateObjToUpdate();
    console.log(obj)
    var objToString = JSON.stringify(obj)
    objToString = 'appToAdd=' + objToString

    var name = "sgiabaccontroller"
    var collection = "applications/updateApplication"
    var query = ""
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    //var url = "http://localhost:3500/api/applications/updateApplication"
    var objData = callService("POST", url, objToString);
    if (objData.success) {
        var data = objData.data;
        console.log(data);
        location.reload();
    } else {
        error("Errore durante il salvataggio della modifica")
        return;
    }
}

function popolateObjToUpdate() {
    var objApplication = {};
    objApplication.nome = $("#nomeApplicazioneEdit").val();
    objApplication.url = $("#urlApplicazioneEdit").val();
    objApplication.description = $("#descrizioneApplicazioneEdit").val();
    objApplication.id = $("#idApplication").val()
    objApplication.attributes = []
    //prendere tutti gli elementi della tabella
    var lengthTable = $("#bodyTableCreateApplicationEdit tr").attr("id");
    lengthTable++
    for (var a = 0; a < lengthTable; a++) {
        var roleName = $("#roleNameEdit_" + a).html().replace(/\s\s+/g, ' ');
        var roleDesc = $("#roleDescriptionEdit_" + a).html().replace(/\s\s+/g, ' ');
        var attribute = '{"name":"' + roleName + '", "description":"' + roleDesc + '"}';
        objApplication.attributes.push(JSON.parse(attribute))
    }
    objApplication.codiceFiscaleAdmin = sessionStorage.getItem("userId");
    return objApplication

}