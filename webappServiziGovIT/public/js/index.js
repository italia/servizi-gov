$(document).ready(function (e) {
    sessionStorage.removeItem("cpa")
    sessionStorage.removeItem("description")
    $("#components").css("transition", "all 0.5s ease-in-out;")
    if (!$("#paAutorizzate").is("select")) {
        $("#paAutorizzate").autocomplete({
            source: function (request, resolve) {
                popolateAutocompleteOrganizzInDashboard(request.term, resolve);
            },
            minLength: 4,
            select: function (event, ui) {
                $("#paAutorizzate").val(ui.item.label);
                $("#paAutorizzate").attr("itemCode", ui.item.value);
                $("#components").removeAttr("hidden")
                $("#components").fadeIn()

                return false;
            },
            change: function (event, ui) {
                $(this).val((ui.item ? ui.item.label : ""));
                $("#components").fadeIn()
            },
        });
    } else {
        $("#components").removeAttr("hidden")
    }


    $("#dashboardRedirect").click(function (e) {
        if ($("#paAutorizzate").is("select")) {
            let cpa = $("#paAutorizzate :selected").attr("itemCode");
            let val = String.format("/dashboard?cpa={0}&description={1}",
                cpa, $("#paAutorizzate [itemCode='" + cpa + "']").text())
            $("#dashboardRedirect").attr("href", val)
            $("#components").removeAttr("hidden")
            sessionStorage.setItem("cpa", $("#paAutorizzate :selected").attr("itemCode"))

        } else {
            let cpa = $("#paAutorizzate").attr("itemCode");
            let val = String.format("/dashboard?cpa={0}&description={1}",
                cpa, $("#paAutorizzate").val())
            $("#dashboardRedirect").attr("href", val)
            sessionStorage.setItem("cpa", $("#paAutorizzate").attr("itemCode"))
        }
        //$(this).click()
        var href = $(this).attr("href")
        window.location.href = href;
    })
})

function popolateAutocompleteOrganizzInDashboard(insertWord, response) {
    startWait("amm", "Caricamento amministrazioni in corso");
    var name = "sgiorganization"
    var collection = "organizations"
    var query = '?filter={"where":{"or":[{"name":{"like":"' +
        insertWord +
        '.*","options":"i"}},{"organizationCode":{"like":"' +
        insertWord +
        '.*","options":"i"}}]},"limit":20}';
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        if (data.lenght = 0)
        {
            swal(String.format("Nessuna amministrazione trovata con il termine di ricerca \"{0}\"",insertWord), {
                icon: "error",
            });
            return;
        }
        stopWait("amm");
        var appName = [];
        $.each(data, function (i, field) {
            appName.push({
                value: field.organizationCode,
                label: field.name
            });
        });
        response(appName);
    } else {
        stopWait("amm");

    }


    //liv interazione
    // $.ajax({
    //     type: "GET",
    //     dataType: "json",
    //     url: 'https://sgiorganization.xxxx/api/organizations?filter={"where":{"or":[{"name":{"like":"' +
    //         insertWord +
    //         '.*","options":"i"}},{"organizationCode":{"like":"' +
    //         insertWord +
    //         '.*","options":"i"}}]},"limit":20}'
    // }).done(function (data) {
    //     stopWait("amm");
    //     var appName = [];
    //     $.each(data, function (i, field) {
    //         appName.push({
    //             value: field.organizationCode,
    //             label: field.name
    //         });
    //     });
    //     response(appName);
    // }).fail(function (res) {
    //     stopWait("amm");
    // });
}