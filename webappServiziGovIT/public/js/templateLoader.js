var template;
var isService;
var isTemplate;

// if (typeof getQueryStringParam !== "undefined") {

// }
function setFastProcedure(control) {
    sessionStorage.setItem("fastProcedure", control)
}
$(document).ready(function () {


    $('#paroleChiaveClass').on('itemAdded', function (event) {
        console.log(event);
        if ($(this).tagsinput('items').length > 0) {
            $("#textKey").hide();
            $("#paroleChiaveClass").prev().removeClass("errorInput");
        }
    })
    $('#paroleChiaveClass').on('itemRemoved', function (event) {
        if ( $('#paroleChiaveClass').tagsinput('items').length == 0) {
            $("#textKey").show();
            $("#paroleChiaveClass").prev().addClass("errorInput");
        }
    });



    $("input[type='date']").datepicker();
    var templateId = getQueryStringParam("templateId");
    if (templateId) {
        $("#breadcrumbSceltaModello").show();
        $("#breadcrumbNuovoServizio").show();
        isTemplate = true;
        isService = false;
        sessionStorage.setItem("templateRef", templateId);
        sessionStorage.removeItem("serviceId");
        fetchTemplate(templateId);
    }
    var serviceId = getQueryStringParam("serviceId");
    if (serviceId) {
        isService = true;
        isTemplate = false;
        sessionStorage.setItem("serviceId", serviceId);
        sessionStorage.removeItem("templateRef");
        $("#breadcrumbSceltaModello").hide();
        $("#breadcrumbNuovoServizio").hide();
        fetchService(serviceId);
    }
    if (templateId) {
        $("#1_organizz").html(sessionStorage.getItem("description"));
        $("#1_ruolo").html("titolare");
        $("#1_al")
            .next()
            .append(
                '<button type="button" class="btn btn-default btn-icon" onClick="editRowOrganiz(1)" id="001_modify"><span class="fa fa-pencil"></span></button>  <button type="button" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button>'
            );
    } else {
        $("#nomedelservizio").attr("disabled");
        $("#1_organizz")
            .parent()
            .hide();
    }

    if (!templateId && !serviceId) {
        sessionStorage.removeItem("templateRef");
        sessionStorage.removeItem("serviceId");
        $("#nomedelservizio").removeAttr("disabled");

    }
    //show del body per evitare di vedere la pagina senza css prima del caricamento degli stili
    $("#bodyForm").show()
    $("#dataDaTemp").datepicker()
    $("#dataATemp").datepicker()
    $("#dalOrganizz").datepicker()
    $("#alOrganizz").datepicker()
})

function fetchTemplate(templateId) {
    var url = "/api/service-templates/" + templateId
    $.ajax({
        url: url
    }).done(function (data) {
        template = data;
        populateTab1Fields(data);
    }).fail(function () {
        alert("Non è stato possibile popolare il form basandosi sul template")
    })
}

function fetchService(serviceId) {
    var url = "/api/public-services/" + serviceId
    $.ajax({
        url: url,
        datatype: "JSON"
    }).done(function (data) {
        template = data;
        // sessionStorage.setItem("templateRef", template.publicService.template.id)
        populateTab1Fields(data)
    }).fail(function () {
        throw new Error("Unable to fetch service")
    })

}

function populateTab1Fields(template) {
    $("#nomedelservizio").val(template.publicService.name.description);
    $("#descrizioneServizio").val(template.publicService.description.description);
    if (template.publicService.alternativeName) {
        $("#nomedelservizioAlternativo").val(template.publicService.alternativeName.description)
    }
    if (template.publicService.alternativeId)
        $("#altroIdentificativo").val(template.publicService.alternativeId.id)
    if (template.publicService.urlservizio)
        $("#urlservizio").val(template.publicService.urlservizio)
    popolateInputFieldsTemplate(template)
    popolateOutputFieldsTemplate(template)
    populateGeoTempFieldsTemplate(template)
    checkServiceStatus(template)
    if (ismsie()) {
        $("input[type='time']").ptTimeSelect({
            setButtonLabel: "Ok",
            hoursLabel: 'Ore',
            minutesLabel: 'Minuti'
        });
    }
}

