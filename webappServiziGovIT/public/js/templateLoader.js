var template;
var isService;
var isTemplate;

function setFastProcedure(control, self) {
    var serviceFor = $(self).attr("serviceFor")
    switch (serviceFor) {
        case "EXT":
            sessionStorage.setItem("serviceFor", serviceFor);

            break;
        case "INT":
            sessionStorage.setItem("serviceFor", serviceFor);
            $("#nomedelservizio").removeAttr("disabled");
            break;
        case "PA2PA":
            sessionStorage.setItem("serviceFor", serviceFor);
            $("#nomedelservizio").removeAttr("disabled");
            break;
    }
    sessionStorage.setItem("fastProcedure", control);

}

$(document).ready(function () {
    // $('#paroleChiaveClass').on('itemAdded', function (event) {
    //     console.log(event);
    //     if ($(this).tagsinput('items').length > 0) {
    //         $("#textKey").hide();

    //     }
    // })
    // $('#paroleChiaveClass').on('itemRemoved', function (event) {
    //     if ($('#paroleChiaveClass').tagsinput('items').length == 0) {
    //         $("#textKey").show();

    //     }
    // });

    if (ismsie())
        $("input[type='date']").datepicker();
    var templateId = getQueryStringParam("templateId");
    if (templateId) {
        $("#modifyOrInsert").html("Inserimento");
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
        $("#modifyOrInsert").html("Modifica")
        isService = true;
        isTemplate = false;
        sessionStorage.setItem("serviceId", serviceId);
        sessionStorage.removeItem("templateRef");
        $("#breadcrumbSceltaModello").hide();
        $("#breadcrumbNuovoServizio").hide();
        fetchService(serviceId);
    }
    var serviceArchivedId = getQueryStringParam("serviceArchivedId");
    if (serviceArchivedId) {
        $("#modifyOrInsert").html("Visualizza")
        isService = true;
        isTemplate = false;
        sessionStorage.setItem("serviceArchivedId", serviceArchivedId);
        sessionStorage.removeItem("serviceId");
        sessionStorage.removeItem("templateRef");
        $("#breadcrumbSceltaModello").hide();
        $("#breadcrumbNuovoServizio").hide();
        fetchArchivedService(serviceArchivedId);
    }
    if (templateId) {
        $("#0_organizz").html(sessionStorage.getItem("description"));
        $("#0_ruolo").html("titolare");
        $("#0_al").next()
            .append(
                '<button type="button" class="btn btn-default btn-icon" onClick="editRowOrganiz(0)" id="001_modify"><span class="fa fa-pencil"></span></button>  <button type="button" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button>'
            );
    } else {
        $("#nomedelservizio").attr("disabled");
        $("#0_organizz").parent().remove()
    }
    $("#tableOrg").show();
    if (!templateId && !serviceId) {
        $("#modifyOrInsert").html("Inserimento");
        sessionStorage.removeItem("templateRef");
        sessionStorage.removeItem("serviceId");
        $("#nomedelservizio").removeAttr("disabled");
    }

    hideBreadcrumb();
    //show del body per evitare di vedere la pagina senza css prima del caricamento degli stili
    $("#bodyForm").show()

    $("#dataDaTemp").datepicker()
    $("#dataDaTemp").datepicker('option', 'dateFormat', 'dd-mm-yy');
    $("#dataDaTemp").datepicker('option', "$.datepick.regional['it']");
    $('#dataDaTemp').on('focus', function () {
        var $target = $(this);
        $target.datepicker('widget').position({

            my: 'left top',
            at: 'left bottom',
            of: $target
        });
    });

    $("#dataDaTempEdit").datepicker()
    $("#dataDaTempEdit").datepicker('option', 'dateFormat', 'dd-mm-yy');
    $("#dataDaTempEdit").datepicker('option', "$.datepick.regional['it']");
    $('#dataDaTempEdit').on('focus', function () {
        var $target = $(this);
        $target.datepicker('widget').position({

            my: 'left top',
            at: 'left bottom',
            of: $target
        });
    });

    $("#dataATemp").datepicker()
    $("#dataATemp").datepicker('option', 'dateFormat', 'dd-mm-yy');
    $("#dataATemp").datepicker('option', "$.datepick.regional['it']");
    $('#dataATemp').on('focus', function () {
        var $target = $(this);
        $target.datepicker('widget').position({

            my: 'left top',
            at: 'left bottom',
            of: $target
        });
    });

    $("#dataATempEdit").datepicker()
    $("#dataATempEdit").datepicker('option', 'dateFormat', 'dd-mm-yy');
    $("#dataATempEdit").datepicker('option', "$.datepick.regional['it']");
    $('#dataATempEdit').on('focus', function () {
        var $target = $(this);
        $target.datepicker('widget').position({

            my: 'left top',
            at: 'left bottom',
            of: $target
        });
    });

    $("#dalOrganizz").datepicker()
    $("#dalOrganizz").datepicker('option', 'dateFormat', 'dd-mm-yy');
    $("#dalOrganizz").datepicker('option', "$.datepick.regional['it']");
    $('#dalOrganizz').on('focus', function () {
        var $target = $(this);
        $target.datepicker('widget').position({

            my: 'left top',
            at: 'left bottom',
            of: $target
        });
    });

    $("#alOrganizz").datepicker()
    $("#alOrganizz").datepicker('option', 'dateFormat', 'dd-mm-yy');
    $("#alOrganizz").datepicker('option', "$.datepick.regional['it']");
    $('#alOrganizz').on('focus', function () {
        var $target = $(this);
        $target.datepicker('widget').position({

            my: 'left top',
            at: 'left bottom',
            of: $target
        });
    });

    $("#dalOrganizzEdit").datepicker()
    $("#dalOrganizzEdit").datepicker('option', 'dateFormat', 'dd-mm-yy');
    $("#dalOrganizzEdit").datepicker('option', "$.datepick.regional['it']");
    $('#dalOrganizzEdit').on('focus', function () {
        var $target = $(this);
        $target.datepicker('widget').position({

            my: 'left top',
            at: 'left bottom',
            of: $target
        });
    });

    $("#alOrganizzEdit").datepicker()
    $("#alOrganizzEdit").datepicker('option', 'dateFormat', 'dd-mm-yy');
    $("#alOrganizzEdit").datepicker('option', "$.datepick.regional['it']");
    $('#alOrganizzEdit').on('focus', function () {
        var $target = $(this);
        $target.datepicker('widget').position({

            my: 'left top',
            at: 'left bottom',
            of: $target
        });
    });
    if (sessionStorage.getItem("serviceArchivedId") || sessionStorage.getItem("isArchived") == 'true') {
        $("#nomedelservizio").prop("disabled", true);
        $(":input").prop("disabled", true)
        $(".btn-primary").prop("disabled", false)
    }
})
$(window).on('resize orientationchange', function (e) {
    if ($.datepicker._datepickerShowing) {
        var datepicker = $.datepicker._curInst;
        dpInput = datepicker.input;
        dpElem = datepicker.dpDiv;
        dpElem.position({
            my: 'left top',
            of: dpInput,
            at: 'left bottom'
        });
    }
});

