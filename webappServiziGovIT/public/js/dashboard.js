const serviceRow =
    '<tr><td data-label="Nome servizio" class="table-th-50"><a href="/servizi/service-wizard-complete2/?serviceId={0}" title="modifica">{1}</a><div class="small text-guide">{2}</div></td><td data-label="Lingua"><a href="#" onclick="editLanguageService(\'{0}\')" class="" title="Aggiungi lingua"><i class="fa fa-language font-2xl d-block"></i></a></td><td data-label="Quantità"><div class="clearfix">' +
    '<div class="float-left"><strong></strong></div><div class="float-right"><small class="text-guide">Quantità di metadati caricati: {3}</small></div></div>' +
    '<div class="progress progress-xs"> <div class="progress-bar bg-success" role="progressbar" style="width: {3}" aria-valuenow="{3}" aria-valuemin="0" aria-valuemax="100"></div>' +
    '</div></td><td data-label="azioni" class="text-center">' +
    '<div class="row"><div class="col-4"><a href="/servizi/service-wizard-complete2/?serviceId={0}" title="modifica"><i class="fa fa-edit font-2xl d-block"></i></a></div><div class="col-4"><a id="rimuovi{0}" href="#" onclick="removeService(\'{0}\',this)" title="Archivia">' +
    '<i class="fa fa-folder icons font-2xl d-block"></i></a></div> <div class="col-4"> <label title="Pubblica servizio" class="switch switch-3d switch-success"><input type="checkbox" class="switch-input" {4} id="{0}" value="" onClick="editStatus(\'{0}\',event)">' +
    '<span class="switch-label"></span><span class="switch-handle"></span><span class="sr-only">Pubblica servizio</span></label></div></div></td></tr>';
const ActiveServiceDeletionMessage = "Il serivio sarà nascosto agli utenti e spostato nella sezione servizi archiviati ";
const ServiceDeletionMessage = "Si vuole procedere con l'archiviazione?\nSe il servizio non è mai stato pubblicato verrà invece eliminato."
const serviceDeletionWindowTitle = "Archiviazione del servizio"
var currentPos;
var total;
let perPaged = 3;


$(document).ready(function () {
    sessionStorage.removeItem("serviceArchivedId");
    sessionStorage.removeItem("isArchived");
    var codiceIpa;
    var descr;
    if (getQueryStringParam("cpa") && getQueryStringParam("description")) {
        codiceIpa = getQueryStringParam("cpa");
        sessionStorage.setItem("cpa", codiceIpa);
        descr = getQueryStringParam("description");
        sessionStorage.setItem("description", descr);
    } else {
        codiceIpa = sessionStorage.getItem("cpa");
        descr = sessionStorage.getItem("description");
    }
    if (!(codiceIpa || descr)) {
        error("Nessun codice IPA specificato, selezionarne uno dalla pagina Index")
        setTimeout(function () {
            window.location.href = "/index"
        }, 2000)
    }
    $("#paName").text(descr);
    $("#home-tab").click(function () {
        paginationDashboard()
    })
    // injectServices(codiceIpa);

    $("#btnSearch").click(function (e) {
        search($("#search").val(), sessionStorage.getItem('cpa'));
    });
    $("#search").keyup(function (event) {
        if (event.keyCode === 13) {
            search($(this).val(), sessionStorage.getItem('cpa'));
        }
    });

    $("#btnSaveLanguage").click(function (e) {
        saveServiceLanguage();
    })
    $("#languageSelect").change(function (e) {
        var self = $(this);
        popolateFieldsLanguage(self);
    })
    paginationDashboard();
});


function renderServices(data) {
    $("#serviceBody").empty();
    $.each(data, function (index, element) {
        var alternativeName = ""
        var serviceStatus = element.publicationStatus.type == "P" ? "checked" : "";
        $.each(element.publicService.alternativeName, function (index, value) {
            if (value.language == "it") {
                alternativeName = value.description != undefined ||
                    value.description != "" || value != undefined ?
                    value.description : ""
            }
        })
        var metadataPercentage = (element.metadataPercentage != null) ? element.metadataPercentage : 0;
        var name
        $.each(element.publicService.name, function (index, value) {
            if (value.language == "it")
                name = value.description;
        })
        var serviceHtmlFormatted = String.format(
            serviceRow,
            element.id,
            name,
            alternativeName,
            metadataPercentage + "%",
            serviceStatus
        );
        $("#serviceBody").prepend(serviceHtmlFormatted);
    })
}

