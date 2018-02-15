
const serviceRowArchiviati =
    '<tr><td data-label="{1}" class="table-th-50">{1}<div class="small text-guide">{2}</div></td><td data-label="{1}" class="table-th-50"><span id="text_{0}">{5}</span></td>' +
    '<div class="float-left"><strong></strong></div><td data-label="azioni" class="text-center">' +
    '<div class="row"><div class="col-4"> <a disabled href="/servizi/service-wizard-complete2/?serviceId={0}" title="Visualizza"><i class="icon-paper-clip icons font-2xl d-block"></i> </a></div><div class="col-4"><a id="rimuovi{0}" href="#" onclick="removeService(\'{0}\')" title="Rimuovi {1}">' +
    '<i class="icon-reload icons font-2xl d-block"></i></a></div> <div class="col-4"> <label title="Pubblica servizio" class="switch switch-3d switch-success"><input type="checkbox" class="switch-input" {4} id="{0}" value="" onClick="editStatusArchiviati(\'{0}\')">' +
    '<span class="switch-label"></span><span class="switch-handle"></span><span class="sr-only">Pubblica servizio</span></label></div></div></td></tr>';
const pagerHtmlDArchiviati = '<ul class="pagination ml-3"><li class="page-item"><a class="page-link" id="btnprevD" href="#">prevD</a></li><li class="page-item"><a class="page-link" id="btnForw" href="#">Next</a></li></ul>'
const pagerOpenDArchiviati = '<ul class="pagination ml-3" id="pagerOpenDArchiviati">'
const pagerItemDArchiviati = '<li class="page-item"><a class="page-link" href="#">{0}</a></li>'
const pagerCloseDArchiviati = '</ul>'
const pagerprevDArchiviati = '<li id="prevD" class="page-item"><a class="page-link" disabled href="#">Precedente</a></li>'
const pagerFwdDArchiviati = '<li id="fwdD" class="page-item"><a class="page-link"  href="#">Successiva</a></li>'
const pagerPlaceHolderDArchiviati = '<div class="row" id="pagerPlaceHolderDArchiviati" style="margin-top: 10px;margin-left: 40%;"></div>'
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
    injectServicesArchiviati(codiceIpa);
    $("#searchArchiviati").change(function (e) {
        search($("#searchArchiviati").val());
    });
    $(".page-item").click(function (e) {
        var url = String.format(document.location.href + "&page={0}", $(this).text());
    })

    // sessionStorage.setItem("readOnly",true);
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
        //     "-/api/public-services?filter=" +
        //     String.format('{"where":{"codiceIpa":"{0}"},"or":{1}}', orgCode, JSON.stringify(perm), perPagedArchiviati, currentPosArchiviati);

        var url =
            '-/api/deletedServices?filter={"where":{"codiceIpa":"'+sessionStorage.getItem("cpa")+'"}}';

        $.ajax({
            url: url,
            async: false,
            cache: false
        })
            .done(function (data) {
                $("#serviceCountArchiviati").text(data.length);
                renderServicesArchiviati(data);
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
        let localPos = perPagedArchiviati * pageNumber
        // var url =
        //     "-/api/public-services?filter=" +
        //     String.format('{"where":{"codiceIpa":"{0}"},"or":{1}}', orgCode, JSON.stringify(perm));
        var url =
        "-/api/deletedServices";

        $.ajax({
            url: url,
            async: false,
            cache: false
        })
            .done(function (data) {
                $("#serviceCountArchiviati").text(data.length);
                renderServicesArchiviati(data);
                // if (data.length > 2)
                //     renderDashboardPager(data.length)
            })
            .fail(function (err) {
                appInsights.trackEvent(err)
            });
    } else {

    }
}

function addPagerEventHandler() {
    $("#prevD").on('click', moveBack);
    $("#fwdD").on('click', moveForward)
}

function renderServicesArchiviati(data) {
    $("#serviceBodyArchiviati").empty();
    data.forEach(element => {
        var serviceStatus = element.publicationStatus.type == "C" ? "checked" : "";
        var serviceStatusText = element.publicationStatus.type == "A" ? "Archiviato" : "Cancellato";
        var serviceHtmlFormatted = String.format(
            serviceRowArchiviati,
            element.id,
            element.publicService.name.description,
            element.publicService.description.description,
            "100%",
            serviceStatus,
            serviceStatusText
        );
        $("#serviceBodyArchiviati").append(serviceHtmlFormatted);
    });
}