function PopulateTab2Fields(template) {
    if (template.publicService.keywords) {
        $.each(template.publicService.keywords, function (index, obj) {
            $("#bootstrapTags").val($("#bootstrapTags").val() + obj.description);
            $("#bootstrapTags").trigger("focusin")
            $("#bootstrapTags").trigger("focusout")
        })
    }
    if (template.publicService.themes) {
        $.each(template.publicService.themes, function (index, obj) {
            $("[identifier='" + obj.id + "']").attr("checked", "checked");
        })
    }
    if (template.publicService.sector && isTemplate) {
        loadSectorFromTemplate(template);
    }
    if (template.publicService.sector && isService) {
        loadSectorFromService(template);
    }

}

function loadSectorFromService(template) {
    $.each(template.publicService.sector, function (index, sec) {
        let c = true;
        let a = [];
        var l = sec;
        while (c) {
            let identifier = (l.idParent) ? l.idParent : l.idNace;
            $.ajax({
                url: 'api/naces?filter={"where":{"identifier":"' + identifier + '"}}',
                cache: false,
                async: false
            }).done(function (data) {
                if (data[0]) {
                    l = data[0];
                    a.push(data[0]);
                } else
                    c = false;
            }).fail(function (e) {
                throw new Error("Something bad happened");
                return undefined;
            });
            if (!l) {
                c = false;
            }
        }
        populateSectorFromSortedArray(sortObjectByKey(a, "idLevel"));
    })
}

function loadSectorFromTemplate(template) {

    let c = true;
    let a = [];
    var l = template.publicService.sector[template.publicService.sector.length - 1];
    while (c) {
        let identifier = (l.idParent) ? l.idParent : l.idNace;
        $.ajax({
            url: 'api/naces?filter={"where":{"identifier":"' + identifier + '"}}',
            cache: false,
            async: false
        }).done(function (data) {
            if (data[0]) {
                l = data[0];
                a.push(data[0]);
            } else
                c = false;
        }).fail(function (e) {
            throw new Error("Something bad happened");

            return undefined;
        });
        if (!l) {
            c = false;
        }
    }
    populateSectorFromSortedArray(sortObjectByKey(a, "idLevel"));
}

function PopulateTab3Fields(template) {
    if (template.publicService.organizations && template.publicService.organizations.length > 0)
        popolateOrganizationTemplate(template)
}

function PopulateTab4Fields(template) {
    if (template.publicService.contacts)
        popolateContattiTemplate(template)
}

function PopulateTab5Fields(template) {
    if (template.publicService.interactivityLevel)
        $("[id='" + template.publicService.interactivityLevel + "']").prop("checked", true)
    if (template.publicService.languages) {
        $.each(template.publicService.languages, function (index, lang) {
            $("[value=" + lang + "]").prop("checked", true)
        })
    }
    if (template.publicService.processingTimes.length > 0) {
        $("#tempoProcessamento").val(template.publicService.processingTimes[0].value.trim())
        $("[value=" + template.publicService.processingTimes[0].unit + "]").attr("selected", "selected")
    }
    if (template.publicService.costs) {
        popolateCostoFieldFromTemplate(template.publicService.costs)
    }
}

function populateAuthTab5(template) {
    if (template.publicService.authentications)
        $.each(template.publicService.authentications, function (index, obj) {
            $("#" + obj.type).prop("checked", true);
        })
}