function removeService(id, self) {
    let deletionData = {
        idService: id,
        userId: sessionStorage.getItem("userId"),
        ipaCode: sessionStorage.getItem("cpa")
    };
    let deleteInputData = "deleteInputData=" + JSON.stringify(deletionData);
    let swalText = (document.getElementById(id).checked) ? ActiveServiceDeletionMessage : ServiceDeletionMessage;
    swal({
            title: serviceDeletionWindowTitle,
            text: swalText,
            icon: "warning",
            buttons: true,
            dangerMode: true,
            buttons: ["Annulla", "Conferma"]
        })
        .then((willDelete) => {
            if (willDelete) {
                var name = "sgiservice"
                var collection = "public-services/checkAndDeleteService"
                var query = ""
                var environment
                var url = urlComposer(name, collection, query, environment);
                var objData = callService("POST", url, deleteInputData);
                if (objData.success) {

                    swal("Archiviazione eseguita! \n Puoi ritrovare il servizio tra i servizi archiviati", {
                        icon: "success",
                    });
                    $(self).parent().parent().parent().parent().remove();
                    var numberService = $("#serviceBody").children().length;
                    $("#serviceCount").html(numberService)
                } else {
                    swal("Operazione annullata");

                }
                //         $.ajax({
                //             url: "https://sgiservice.xxxx/api/public-services/checkAndDeleteService/",
                //             //url: "http://localhost:3500/api/public-services/checkAndDeleteService/",
                //             async: false,
                //             cache: false,
                //             headers: {
                //                 "Authorization": "Basic " + btoa("nomeutente:-")
                //             },
                //             method: "POST",
                //             data: deleteInputData
                //         }).done(function (res) {
                //         });
                //     } else {
                //     }
            }
        });
}

function editStatus(id, ev) {
    ev.stopPropagation()
    ev.preventDefault()
    var codIpa = sessionStorage.getItem("cpa");
    var usrId = sessionStorage.getItem("userId");
    var pubStatus;
    var checked;
    let status = "";
    var titleSwalText;
    var swalText;
    if ($("#" + id).is(":checked")) {
        checked = true;
        status = "Pubblicato"
        pubStatus = "P";
        titleSwalText = "Pubblica il servizio"
        swalText = "Rendi il servizio visibile agli utenti"
    } else {
        checked = false;
        pubStatus = "R";
        status = "Registrato"
        titleSwalText = "Nascondi il servizio"
        swalText = "Rendi il servizio non visibile agli utenti"
    };

    var pubStatusObj =
        'pubStatusObj={"serviceId":"' +
        id +
        '", "pubStatus":"' +
        pubStatus +
        '", "userId": "' +
        usrId +
        '", "codiceIpa":"' +
        codIpa +
        '"}';
    console.log(pubStatusObj)
    // var swalText = String.format("Si vuole procedere rendere il servi del servizio in stato {0}?", status)
    swal({
            title: titleSwalText,
            text: swalText,
            icon: "warning",
            dangerMode: true,
            buttons: ["Annulla", "Conferma"]
        })
        .then((willChangeStatus) => {
            if (willChangeStatus) {
                var name = "sgiservice"
                var collection = "public-services/updatePubStatus/"
                var query = ""
                var environment = ""
                var url = urlComposer(name, collection, query, environment);
                var objData = callService("POST", url, pubStatusObj);
                if (objData.success) {
                    swal("Modifica effettuata", {
                        icon: "success",
                    });
                    $("#" + id).prop('checked', checked)
                    var data = objData.data
                } else {

                }
            } else {
                swal("Operazione annullata");
            }
        });
}



function editLanguageService(id) {
    $("#idServiceLanguage").val(id)
    var service = getService(id);
    popolateSelectLanguage();
    $("#modalLanguage").modal("show");
}

function popolateSelectLanguage() {
    var name = "sgistandardtipo";
    var collection = "lingueservs";
    var query = '?filter={"where":{"language":"it"}}';
    var environment = "";
    var url = urlComposer(name, collection, query, environment);
    var verb = "GET";
    var obj = callService(verb, url);
    if (obj.success) {
        var container = $("#languageSelect");
        $.each(obj.data, function (index, value) {
            if (value.identifier.toLowerCase() != "it") {
                var html = '<option sigla="' + value.identifier + '">' + value.description + '</option>'
                container.append(html)
            }
        })
    } else {
        return "Error";
    }
}

function saveServiceLanguage() {
    var idService = $("#idServiceLanguage").val();
    var language = $("#languageSelect").children(":selected").attr("sigla");
    var nameService = $("#nameServiceLanguage").val();
    var alternativeNameService = $("#alternativenameServiceLanguage").val();
    var descriptionService = $("#descriptionServiceLanguage").val();
    var codiceIpaService = sessionStorage.getItem("cpa")
    var obj = {};
    obj.codiceIpa = codiceIpaService
    obj.user = sessionStorage.getItem("userId");
    obj.idService = idService;
    obj.language = language;
    if (descriptionService != "" && descriptionService != undefined) {
        obj.description = {};
        obj.description.language = language;
        obj.description.description = descriptionService;
    }
    if (alternativeNameService != "" && alternativeNameService != undefined) {
        obj.alternativeName = {};
        obj.alternativeName.description = alternativeNameService;
        obj.alternativeName.language = language;
    }
    if (nameService != "" && nameService != undefined) {
        obj.name = {};
        obj.name.description = nameService;
        obj.name.language = language;
    }
    var obj = 'languageObj=' + JSON.stringify(obj);
    insertIntoDb(obj);

}