function search(searchString, orgCode) {
    if (orgCode) {
        // var url =
        //     "-/api/public-services?filter=" +
        //     String.format(
        //         '{"where":{"publicService.name.description":{"like":"{0}.*","options":"i"}},{"codiceIpa":{"like":"{1}.*","options":"i"}}}',
        //         searchString,
        //         orgCode
        //     );
          var url =
            "-/api/deletedServices"
        $.ajax({
            url: url
        })
            .done(function (data) {
                renderServicesArchiviati(data);
            })
            .fail(function (e) {
                appInsights.trackEvent(e)
            });
    }
}

function removeService(id) {
    let deletionData = {
        idService: id,
        userId: sessionStorage.getItem("userId"),
        ipaCode: sessionStorage.getItem("cpa")
    };
    let deleteInputData = "deleteInputData=" + JSON.stringify(deletionData);
    if (confirm("Si vuole procedere alla rimozione del servizio selezionato?")) {
        $.ajax({
            url: "-/api/public-services/checkAndDeleteService/",
            async: false,
            cache: false,
            method: "POST",
            data: deleteInputData
        }).done(function (res) {
            alert("Servizio rimosso");
            injectServicesArchiviati(codiceIpa);
        });
    } else {
        alert("Rimozione annullata");
    }
}

// function editStatus(id) {
//     var codIpa = sessionStorage.getItem("cpa");
//     var usrId = sessionStorage.getItem("userId");
//     var pubStatus;
//     if ($("#" + id).is(":checked")) {
//         pubStatus = "P";
//     } else pubStatus = "R";
//     var pubStatusObj =
//         'pubStatusObj={"serviceId":"' +
//         id +
//         '", "pubStatus":"' +
//         pubStatus +
//         '", "userId": "' +
//         usrId +
//         '", "codiceIpa":"' +
//         codIpa +
//         '"}';
//     console.log(pubStatusObj)

//     $.ajax({
//         type: "POST",
//         data: pubStatusObj,
//         processData: false,
//         async: false,
//         url: "-/api/public-services/updatePubStatus/",
//         //url: "http://localhost:3500/api/public-services/updatePubStatus/",
//     }).done(function (res) {
//         alert("Stato SERVIZIO AGG");
//         // injectServices(codiceIpa);
//     });
// }

function editStatusArchiviati(id) {
    var codIpa = sessionStorage.getItem("cpa");
    var usrId = sessionStorage.getItem("userId");
    var pubStatus;
    if ($("#" + id).is(":checked")) {
        pubStatus = "C";
        $("#text_" + id).html("Cancellato")
    } else {
        pubStatus = "A";
        $("#text_" + id).html("Archiviato")
       
    }





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
    //     url: "-/api/public-services/updatePubStatus/",
    //     //url: "http://localhost:3500/api/public-services/updatePubStatus/",
    // }).done(function (res) {
    //     alert("Stato SERVIZIO AGG");
    //     // injectServices(codiceIpa);
    // });
}


function renderDashboardPager(c) {
    let i = 0;
    let pagecount = Math.ceil((c / perPagedArchiviati));
    $("#servContainerD").append(pagerPlaceHolderDArchiviati);
    if (document.getElementById("pagerPlaceHolderDArchiviati") && document.getElementById("pagerPlaceHolderDArchiviati").hasChildNodes) {
        $("#pagerPlaceHolderDArchiviati").empty()
    }
    var pager = $("#pagerPlaceHolderDArchiviati")
    pager.append(pagerOpenDArchiviati)
    $("#pagerOpenDArchiviati").append(pagerprevDArchiviati)
    do {
        ++i
        $("#pagerOpenDArchiviati").append(String.format(pagerItemDArchiviati, i))
    }
    while (i < pagecount)
    $("#pagerOpenDArchiviati").append(pagerFwdDArchiviati)

}

function moveBack() {
    if (!(currentPosArchiviati < perPagedArchiviati)) {
        currentPosArchiviati -= perPagedArchiviati;
        injectServicesArchiviati(orgCode)
    } else {
        $("#prevD").attr('disabled', "disabled")
        $("#prevD").removeAttr('href');
    }
}

function moveForward() {
    if (!(currentPosArchiviati > perPagedArchiviati)) {
        currentPosArchiviati += perPagedArchiviati;
        injectServicesArchiviati(orgCode)
    } else {
        $("#forw").attr('hidden', "hidden")
        $("#forw").removeAttr('href');
    }
}