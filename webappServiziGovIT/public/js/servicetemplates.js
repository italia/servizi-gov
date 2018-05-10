const templateHtml = '<div class="col-sm-4 col-md-4"><div class="card"><div class="card-header"><h2><a href="/servizi/service-wizard-complete2?templateId={0}">{2}</a></h2>' +
    '</div> <div class="card-block">{1}</div><div class="card-footer">' +
    '<a href="/servizi/service-wizard-complete2/?templateId={0}" title="{2}" id="templateButton" class="btn btn-primary float-right">Scegli questo modello</a></div></div></div>'
const templateHtmlFastForm = '<div class="col-sm-4 col-md-4"><div class="card"><div class="card-header"><h2><a href="/servizi/service-wizard2?templateId={0}">{2}</a></h2>' +
    '</div> <div class="card-block">{1}</div><div class="card-footer">' +
    '<a href="/servizi/service-wizard2/?templateId={0}" title="{2}" id="templateButton" class="btn btn-primary float-right">Scegli questo modello</a></div></div></div>'
const pagerPlaceHolder = '<div class="row" id="pagerPlaceHolder"></div>'
const notFoundHtml = '<div class="col-md-3"><p class=""> <em>Il servizio che stai cercando non è stato censito tra i modelli; puoi caricare un servizio ' +
    'senza un modello di riferimento, oppure prova a fare una nuova ricerca</em></p></div><div class="col-md-3"><span class="input-group-btn mt-4">' +
    '<a class="btn btn-primary" style="margin-top: 9px;" href="/servizi/service-wizard-complete2/" id="">Crea servizio senza modello di riferimento</a></span></div>'
// const serviceUri = "https://sgiservicetemplate.xxxx/api/service-templates/?filter[where][entePa]="
var currentPos = 0;
var total;
let perPage = 12;
$(document).ready(function () {
    total = getGlobalCount();
    $("#selectEnti").change(function (e) {
        currentPos = 0;
        if ($("#appendedInputButton").val()) {
            combineSearchFilters(
                $("#appendedInputButton").val(),
                $("#selectEnti").val()
            )
        } else {
            searchTemplatesByType($(this).val())
        }
    });

    $("#btnSearch").click(function (e) {
        currentPos = 0;
        if ($("#selectEnti").val() != "*") {
            combineSearchFilters(
                $("#appendedInputButton").val(),
                $("#selectEnti").val()
            )
        } else {
            searchTemplatesToText($("#appendedInputButton").val())
        }
    })
    $("#appendedInputButton").keyup(function (event) {
        if (event.keyCode === 13) {
            if ($("#selectEnti").val() != "*") {
                combineSearchFilters(
                    $("#appendedInputButton").val(),
                    $("#selectEnti").val()
                )
            } else {

                searchTemplatesToText($("#appendedInputButton").val())
            }
        }
    })
    $("#btnClear").click(function (e) {
        clearSearchFilters()
    })
    initCardTotalQuery(total)
});

function getGlobalCount() {
    let totalL;
    var name = "sgiservicetemplate"
    var collection = "service-templates/count"
    var query = ""
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        totalL = data.count;
    } else {}
    return totalL;
}

function fetchData() {
    var name = "sgiservicetemplate"
    var collection = "service-templates"
    var query = '?filter[limit]=' + perPage + '&filter[skip]=' + currentPos;
    var environment = ""
    startWait("mainContainer", "Caricamento template in corso...", function () {})
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        renderData(objData.data);
        stopWait("mainContainer")
    } else {
        stopWait('mainContainer')
        swal("Oops!", "Errore durante il caricamento dei template", "error")
    }
}

function renderData(p) {
    if (document.getElementById("cardContainer") && document.getElementById("cardContainer").hasChildNodes) {
        $("#cardContainer").empty()
    }
    var controlFastProcedure = sessionStorage.getItem("fastProcedure");
    if (controlFastProcedure === "true") {
        hideBreadcrumbFastProcedure();
        $.each(p, function (index, element) {
            var htmlFastForm = String.format(templateHtmlFastForm, element.id, element.publicService.description.description, element.name)
            $("#cardContainer").append(htmlFastForm);
        })
    } else {
        $.each(p, function (index, element) {
            var htmlFormatted = String.format(templateHtml, element.id, element.publicService.description.description, element.name)
            $("#cardContainer").append(htmlFormatted);
        })
    }
}

function hideBreadcrumbFastProcedure() {
    var serviceFor = sessionStorage.getItem("serviceFor");
    if (serviceFor != "EXT") {
        $("#breadcrumbSceltaModello").hide();
    }
}

function initCardTotalQuery(c) {
    let i = 0;
    let pagecount = Math.ceil((c / perPage));
    startWait("mainContainer", "Caricamento template in corso...", function () {})
    $('#paginatorContainer').twbsPagination({
        totalPages: pagecount,
        visiblePages: 10,
        first: 'Inizio',
        prev: 'Indietro',
        next: 'Successivo',
        last: 'Fine',
        onPageClick: function (event, page) {
            currentPos = 12 * (page - 1);
            fetchData();
        }
    });
    stopWait("mainContainer")
}