function populateGeoTempFieldsTemplate(template) {

    if (template.publicService.temporalCoverage &&
        template.publicService.temporalCoverage[0] &&
        template.publicService.temporalCoverage[0].startInterval != "" &&
        template.publicService.temporalCoverage[0].startInterval != undefined) {
        $("#coperturaTemporale").prop("checked", true)
        $(".divOpenTemp").slideDown();
        if (template.publicService.temporalCoverage[0].startInterval) {
            let start = template.publicService.temporalCoverage[0].startInterval;
            $("#dataDaTemp").datepicker("setDate",start.substring(0, start.lastIndexOf("-")))
            $("#dataDaTempOra").val(start.substring(start.lastIndexOf("-") + 1, start.length).replace('/', "-"))
        }
        if (template.publicService.temporalCoverage[0].endInterval) {
            let end = template.publicService.temporalCoverage[0].endInterval;
            $("#dataATemp").datepicker("setDate",end.substring(0, end.lastIndexOf("-")))
            $("#dataATempOra").val(end.substring(end.lastIndexOf("-") + 1, end.length))
        }
        if (template.publicService.temporalCoverage[0].weekDays) {
            $.each(template.publicService.temporalCoverage[0].weekDays, function (index, day) {
                $("[value='" + day + "']").prop("checked", true)
            })
        }
    }
    if (template.publicService.spatialCoverage && template.publicService.spatialCoverage.length > 0) {
        var geoDataArr = []
        $.each(template.publicService.spatialCoverage, function (index, region) {
            switch (region.type) {
                case "comune":
                    var urlComune = "api/towns?filter[where][codiceCatastale]=" + region.code;
                    var geoOb = callSpacialDefinitionByURL(urlComune);
                    geoDataArr.push(geoOb);
                    break;
                case "provincia":
                    var urlProvincia = "api/provinces?filter[where][codiceProvincia]=" + region.code;
                    var geoOb = callSpacialDefinitionByURL(urlProvincia);
                    geoDataArr.push(geoOb);
                    break;
                case "regione":
                    var urlRegione = "/api/regions?filter[where][codiceRegione]=" + region.code;
                    var geoOb = callSpacialDefinitionByURL(urlRegione);
                    geoDataArr.push(geoOb);
                    break;
                default:
                    break;
            }
        })
        popolateFieldsCopertGeogFromArray(geoDataArr)
    }
}

function getGeoDataObj(serviceObj) {
    var geoData = {};

    (serviceObj.denominazioneRegione && serviceObj.denominazioneRegione != "") ? geoData.regioneVal = serviceObj.denominazioneRegione: geoData.regioneVal = "-";
    (serviceObj.denomProvCitMetropol && serviceObj.denomProvCitMetropol != "") ? geoData.provinciaVal = serviceObj.denomProvCitMetropol: geoData.provinciaVal = "-";
    (serviceObj.denominazioneIt && serviceObj.denominazioneIt != "") ? geoData.comuneVal = serviceObj.denominazioneIt: geoData.comuneVal = "-";
    (serviceObj.codiceRegione && serviceObj.codiceRegione != "") ? geoData.regioneId = serviceObj.codiceRegione: geoData.regioneId = "-";
    (serviceObj.codiceProvincia && serviceObj.codiceProvincia != "") ? geoData.provinciaId = serviceObj.codiceProvincia: geoData.provinciaId = "-";
    (serviceObj.codiceCatastale && serviceObj.codiceCatastale != "") ? geoData.comuneId = serviceObj.codiceCatastale: geoData.comuneId = "-";

    return geoData;
}

function callSpacialDefinitionByURL(sdUrl) {
    var geoConverted
    $.ajax({
        url: sdUrl,
        cache: false,
        async: false
    }).done(function (data) {
        if (data[0]) {
            geoConverted = getGeoDataObj(data[0]);
        }
    }).fail(function (e) {
        //throw new Error("Something bad happened");
        console.log(e)
        alert("AJAX failure")
        return undefined;
    })
    return geoConverted
}

function checkServiceStatus(template) {
    if (template.publicService)
        $("#radioOptionStatus[value=" + template.publicService.status + "]").prop("checked", true)
}