function fetchTemplate(templateId) {


    var name = "sgiservicetemplate"
    var collection = "service-templates/" + templateId
    var query = ""
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        template = data;
        populateTab1Fields(data);
    } else {
        swal("Impossibile caricare il template, redirect alla scelta del modello tra 5 secondi", {
            icon: "error",
            buttons: false
        })
        setTimeout(function () {
            window.history.back();
        }, 5000)
    }
}

function fetchService(serviceId) {
    var name = "sgiservice"
    var collection = "public-services/" + serviceId
    var query = ""
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        template = data;
        populateTab1FieldsService(data)
    } else {
        swal("Impossibile caricare il servizio, redirect in dashboard tra 5 secondi", {
            icon: "error",
            buttons: false
        })
        setTimeout(function () {
            window.location.href = "/dashboard"
        }, 5000)
    }
}

function fetchArchivedService(serviceId) {
    var name = "sgiservice"
    var collection = "deletedservices/" + serviceId
    var query = ""
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        template = data;
        populateTab1FieldsService(data)
    } else {
        swal("Impossibile caricare il servizio, redirect in dashboard tra 5 secondi", {
            icon: "error",
            buttons: false
        })
        setTimeout(function () {
            window.location.href = "/dashboard"
        }, 5000)
    }
}

function populateTab1Fields(template) {
    $("#nomedelservizio").val(template.publicService.name.description);
    $("#descrizioneServizio").val(template.publicService.description.description);
    if (template.publicService.alternativeName) {
        $("#nomedelservizioAlternativo").val(template.publicService.alternativeName.description)
    }
    if (template.publicService.alternativeId)
        $("#altroIdentificativo").val(template.publicService.alternativeId.id)
    if (template.publicService.serviceUrl)
        $("#urlservizio").val(template.publicService.serviceUrl)
    if (template.publicService.serviceType)
        sessionStorage.setItem("serviceFor", template.publicService.serviceType)
    popolateInputFieldsTemplate(template)
    popolateOutputFieldsTemplate(template)
    // populateGeoTempFieldsTemplate(template);
    popolateTemporalCoverage(template);
    checkServiceStatus(template)
    if (ismsie()) {
        $("input[type='time']").ptTimeSelect({
            setButtonLabel: "Ok",
            hoursLabel: 'Ore',
            minutesLabel: 'Minuti'
        });
    }
}