function searchTemplatesToText(searchString) {
    if (searchString != " ") {
        $('#paginatorContainer').twbsPagination('destroy');
        startWait("mainContainer", "Ricerca template in corso...", function () {})
        // startWait("mainContainer", "Ricerca template in corso...", function () {})
        // var relativeUrl = "https://sgiservicetemplate.xxxx/api/service-templates/" + String.format('?filter={"where":{"name":{"like":"{0}.*","options":"i"}},"limit":{1},"skip":{2}}', searchString, perPage, currentPos)
        var name = "sgiservicetemplate"
        var collection = "service-templates"
        // var query = String.format('?filter={"where":{"name":{"like":"{0}.*","options":"i"}},"limit":{1},"skip":{2}}', searchString, perPage, currentPos);
        var query = '?filter={"where":{"name":{"like":"' + searchString + '.*","options":"i"}}';
        var queryToCount = query + "}"
        var environment = "";
        var url = urlComposer(name, collection, queryToCount, environment);

        var objData = callService('GET', url);
        if (objData.success) {
            var totalCard;
            totalCard = objData.data.length;
        } else {

        }
        if (totalCard == 0) {
            //metto in corto e rimando il controllo al browser senza inizializzare la paginazione
            stopWait("mainContainer")
            renderTemplateNotFound();
            return;
        }
        var pagecountCard = Math.ceil((totalCard / perPage));
        $('#paginatorContainer').twbsPagination({
            totalPages: pagecountCard,
            visiblePages: 10,
            first: 'Inizio',
            prev: 'Indietro',
            next: 'Successivo',
            last: 'Fine',
            onPageClick: function (event, page) {
                currentPos = 12 * (page - 1);
                var queryToGetCard = query + ',"limit":' + perPage + ',"skip":' + currentPos + '}';
                var absoluteUrl = urlComposer(name, collection, queryToGetCard, environment);
                var objData = callService('GET', absoluteUrl);
                var getData;
                if (objData.success) {
                    getData = objData.data;
                } else {}


                if (getData.length > 0) {
                    renderData(getData);

                } else
                    renderTemplateNotFound()
            }
        });
        stopWait("mainContainer")
    }
}

function searchTemplatesByType(searchString) {
    if (searchString != "*") {
        // var relativeUrl = serviceUri + searchString;

        var name = "sgiservicetemplate"
        var collection = "service-templates"
        // var query = String.format('?filter={"where":{"name":{"like":"{0}.*","options":"i"}},"limit":{1},"skip":{2}}', searchString, perPage, currentPos);
        var query = '?filter={"where":{"name":{"like":"' + searchString + '.*","options":"i"}}';
        var queryToCount = query + "}"
        var environment = "";
        var url = urlComposer(name, collection, queryToCount, environment);
        var objData = callService('GET', url);
        if (objData.success) {
            var totalCard;
            totalCard = objData.data.length;
        } else {

        }

        $('#paginatorContainer').twbsPagination('destroy');
        var pagecountCard = Math.ceil((totalCard / perPage));
        $('#paginatorContainer').twbsPagination({
            totalPages: pagecountCard,
            visiblePages: 10,
            first: 'Inizio',
            prev: 'Indietro',
            next: 'Successivo',
            last: 'Fine',
            onPageClick: function (event, page) {
                currentPos = 12 * (page - 1);
                var name = "sgiservicetemplate"
                var collection = "service-templates"
                // var query = String.format('?filter={"where":{"name":{"like":"{0}.*","options":"i"}},"limit":{1},"skip":{2}}', searchString, perPage, currentPos);
                var query = '?filter={"where":{"name":{"like":"' + searchString + '.*","options":"i"}}';
                var queryToCount = query + "}"
                var environment = "";
                var url = urlComposer(name, collection, queryToCount, environment);
                var objData = callService('GET', url);
                if (objData.success) {
                    var getData;
                    getData = objData.data;
                } else {

                }
                var query = query+'&filter[limit]=' + perPage + '&filter[skip]=' + currentPos;
                var url = urlComposer(name, collection, query, environment);
                var objData = callService('GET', url);
                if (objData.success) {
                    var getData;
                    getData = objData.data;
                } else {
                }
                if (getData.length > 0)
                    renderData(getData);
                else renderTemplateNotFound()
            }
        });
    } else {
        fetchData()
    }
}


function combineSearchFilters(searchString, selectString) {
    $('#paginatorContainer').twbsPagination('destroy');
    var name = "sgiservicetemplate"
    var collection = "service-templates"
    var query = '?filter={"where":{"name":{"like":"' + searchString + '.*","options":"i"},"entePa":{"like":"' + selectString + '.*","options":"i"}}';
    var queryToCount = query + "}";
    var environment = "";
    var url = urlComposer(name, collection, queryToCount, environment);

    var objData = callService('GET', url);
    if (objData.success) {
        var totalCard;
        totalCard = objData.data.length;
    } else {

    }

    var pagecountCard = Math.ceil((totalCard / perPage));
    startWait("mainContainer", "Ricerca template in corso...", function () {})
    $('#paginatorContainer').twbsPagination({
        totalPages: pagecountCard,
        visiblePages: 10,
        first: 'Inizio',
        prev: 'Indietro',
        next: 'Successivo',
        last: 'Fine',
        onPageClick: function (event, page) {
            currentPos = 12 * (page - 1);
            var queryToGetCard = query + ',"limit":' + perPage + ',"skip":' + currentPos + '}';
            var absoluteUrl = urlComposer(name, collection, queryToGetCard, environment);
            var objData = callService('GET', absoluteUrl);
            var getData;
            if (objData.success) {
                getData = objData.data;
            } else {}
            if (getData.length > 0) {
                renderData(getData);

            } else renderTemplateNotFound()
        }
    });
    stopWait("mainContainer")
}

function clearSearchFilters() {
    currentPos = 0
    total = getGlobalCount();
    $('#paginatorContainer').twbsPagination('destroy');
    initCardTotalQuery(total)
    $('#selectEnti').val('*')
    $("#appendedInputButton").val("")
    document.getElementById("appendedInputButton").dispatchEvent(new Event("change"))
}

function renderTemplateNotFound() {
    $('#paginatorContainer').twbsPagination('destroy');
    $("#cardContainer").empty()
    $("#cardContainer").append(notFoundHtml)
    $("#pagerPlaceHolder").attr("hidden", "hidden")
}