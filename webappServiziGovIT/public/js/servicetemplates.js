
const templateHtml = '<div class="col-sm-4 col-md-4"><div class="card"><div class="card-header"><h2><a href="/servizi/service-wizard-complete2?templateId={0}">{2}</a></h2>' +
    '</div> <div class="card-block">{1}</div><div class="card-footer">' +
    '<a href="/servizi/service-wizard-complete2/?templateId={0}" title="{2}" id="templateButton" class="btn btn-primary float-right">Scegli questo modello</a></div></div></div>'
const templateHtmlFastForm = '<div class="col-sm-6 col-md-6"><div class="card"><div class="card-header"><h2><a href="/servizi/service-wizard2?templateId={0}">{2}</a></h2>' +
    '</div> <div class="card-block">{1}</div><div class="card-footer">' +
    '<a href="/servizi/service-wizard2/?templateId={0}" title="{2}" id="templateButton" class="btn btn-primary float-right">Scegli questo modello</a></div></div></div>'
const pagerHtml = '<ul class="pagination ml-3"><li class="page-item"><a class="page-link" id="btnPrev" href="#">Prev</a></li><li class="page-item"><a class="page-link" id="btnForw" href="#">Next</a></li></ul>'
const pagerOpen = '<ul class="pagination ml-3" id="pagerOpen">'
const pagerItem = '<li class="page-item"><a class="page-link" href="#">{0}</a></li>'
const pagerClose = '</ul>'
const pagerPrevious = '<li id="prev" class="page-item"><a class="page-link" disabled href="#">Precedente</a></li>'
const pagerFwd = '<li id="fwd" class="page-item"><a class="page-link"  href="#">Successiva</a></li>'
const pagerPlaceHolder = '<div class="row" id="pagerPlaceHolder"></div>'
var pagerContainer = ''
const notFoundHtml = '<p class="mt-4"><em>Se il risultato della ricerca non ha prodotto i risultati aspettati, affina la ricerca, oppure crea un nuovo servizio non partendo dal modello.</em></p>' +
    '<button class="btn btn-primary" type="button">Nuovo servizio</button>'
const serviceUri = "-/api/service-templates?filter[where][entePa]="
var currentPos = 0;
var total;
let perPage = 12;
let pagerCount;
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
            searchTemplatesByType($("#selectEnti").val())
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
            searchTemplates($("#appendedInputButton").val())
        }
    })
    $("#btnClear").click(function (e) {
        clearSearchFilters()
    })
    //initial fetch
    fetchData()
    //$("#prev").removeAttr('href');

});

function getGlobalCount() {
    let totalL;
    $.ajax({
            url: "-/api/service-templates/count",
            datatype: "json",
            async: "false"
        })
        .done(function (res) {
            totalL = res.count;
        });
    return totalL;
}

function fetchData() {
    $.get('-/api/service-templates?filter[limit]=' + perPage + '&filter[skip]=' + currentPos,
        function (res) {
            renderData(res);
            // renderPagerWithNumbers(total)
        }, 'json').done(function () {
        //renderPagerWithNumbers(total)
        renderPager()
        addPagerEventHandler();
        if (currentPos > 0) $("#prev").removeAttr('href');
        if (currentPos + perPage < total) $("#forw").attr('disabled', "disabled")
    });

}


function renderData(p) {
    if (document.getElementById("cardContainer") && document.getElementById("cardContainer").hasChildNodes) {
        $("#cardContainer").empty()
    }
    var controlFastProcedure = sessionStorage.getItem("fastProcedure");

    if (controlFastProcedure === "true") {
        $.each(p, function(index, element){
            var htmlFastForm = String.format(templateHtmlFastForm, element.id, element.publicService.description.description, element.name)
            $("#cardContainer").append(htmlFastForm);
        })
    } else {
        $.each(p,function(index, element){
             var htmlFormatted = String.format(templateHtml, element.id, element.publicService.description.description, element.name)
            $("#cardContainer").append(htmlFormatted);
        })
    }
}

function renderPagerWithNumbers(c) {
    let i = 0;
    let pagecount = Math.ceil((c / perPage) + 1);
    $("#servContainer").append(pagerPlaceHolder);
    if (document.getElementById("pagerPlaceHolder") && document.getElementById("pagerPlaceHolder").hasChildNodes) {
        $("#pagerPlaceHolder").empty()
    }
    var pager = $("#pagerPlaceHolder")

    pager.append(pagerOpen)
    $("#pagerOpen").append(pagerPrevious)
    do {
        ++i
        $("#pagerOpen").append(String.format(pagerItem, i))
    }
    while (i < pagecount)
    $("#pagerOpen").append(pagerFwd)

}

function renderPager() {
    $("#servContainer").append(pagerPlaceHolder);
    if (document.getElementById("pagerPlaceHolder") && document.getElementById("pagerPlaceHolder").hasChildNodes) {
        $("#pagerPlaceHolder").empty()
    }
    var pager = $("#pagerPlaceHolder")
    pager.append(pagerOpen)
    $("#pagerOpen").append(pagerPrevious)
    $("#pagerOpen").append(pagerFwd)

}

