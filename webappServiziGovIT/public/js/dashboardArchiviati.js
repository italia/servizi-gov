const serviceRowArchiviati =
    '<tr><td data-label="Nome servizio" class="table-th-50">{1}<div class="small text-guide">{2}</div></td><td data-label="Stato" class="table-th-50"><span id="text_{0}">{5}</span></td>' +
    '<div class="float-left"><strong></strong></div><td data-label="azioni" class="text-center">' +
    '<div class="row"><div class="col-4"> <a href="#" onclick="viewArchivedService(\'{0}\')" title="Visualizza"><i class="fa fa-list-alt icons font-2xl d-block"></i> </a></div><div class="col-4"><a id="resume{0}" href="#" onclick="resumeService(\'{0}\', \'{6}\')" title="Ripristina">' +
    '<i class="fa fa-repeat icons font-2xl d-block"></i></a></div> <div class="col-4"> <div class="col-4"> <a style="color:red" href="#"{4} id="{0}" value="" onClick="editStatusArchiviati(\'{0}\' , this, event)" title="Elimina definitivamente"><i class="fa fa-times-circle icons font-2xl d-block"></i> </a>' +
    '</div></td></tr>';
var currentPosArchiviati = 0;
var totalArchiviati;
let perPagedArchiviati = 3;

$(document).ready(function () {
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
    $("#paNameArchiviati").text(descr);

    $("#profile-tab").click(function () {
        paginationDashboardArchiviati();

    })



    $("#btnSearchArc").click(function (e) {
        searchArchiviati($("#searchArchiviati").val(), sessionStorage.getItem('cpa'));
    });
    $("#searchArchiviati").keyup(function (event) {
        if (event.keyCode === 13) {
            searchArchiviati($(this).val(), sessionStorage.getItem('cpa'));
        }
    });

});

function injectServicesArchiviati(orgCode) {
    let perm = [{
        publicationStatus: {
            type: "R"
        }
    }, {
        publicationStatus: {
            type: "p"
        }
    }]
    if (orgCode) {
        // var url =
        //     "https://sgiservice.xxxx/api/public-services?filter=" +
        //     String.format('{"where":{"codiceIpa":"{0}"},"or":{1}}', orgCode, JSON.stringify(perm), perPagedArchiviati, currentPosArchiviati);

        // var url =
        // 'https://sgiservice.xxxx/api/deletedServices?filter={"where":{"codiceIpa":"'+sessionStorage.getItem("cpa")+'"}}';
        var name = "sgiservice"
        var collection = "deletedServices"
        var query = '?filter={"where":{"codiceIpa":"' + sessionStorage.getItem("cpa") + '"}}';
        var environment = ""
        var url = urlComposer(name, collection, query, environment);
        var objData = callService("GET", url);
        if (objData.success) {
            var data = objData.data
            $("#serviceCountArchiviati").text(data.length);
            renderServicesArchiviati(data);
        } else {
            appInsights.trackEvent(new ErrorEvent("errore durante la chiamata a deletedservice", {}))
        }
    }
}



function renderServicesArchiviati(data) {
    $("#serviceBodyArchiviati").empty();
    //REFACTORING: array.forEach non funziona su IE11 e Safari, anche se sarebbe migliore in termini di performance.
    $.each(data, function (index, element) {
        var serviceStatus = element.publicationStatus.type == "C" ? "checked" : "";
        var serviceStatusText = element.publicationStatus.type == "A" ? "Archiviato" : "Cancellato";
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
        if (serviceStatus != "C") {
            var serviceHtmlFormatted = String.format(
                serviceRowArchiviati,
                element.id,
                name,
                alternativeName,
                metadataPercentage + "%",
                serviceStatus,
                serviceStatusText,
                element.publicationStatus.type
            );
            $("#serviceBodyArchiviati").prepend(serviceHtmlFormatted);
        }
    })
}

function editStatusArchiviati(id, self, event) {
    event.preventDefault()
    var codIpa = sessionStorage.getItem("cpa");
    var usrId = sessionStorage.getItem("userId");
    var isSuperAdmin = checkAdminIsUser(sessionStorage.getItem("userId"))
    var pubStatus;
    var checked;
    let status = "";

    let swalText = "Il serivizio sarà eliminato definitivamente"
    swal({
            title: "Eliminazione del servizio",
            text: swalText,
            icon: "warning",
            dangerMode: true,
            buttons: ["Annulla", "Conferma"]
        })
        .then((willChangeStatus) => {
            if (willChangeStatus) {
                if (isSuperAdmin) {
                    if ($("#" + id).is(":checked")) {
                        pubStatus = "C";
                        $("#text_" + id).html("Cancellato")
                    } else {
                        pubStatus = "A";
                        $("#text_" + id).html("Archiviato")
                    }
                    changeEventResume(id, pubStatus);
                    swal("Modifica effettuata", {
                        icon: "success",
                    });
                } else {
                    pubStatus = "C";
                    $(self).parent().parent().parent().parent().parent().remove()
                }

            } else {
                swal("Operazione annullata");
            }
        });
    // var pubStatusObj =
    //     'pubStatusObj={"serviceId":"' +
    //     id +
    //     '", "pubStatus":"' +
    //     pubStatus +
    //     '", "userId": "' +
    //     usrId +
    //     '", "codiceIpa":"' +
    //     codIpa +
    //     '"}';
    // console.log(pubStatusObj)

    // $.ajax({
    //     type: "POST",
    //     data: pubStatusObj,
    //     processData: false,
    //     async: false,
    //     url: "https://sgiservice.xxxx/api/public-services/updatePubStatus/",
    //     //url: "http://localhost:3500/api/public-services/updatePubStatus/",
    // }).done(function (res) {
    //     alert("Stato SERVIZIO AGG");
    //     // injectServices(codiceIpa);
    // });
}

