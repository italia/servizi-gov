String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != "undefined" ? args[number] : match;
    });
};
const serviceRow =
    '<tr><td data-label="{1}" class="table-th-50">{1}<div class="small text-guide">{2}</div></td><td data-label="caricamento dati"><div class="clearfix">' +
    '<div class="float-left"><strong></strong></div><div class="float-right"><small class="text-guide">quantità di metadati caricati</small></div></div>' +
    '<div class="progress progress-xs"> <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>' +
    '</div></td><td data-label="Qualità"><p class="sr-only">Indice di qualità: 5 su 5</p><i class="fa fa-star fa-star-agidrate" aria-disabled="true"></i></td><td data-label="azioni" class="text-center">' +
    '<div class="row"><div class="col-4"> <a href="/servizi/service-wizard-complete2/?serviceId={0}" title="modifica"><i class="icon-note icons font-2xl d-block"></i> </a></div><div class="col-4"><a id="rimuovi{0}" href="#" onclick="removeService(\'{0}\',this)" title="Rimuovi {1}">' +
    '<i class="icon-close icons font-2xl d-block"></i></a></div> <div class="col-4"> <label title="Pubblica servizio" class="switch switch-3d switch-success"><input type="checkbox" class="switch-input" {4} id="{0}" value="" onClick="editStatus(\'{0}\')">' +
    '<span class="switch-label"></span><span class="switch-handle"></span><span class="sr-only">Pubblica servizio</span></label></div></div></td></tr>';
const pagerHtmlD = '<ul class="pagination ml-3"><li class="page-item"><a class="page-link" id="btnprevD" href="#">prevD</a></li><li class="page-item"><a class="page-link" id="btnForw" href="#">Next</a></li></ul>'
const pagerOpenD = '<ul class="pagination ml-3" id="pagerOpenD">'
const pagerItemD = '<li class="page-item"><a class="page-link" href="#">{0}</a></li>'
const pagerCloseD = '</ul>'
const pagerprevD = '<li id="prevD" class="page-item"><a class="page-link" disabled href="#">Precedente</a></li>'
const pagerFwdD = '<li id="fwdD" class="page-item"><a class="page-link"  href="#">Successiva</a></li>'
const pagerPlaceHolderD = '<div class="row" id="pagerPlaceHolderD" style="margin-top: 10px;margin-left: 40%;"></div>'
var currentPos = 0;
var total;
let perPaged = 3;

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
    $("#paName").text(descr);
    injectServices(codiceIpa);
    $("#search").change(function (e) {
        search($("#search").val());
    });
    $(".page-item").click(function (e) {
        var url = String.format(document.location.href + "&page={0}", $(this).text());
    })
});


function injectServices(orgCode) {
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
        var url =
            "-/api/public-services?filter=" +
            String.format('{"where":{"codiceIpa":"{0}"},"or":{1}}', orgCode, JSON.stringify(perm), perPaged, currentPos);
        $.ajax({
            url: url,
            async: false,
            cache: false
        })
            .done(function (data) {
                $("#serviceCount").text(data.length);
                renderServices(data);
                // if (data.length > 2)
                //     renderDashboardPager(data.length)
            })
            .fail(function (err) {
                appInsights.trackEvent(err)
            });
    }
}
function goToPage(orgCode, pageNumber) {
    let perm = [{
        publicationStatus: {
            type: "R"
        }
    }, {
        publicationStatus: {
            type: "p"
        }
    }]
    if (orgCode && pageNumber) {
        let localPos = perPaged * pageNumber
        var url =
            "-/api/public-services?filter=" +
            String.format('{"where":{"codiceIpa":"{0}"},"or":{1}}', orgCode, JSON.stringify(perm));
        $.ajax({
            url: url,
            async: false,
            cache: false
        })
            .done(function (data) {
                $("#serviceCount").text(data.length);
                renderServices(data);
                // if (data.length > 2)
                //     renderDashboardPager(data.length)
            })
            .fail(function (err) {
                appInsights.trackEvent(err)
            });
    }
    else {

    }
}