function addPagerEventHandler() {
    $("#prev").on('click', moveBack);
    $("#fwd").on('click', moveForward)
}

function moveBack() {
    currentPos -= perPage;
    if (currentPos < 0) currentPos = 0
    //if (!(currentPos < perPage)) {
        $("#prev").attr('href', "#");
        if ($("#selectEnti").val()) {
            searchTemplatesByType($("#selectEnti").val())
        } else if ($("#appendedInputButton").val()) {
            searchTemplates($("#appendedInputButton").val())
        } else if ($("#selectEnti").val() && $("#appendedInputButton").val()) {
            combineSearchFilters(
                $("#appendedInputButton").val(),
                $("#selectEnti").val()
            )
        } else
            fetchData();
    // } else {
    //     $("#prev").attr('disabled', "disabled")
    //     $("#prev").removeAttr('href');
    // }
}

function moveForward() {
    // if (!(currentPos > perPage)) {

    if (currentPos < 0) currentPos = 0
    currentPos += perPage;
    $("#fwd").attr('href', "#");
    if ($("#selectEnti").val()) {
        searchTemplatesByType($("#selectEnti").val())
    } else if ($("#appendedInputButton").val()) {
        searchTemplates($("#appendedInputButton").val())
    } else if ($("#selectEnti").val() && $("#appendedInputButton").val()) {
        combineSearchFilters(
            $("#appendedInputButton").val(),
            $("#selectEnti").val()
        )
    } else
        fetchData();
    // } else {
    //     $("#forw").attr('disabled', "disabled")
    //     $("#forw").removeAttr('href');
    // }
}

function searchTemplates(searchString) {
    var relativeUrl = "-/api/service-templates/" + String.format('?filter={"where":{"name":{"like":"{0}.*","options":"i"}},"limit":{1},"skip":{2}}', searchString, perPage, currentPos)
    $.ajax({
        url: relativeUrl
    }).done(function (data) {

        if (data && data.length > 0) {
            renderData(data);
            if (data.length >= 12) {
                renderPager();
            } else {
                hidePager();
            }

        } else {
            renderTemplateNotFound()
        }

    })

}

function searchTemplatesByType(searchString) {
    if (searchString != "*") {
        var relativeUrl = serviceUri + "{0}"

        var absoluteUrl = String.format(relativeUrl, searchString) + '&filter[limit]=' + perPage + '&filter[skip]=' + currentPos

        $.ajax({
            url: absoluteUrl
        }).done(function (data) {
            renderData(data)
            if (data.length >= 12) {
                renderPager();
            } else {
                hidePager();
            }
            addPagerEventHandler();
        })
    } else {
        fetchData()
    }
}

function combineSearchFilters(searchString, selectString) {
    if (!searchString && !selectString) {
        alert("Nessun filtro specificato")
    }
    var relativeUrl = serviceUri + "{0}"
    var absoluteUrl = "-/api/service-templates/" + String.format('?filter={"where":{"name":{"like":"{0}.*","options":"i"},"entePa":{"like":"{3}.*","options":"i"}},"limit":{1},"skip":{2}}', searchString, perPage, currentPos, selectString)
    $.ajax({
        url: absoluteUrl
    }).done(function (data) {
        renderData(data)
        $("#pagerPlaceHolder").empty()
        if (document.getElementById("pagerPlaceHolder").hasChildNodes && data.length > 0) {
            renderPager();
            addPagerEventHandler();
        } else {
            renderTemplateNotFound()
        }
    })
}

function clearSearchFilters() {
    $("#selectEnti").val("")
    $("#appendedInputButton").val("")
    document.getElementById("appendedInputButton").dispatchEvent(new Event("change"))
}

function count() {
    if ($("#appendedInputButton").val()) {
        combineSearchFilters(
            $("#appendedInputButton").val(),
            $("#selectEnti").val()
        )
    } else {
        searchTemplatesByType($("#selectEnti").val())
    }
}

function renderTemplateNotFound() {
    $("#cardContainer").empty()
    $("#cardContainer").append(notFoundHtml)
    $("#pagerPlaceHolder").attr("hidden", "hidden")
}

function hidePager() {
    $("#pagerPlaceHolder").attr("hidden", "hidden")
}

// //future development
// function pagination(c, m) {
//     var delta = 2,
//         range = [],
//         rangeWithDots = [],
//         l;

//     range.push(1)
//     for (let i = c - delta; i <= c + delta; i++) {
//         if (i < m && i > 1) {
//             range.push(i);
//         }
//     }
//     range.push(m);

//     for (let i of range) {
//         if (l) {
//             if (i - l === 2) {
//                 rangeWithDots.push(l + 1);
//             } else if (i - l !== 1) {
//                 rangeWithDots.push('...');
//             }
//         }
//         rangeWithDots.push(i);
//         l = i;
//     }

//     return rangeWithDots;
// }