function changeEventResume(id, pubStatus) {
    var resumeButton = $("#" + id).parent().parent().prev();
    var html = '<a id="rimuovi' + id + '" href="#" onclick="resumeService(\'' + id + '\',\'' + pubStatus.toUpperCase() + '\')" title="Resume"><i class="icon-reload icons font-2xl d-block"></i></a>';
    resumeButton.empty();
    resumeButton.append(html);
}


function resumeService(serviceId, pubStatus) {
    var codiceIpa = sessionStorage.getItem("cpa");
    var userId = sessionStorage.getItem("userId");
    var objToPost = createObj(codiceIpa, userId, serviceId, pubStatus);
    let swalText = "Il servizio sarà inserito nella sezione dei servizi attivi in modalità non visibile agli utenti"
    swal({
            title: "Ripristina il servizio",
            text: swalText,
            icon: "warning",
            dangerMode: true,
            buttons: ["Annulla", "Conferma"]
        })
        .then((willChangeStatus) => {
            if (willChangeStatus) {
                callServiceToResume(objToPost, serviceId);
                swal("Servizio ripristinato", {
                    icon: "success",
                });
            } else {}
        });


}

function createObj(codiceIpa, userId, serviceId, pubStatus) {
    var obj =
        'resumeObj={"idService":"' +
        serviceId +
        '", "publicationStatus":"' +
        pubStatus +
        '", "userId": "' +
        userId +
        '", "ipaCode":"' +
        codiceIpa +
        '"}';
    return obj;
}

function callServiceToResume(obj, id) {
    var name = "sgiservice"
    var collection = "deletedServices/resumeServiceFromArchive"
    var query = ""
    var environment = ""

    var url = urlComposer(name, collection, query, environment);
    var objData = callService("POST", url, obj);
    if (objData.success) {
        swal("Modifica effettuata", {
            icon: "success",
        });
        removeToDashboard(id);
    } else {
        swal("Errore nel cambiamento di stato", {
            icon: "error",
        });
    }
}

function removeToDashboard(id) {
    var idToElement = "resume" + id
    var val = $("#serviceCount").val();
    val--;
    $("#serviceCount").val(val)
    $("#" + idToElement).parent().parent().parent().parent().remove()
}

function viewArchivedService(id) {
    sessionStorage.setItem("isArchived", true)
    window.location.href = "/servizi/service-wizard-complete-archived2/?serviceArchivedId=" + id

}


function paginationDashboardArchiviati() {
    var orgCode = sessionStorage.getItem('cpa');
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
    var collection = "deletedServices"
    var query = '?filter={"where":{"codiceIpa":"' + sessionStorage.getItem("cpa") + '"}';
    var environment = ""
    var queryToCountCardArchiviati = query + "}";
    var url = urlComposer(name, collection, queryToCountCardArchiviati, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        var totalCardArchiviati = data.length
        $("#serviceCountArchiviati").text(totalCardArchiviati);
        var pagecountCardArchiviati = Math.ceil((totalCardArchiviati / perPagedArchiviati));
        initPaginatorArchiviati(name, collection, query, environment, pagecountCardArchiviati);
    } else {}
}

function initPaginatorArchiviati(name, collection, query, environment, pagecountCardArchiviati) {
    $('#paginatorContainerArchiviati').twbsPagination('destroy');
    pagecountCardArchiviati = pagecountCardArchiviati == 0 ? 1 : pagecountCardArchiviati;
    $('#paginatorContainerArchiviati').twbsPagination({
        totalPages: pagecountCardArchiviati,
        visiblePages: 10,
        first: 'Inizio',
        prev: 'Indietro',
        next: 'Successivo',
        last: 'Fine',
        onPageClick: function (event, page) {

            currentPosArchiviati = perPagedArchiviati * (page - 1);
            var queryToGetCard = query + ',"limit":' + perPagedArchiviati + ',"skip":' + currentPosArchiviati + ', "order": "creation.date DESC"}';
            var environment = "";
            var absoluteUrl = urlComposer(name, collection, queryToGetCard, environment);
            var objData = callService('GET', absoluteUrl);
            var getData;
            if (objData.success) {
                getData = objData.data;
            } else {}
            if (getData.length > 0) {
                renderServicesArchiviati(getData)

            } else {
                $("#serviceBodyArchiviati").empty();
            }

        }
    });
}

function searchArchiviati(searchString, orgCode) {
    startWait("dashboardArchiviati", "Ricerca servizi archiviati in corso...")
    if (orgCode) {
        var name = "sgiservice"
        var collection = "deletedServices"
        var query = "?filter=" +
            String.format(
                '{"where":{"publicService.name.description":{"like":"{0}.*","options":"i"},"codiceIpa":{"like":"{1}.*","options":"i"}}',
                searchString,
                orgCode
            )
        var queryToCountArchiviati = query + "}";
        var environment = ""
        var url = urlComposer(name, collection, queryToCountArchiviati, environment);
        var objData = callService("GET", url);
        if (objData.success) {
            var totalCardArchiviati = objData.data.length
            var pagecountCard = Math.ceil(totalCardArchiviati / perPagedArchiviati);
            initPaginatorArchiviati(name, collection, query, environment, pagecountCard);
        } else {}
    }
    stopWait("dashboardArchiviati");

}