function populateTab1FieldsService(template) {
    $("#nomedelservizio").val(template.publicService["name"].find(name => name.language === "it").description);
    $("#descrizioneServizio").val(template.publicService["description"].find(obj => obj.language === "it").description);
    if (template.publicService.alternativeName) {
        $("#nomedelservizioAlternativo").val(template.publicService["alternativeName"].find(obj => obj.language === "it").description)
    }
    if (template.publicService.alternativeId)
        $("#altroIdentificativo").val(template.publicService.alternativeId.id)
    if (template.publicService.serviceUrl)
        $("#urlservizio").val(template.publicService.serviceUrl)
    if (template.publicService.serviceType)
        sessionStorage.setItem("serviceFor", template.publicService.serviceType)
    popolateInputFieldsTemplate(template);
    popolateOutputFieldsTemplate(template);
    // populateGeoTempFieldsTemplate(template);
    checkServiceStatus(template);
    popolateTemporalCoverage(template);
    if (ismsie()) {
        $("input[type='time']").ptTimeSelect({
            setButtonLabel: "Ok",
            hoursLabel: 'Ore',
            minutesLabel: 'Minuti'
        });
    }
}

function PopulateTab2Fields(template) {
    if (template && isTemplate) {
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
    if (template && isService) {
        if (template.publicService.keywords) {
            $.each(template.publicService.keywords, function (index, obj) {
                if (obj.language == "it") {
                    $("#bootstrapTags").val($("#bootstrapTags").val() + obj.description);
                    $("#bootstrapTags").trigger("focusin")
                    $("#bootstrapTags").trigger("focusout")
                }
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
}

function loadSectorFromService(template) {
    $.each(template.publicService.sector, function (index, sec) {
        let c = true;
        let a = [];
        var l = sec;
        while (c) {
            let identifier = (l.idParent) ? l.idParent : l.idNace;


            var name = "sginace"
            var collection = "naces"
            var query = '?filter={"where":{"identifier":"' + identifier + '"}}';
            var environment = ""
            var url = urlComposer(name, collection, query, environment);
            var objData = callService("GET", url);
            if (objData.success) {
                var data = objData.data
                if (data[0]) {
                    l = data[0];
                    a.push(data[0]);
                } else
                    c = false;
            } else {
                throw new Error("Something bad happened");
                return undefined;
            }
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

        var name = "sginace"
        var collection = "naces"
        var query = '?filter={"where":{"identifier":"' + identifier + '"}}';
        var environment = ""
        var url = urlComposer(name, collection, query, environment);
        var objData = callService("GET", url);
        if (objData.success) {
            var data = objData.data
            if (data[0]) {
                l = data[0];
                a.push(data[0]);
            } else
                c = false;
        } else {
            throw new Error("Something bad happened");

            return undefined;
        }

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
    if (template) {
        if (template.publicService.interactivityLevel)
            $(".interaction [id='" + template.publicService.interactivityLevel + "']").prop("checked", true)
        if (template.publicService.languages) {
            $.each(template.publicService.languages, function (index, lang) {
                $("#linguaCheckBox [value=" + lang + "]").prop("checked", true)
            })
        }
        if (template.publicService.processingTimes && template.publicService.processingTimes.length > 0) {
            $("#tempoProcessamento").val(template.publicService.processingTimes[0].value.trim())
            $("[value=" + template.publicService.processingTimes[0].unit + "]").attr("selected", "selected")
        }
        if (template.publicService.costs) {
            popolateCostoFieldFromTemplate(template.publicService.costs)
        }
    }
}

function populateAuthTab5(template) {
    if (template) {
        if (template.publicService.authentications)
            $.each(template.publicService.authentications, function (index, obj) {
                $("#" + obj.type).prop("checked", true);
            })
    }
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
            $("#dataDaTemp").datepicker("setDate", start.substring(0, start.lastIndexOf("-")))
            $("#dataDaTempOra").val(start.substring(start.lastIndexOf("-") + 1, start.length).replace('/', "-"))
        }
        if (template.publicService.temporalCoverage[0].endInterval) {
            let end = template.publicService.temporalCoverage[0].endInterval;
            $("#dataATemp").datepicker("setDate", end.substring(0, end.lastIndexOf("-")))
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
                    // var urlComune = "https://sgispatialdefinition.xxxx/api/towns?filter[where][codiceCatastale]=" + region.code;
                    var name = "sgispatialdefinition"
                    var collection = "towns"
                    var query = "?filter[where][codiceCatastale]=" + region.code;
                    var environment = ""
                    var urlComune = urlComposer(name, collection, query, environment);

                    var geoOb = callSpacialDefinitionByURL(urlComune);
                    geoDataArr.push(geoOb);
                    break;
                case "provincia":
                    // var urlProvincia = "https://sgispatialdefinition.xxxx/api/provinces?filter[where][codiceProvincia]=" + region.code;
                    var name = "sgispatialdefinition"
                    var collection = "provinces"
                    var query = "?filter[where][codiceProvincia]=" + region.code;
                    var environment = ""
                    var urlProvincia = urlComposer(name, collection, query, environment);

                    var geoOb = callSpacialDefinitionByURL(urlProvincia);
                    geoDataArr.push(geoOb);
                    break;
                case "regione":
                    // var urlRegione = "https://sgispatialdefinition.xxxx/api/regions?filter[where][codiceRegione]=" + region.code;
                    var name = "sgispatialdefinition"
                    var collection = "regions"
                    var query = "?filter[where][codiceRegione]=" + region.code;
                    var environment = ""
                    var urlRegione = urlComposer(name, collection, query, environment);
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
    var objData = callService("GET", sdUrl);
    if (objData.success) {
        var data = objData.data
        if (data[0]) {
            geoConverted = getGeoDataObj(data[0]);
        }
    } else {
        console.log(e)
        alert("AJAX failure")
        return undefined;
    }
    return geoConverted
}

function checkServiceStatus(template) {
    if (template.publicService)
        $("#radioOptionStatus[value=" + template.publicService.status + "]").prop("checked", true)
}

function popolateTemporalCoverage(template) {
    if (template.publicService.temporalCoverage && template.publicService.temporalCoverage.length > 0) {

        $("#coperturaTemporale").prop("checked", true);
        $("#tableCoperturTempor").show();
        $(".divOpenTemp").slideDown();
        var psTempotalCoverage = template.publicService.temporalCoverage;
        for (var a = 0; a < psTempotalCoverage.length; a++) {
            var obj = {}

            var appDa = psTempotalCoverage[a].startInterval.slice(0, 10)
            var appDaOra = psTempotalCoverage[a].startInterval.slice(psTempotalCoverage[a].startInterval.length - 5)
            obj.dataDa = appDa
            obj.dataDaOra = appDaOra
            var appA = psTempotalCoverage[a].endInterval.slice(0, 10)
            var appAOra = psTempotalCoverage[a].endInterval.slice(psTempotalCoverage[a].startInterval.length - 5)
            obj.dataA = appA
            obj.dataAOra = appAOra
            obj.giorni = []
            // var weekDaysToInsert = psTempotalCoverage[a].weekDays.split(",")
            $.each(psTempotalCoverage[a].weekDays, function (i, val) {
                // obj.giorni.push(val);
                switch (val) {
                    case "Mon":
                        obj.giorni.push("Lunedì");
                        break;
                    case "Tue":
                        obj.giorni.push("Martedì");
                        break;
                    case "Wed":
                        obj.giorni.push("Mercoledì");
                        break;
                    case "Thu":
                        obj.giorni.push("Giovedì");
                        break;
                    case "Fri":
                        obj.giorni.push("Venerdì");
                        break;
                    case "Sat":
                        obj.giorni.push("Sabato");
                        break;
                    case "Sun":
                        obj.giorni.push("Domenica");
                        break;
                }

            });
            popolateTableCopertTemporale(obj)
        }
    }
}

function hideBreadcrumb() {
    var serviceFor = sessionStorage.getItem("serviceFor");
    if (serviceFor != "EXT") {
        $("#breadcrumbSceltaModello").hide();
    }
}