function addPagerEventHandler() {
    $("#prevD").on('click', moveBack);
    $("#fwdD").on('click', moveForward)
}

function renderServices(data) {
    $("#serviceBody").empty();
    $.each(data, function(index, element){
        var serviceStatus = element.publicationStatus.type == "P" ? "checked" : "";
        var serviceHtmlFormatted = String.format(
            serviceRow,
            element.id,
            element.publicService.name.description,
            element.publicService.description.description,
            "100%",
            serviceStatus
        );
        $("#serviceBody").append(serviceHtmlFormatted);
    })
}

function search(searchString, orgCode) {
    if (orgCode) {
        var url =
            "-/api/public-services?filter=" +
            String.format(
                '{"where":{"publicService.name.description":{"like":"{0}.*","options":"i"}},{"codiceIpa":{"like":"{1}.*","options":"i"}}}',
                searchString,
                orgCode
            );
        $.ajax({
            url: url
        })
            .done(function (data) {
                renderServices(data);
            })
            .fail(function (e) {
                appInsights.trackEvent(e)
            });
    }
}

function removeService(id, self) {

    let deletionData = {
        idService: id,
        userId: sessionStorage.getItem("userId"),
        ipaCode: sessionStorage.getItem("cpa")
    };
    let deleteInputData = "deleteInputData=" + JSON.stringify(deletionData);
    if (confirm("Si vuole procedere alla rimozione del servizio selezionato?")) {
        $.ajax({
            url: "-/api/public-services/checkAndDeleteService/",
            //url: "http://localhost:3500/api/public-services/checkAndDeleteService/",
            async: false,
            cache: false,
            method: "POST",
            data: deleteInputData
        }).done(function (res) {
            alert("Servizio rimosso");
            $(self).parent().parent().parent().parent().remove();
           var numberService = $("#serviceBody").children().length;
            $("#serviceCount").html(numberService)
            

        });
    } else {
        alert("Rimozione annullata");
    }
}

function editStatus(id) {
    var codIpa = sessionStorage.getItem("cpa");
    var usrId = sessionStorage.getItem("userId");
    var pubStatus;
    if ($("#" + id).is(":checked")) {
        pubStatus = "P";
    } else pubStatus = "R";

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

    $.ajax({
        type: "POST",
        data: pubStatusObj,
        processData: false,
        // async: false,
        //url: "-/api/public-services/updatePubStatus/",
        url: "http://localhost:3500/api/public-services/updatePubStatus",
    }).done(function (res) {
        alert("Stato SERVIZIO AGG");
        // injectServices(codiceIpa);
    });
}

function renderDashboardPager(c) {
    let i = 0;
    let pagecount = Math.ceil((c / perPaged));
    $("#servContainerD").append(pagerPlaceHolderD);
    if (document.getElementById("pagerPlaceHolderD") && document.getElementById("pagerPlaceHolderD").hasChildNodes) {
        $("#pagerPlaceHolderD").empty()
    }
    var pager = $("#pagerPlaceHolderD")
    pager.append(pagerOpenD)
    $("#pagerOpenD").append(pagerprevD)
    do {
        ++i
        $("#pagerOpenD").append(String.format(pagerItemD, i))
    }
    while (i < pagecount)
    $("#pagerOpenD").append(pagerFwdD)

}
function moveBack() {
    if (!(currentPos < perPaged)) {
        currentPos -= perPaged;
        injectServices(orgCode)
    } else {
        $("#prevD").attr('disabled', "disabled")
        $("#prevD").removeAttr('href');
    }
}

function moveForward() {
    if (!(currentPos > perPaged)) {
        currentPos += perPaged;
        injectServices(orgCode)
    } else {
        $("#forw").attr('hidden', "hidden")
        $("#forw").removeAttr('href');
    }
}