function popolateFieldsLanguage(self) {
    var language = self.children(":selected").attr("sigla").toLowerCase();
    var id = $("#idServiceLanguage").val();

    var obj = getService(id);
    if (obj.success) {
        var service = obj.data;
        popolateFieldsInModal(service, language);
    } else {
        return "Error";
    }
}

function popolateFieldsInModal(service, language) {
    var nameElm = $("#nameServiceLanguage");
    var alternativeNameElm = $("#alternativenameServiceLanguage");
    var descriptionElm = $("#descriptionServiceLanguage");
    hideNameField(service, nameElm);
    var pb = service.publicService;
    $.each(pb.alternativeName, function (index, value) {
        if (value.language && value.language.toLowerCase() == language) {
            alternativeNameElm.val(value.description);
            return false;
        } else
            alternativeNameElm.val("");

    })
    $.each(pb.description, function (index, value) {
        if (value.language && value.language.toLowerCase() == language) {
            descriptionElm.val(value.description);
            return false;
        } else
            descriptionElm.val("");

    })
    $.each(pb.name, function (index, value) {
        if (value.language && value.language.toLowerCase() == language) {
            nameElm.val(value.description);
            return false;
        } else
            nameElm.val("");

    })
}

function hideNameField(service, nameElm) {
    if (service.publicService.template.name != "NO-TEMPLATE SERVICE")
        nameElm.parent().parent().hide();
    else
        nameElm.parent().parent().show();

}

function insertIntoDb(service) {
    var name = "sgiservice";
    var collection = "public-services/updateLanguageFields";
    var query = '';
    var environment = "";
    var url = urlComposer(name, collection, query, environment);
    //var url = "http://localhost:3500/api/" + collection;
    var verb = "POST";

    var obj = callService(verb, url, service);
    if (obj.success) {

        var message = "Lingua aggiunta con successo"
        success(message)
        setTimeout(function () {
            location.reload();
        }, 2000)
    } else {
        return "Error";
    }
}

function paginationDashboard() {
    var orgCode = sessionStorage.getItem('cpa');
    $('#paginatorContainer').twbsPagination('destroy');
    startWait("mainContainer", "Ricerca servizi in corso...", function () {})
    let perm = [{
        publicationStatus: {
            type: "R"
        }
    }, {
        publicationStatus: {
            type: "p"
        }
    }]
    var name = "sgiservice"
    var collection = "public-services"
    var query = '?filter=' +
        String.format('{"where":{"codiceIpa":"{0}"},"or":{1}', orgCode, JSON.stringify(perm))
    var queryToCount = query + '}'
    var environment = "";
    var url = urlComposer(name, collection, queryToCount, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var totalCard = objData.data.length
        $("#serviceCount").text(totalCard)
        var pagecountCard = Math.ceil((totalCard / perPaged));
        initPaginator(name, collection, query, environment, pagecountCard);
    } else {}

    stopWait("mainContainer")

}

function initPaginator(name, collection, query, environment, pagecountCard) {
    $('#paginatorContainer').twbsPagination('destroy');
    pagecountCard = pagecountCard == 0 ? 1 : pagecountCard;
    $('#paginatorContainer').twbsPagination({
        totalPages: pagecountCard,
        visiblePages: 10,
        first: 'Inizio',
        prev: 'Indietro',
        next: 'Successivo',
        last: 'Fine',
        onPageClick: function (event, page) {

            currentPos = perPaged * (page - 1);
            var queryToGetCard = query + ',"limit":' + perPaged + ',"skip":' + currentPos + ', "order": "creation.date DESC"}';
            var environment = "";
            var absoluteUrl = urlComposer(name, collection, queryToGetCard, environment);
            var objData = callService('GET', absoluteUrl);
            var getData;
            if (objData.success) {
                getData = objData.data;
            } else {}
            if (getData.length > 0) {
                renderServices(getData)

            } else {}

        }
    });
}
function search(searchString, orgCode) {
    if (orgCode) {
        var name = "sgiservice"
        var collection = "public-services"
        var query = "?filter=" +
            String.format(
                '{"where":{"publicService.name.description":{"like":"{0}.*","options":"i"},"codiceIpa":{"like":"{1}.*","options":"i"}}',
                searchString,
                orgCode
            );
        var queryToCount = query + "}"
        var environment = ""
        var url = urlComposer(name, collection, queryToCount, environment);
        var objData = callService("GET", url);
        if (objData.success) {
            var totalCard = objData.data.length
            var pagecountCard = Math.ceil((totalCard / perPaged));
            initPaginator(name, collection, query, environment, pagecountCard);
        } else {
            $("#serviceBody").empty();
        }
    }
}