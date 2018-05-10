var firstLoad = true;

$(document).ready(function () {

    $("#nextTabBottom").click(function (e) {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
        $(".nav-tabs .active")
            .parent()
            .next("li")
            .find("a")
            .trigger("click");
    });

    $("#prevTabBottom").click(function (e) {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
        $(".nav-tabs .active")
            .parent()
            .prev("li")
            .find("a")
            .trigger("click");
    });

    $("#nextTabTop").click(function (e) {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
        $(".nav-tabs .active")
            .parent()
            .next("li")
            .find("a")
            .trigger("click");
    });

    $("#prevTabTop").click(function (e) {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
        $(".nav-tabs .active")
            .parent()
            .prev("li")
            .find("a")
            .trigger("click");
    });

    $("#salva").click(function () {
        $.get("/js/serviceInputData.json", function (data) {
            salvaFile(data);
        });
    });

    var numberFields;
    var loadInfo = false;
    var loadOrganizzazione = false;
    var loadAccesso = false;
    var loadTema = false;
    var loadContatti = false;

    $(document).ajaxStop(function () {
        $("#wait").css("display", "none");
    });

    $.validator.setDefaults({
        ignore: ":hidden"
    });

    $("#nomeOrganizz").autocomplete({
        source: function (request, resolve) {
            popolateAutocompleteOrganizz(request.term, resolve);
        },
        minLength: 4
    });

    $("#nomeOrganizzEdit").autocomplete({
        source: function (request, resolve) {
            popolateAutocompleteOrganizz(request.term, resolve);
        },
        minLength: 4
    });

    $("#formCanaleErogazione").validate({
        rules: {
            urlWebApplErogCan: {
                pattern: /^(http|https)?(:\/\/)?[a-zA-Z0-9-\.]+\.[a-z]{2,4}/
            },
            urlWebApplErogCanEdit: {
                pattern: /^(http|https)?(:\/\/)?[a-zA-Z0-9-\.]+\.[a-z]{2,4}/
            },
            phoneNumberErogCan: {
                pattern: '[0-9 +]{5,15}'
            },
            phoneNumberErogCanEdit: {
                pattern: '[0-9 +]{5,15}'

            },
            emailErogCan: "email",
            emailErogCanEdit: "email",
            streetNameErogCan: "required",
            numberErogCan: "required",
            cityErgoCan: "required",
            postCodeErogCan: "required",
            streetNameErogCanEdit: "required",
            numberErogCanEdit: "required",
            cityErgoCanEdit: "required",
            postCodeErogCanEdit: "required",
            tipoCanaleErog: "required",

        },
        messages: {
            urlWebApplErogCan: 'Inserire un url valido',
            phoneNumberErogCan: 'Inserire un numero valido',
            emailErogCan: 'Inserire un\'email valida',

            urlWebApplErogCanEdit: 'Inserire un url valido',
            phoneNumberErogCanEdit: 'Inserire un numero valido',
            emailErogCanEdit: 'Inserire un\'email valida',


            streetNameErogCan: "Campo obbligatorio",
            numberErogCan: "Campo obbligatorio",
            cityErgoCan: "Campo obbligatorio",
            postCodeErogCan: "Campo obbligatorio",
            streetNameErogCanEdit: "Campo obbligatorio",
            numberErogCanEdit: "Campo obbligatorio",
            cityErgoCanEdit: "Campo obbligatorio",
            postCodeErogCanEdit: "Campo obbligatorio",
            tipoCanaleErog: "Campo obbligatorio",

        },
        errorClass: "errorText",
        highlight: function (element) {
            $(element).addClass("errorInput");
        },
        unhighlight: function (element) {
            $(element).removeClass("errorInput");
        }
    });

    $("#infoAForm").validate({
        rules: {
            nomedelservizio: "required",
            descrizioneServizio: "required",
            urlservizio: {
                pattern: /^(http|https)?(:\/\/)?[a-zA-Z0-9-\.]+\.[a-z]{2,4}/
            },
            docRifInputRichiesti: {
                pattern: /^(http|https)?(:\/\/)?[a-zA-Z0-9-\.]+\.[a-z]{2,4}/
            },
            descrizioneServizio: "required",

            nomeInputRichiesti: "required",
            tipoInputRichiesti: "required",
            nomeInputRichiestiEdit: "required",
            tipoInputRichiestiEdit: "required",
            nomeOutputProdotti: "required",
            nomeOutputProdottiEdit: "required",
            tipoOutputProdotti: "required",
            tipoOutputProdottiEdit: "required",
            regioneCoperturaGeog: "required",
        },
        messages: {
            descrizioneServizio: "Campo obbligatorio",
            nomedelservizio: "Campo obbligatorio",
            urlservizio: "Inserire un url valido",
            descrizioneServizio: "Campo obbligatorio",
            nomeInputRichiesti: "Campo obbligatorio",
            tipoInputRichiesti: "Campo obbligatorio",
            docRifInputRichiesti: "Inserire un url valido",
            nomeInputRichiestiEdit: "Campo obbligatorio",
            tipoInputRichiestiEdit: "Campo obbligatorio",
            nomeOutputProdotti: "Campo obbligatorio",
            nomeOutputProdottiEdit: "Campo obbligatorio",
            tipoOutputProdotti: "Campo obbligatorio",
            tipoOutputProdottiEdit: "Campo obbligatorio",
            regioneCoperturaGeog: "Campo obbligatorio",
        },
        errorClass: "errorText",
        highlight: function (element) {
            $(element).addClass("errorInput");
        },
        unhighlight: function (element) {
            $(element).removeClass("errorInput");
        }
    });

    $("#temaAForm").validate({
        rules: {
            "temaCheck[]": "required"

        },
        messages: {
            settoreservizio_1: "Campo obbligatorio"
        },
        errorPlacement: function (error, element) {
            return false;
        },
        errorClass: "errorText",
        highlight: function (element) {
            if (element.id == "temaCheck") {
                $("#alertTemi").show();
                $("#divError").addClass("errorInput");
            }
        },
        unhighlight: function (element) {
            if (element.id == "temaCheck") {
                $("#alertTemi").hide();
                $("#divError").removeClass("errorInput");
            }
        }
    });

    $("#accessoAForm").validate({
        rules: {
            modalitaautenticazione: "required",
            radioOption: "required",
            tipoCanaleErog: "required"
        },
        messages: {
            modalitaautenticazione: "Campo obbligatorio",
            radioOption: "Campo obbligatorio",
            tipoCanaleErog: "Campo obbligatorio"
        },
        errorClass: "errorText",
        errorPlacement: function (element, error) {
            if (element[0].id == "radioOption-error") {
                $("#containerRadioLivInteraizone").after(element);
                $(element).addClass("ml-25p")
            } else error.after(element);
        },
        highlight: function (element) {
            if (element.name == "radioOption") {
                $("#containerRadioLivInteraizone div.interaction").addClass("errorInput");
            } else $(element).addClass("errorInput");
        },
        unhighlight: function (element) {
            if (element.name == "radioOption") {
                $("#containerRadioLivInteraizone div.interaction").removeClass("errorInput");
            }
            $(element).removeClass("errorInput");
        }
    });

    $("#formOrganizz").validate({
        rules: {
            nomeOrganizz: "required",
            ruoloOrganizzModal: "required"
        },
        messages: {
            nomeOrganizz: "Campo obbligatorio",
            ruoloOrganizzModal: "Campo obbligatorio"
        },
        errorClass: "errorText",
        highlight: function (element) {
            $(element).addClass("errorInput");
        },
        unhighlight: function (element) {
            $(element).removeClass("errorInput");
        }
    });

    loadComponentTabInfo();

    $("#livInterazione").on("change", function () {
        $(this).valid();
    });

    $("#settori").click(function () {
        if ($(this).is(":checked")) {
            $(".divOpenSettore").slideDown();
        }
        // else {
        //     $('#nomeInputRichiesti').removeClass("errorInput");
        //     $('#tipoInputRichiesti').removeClass("errorInput");
        //     $('.divOpenInput').hide("slow");
        // }
    });

    $("#inputRichiesti").click(function () {
        if ($(this).is(":checked")) {
            $(".divOpenInput").slideDown();
        } else {
            $("#nomeInputRichiesti").removeClass("errorInput");
            $("#tipoInputRichiesti").removeClass("errorInput");
            $(".divOpenInput").slideUp();
        }
    });

    $("#outputProdotti").click(function () {
        if ($(this).is(":checked")) $(".divOpenOutput").slideDown();
        else {
            $(".divOpenOutput").slideUp();
            //            $('#nomeOutputProdotti').removeClass("errorInput");
            //            $('#tipoOutputProdotti').removeClass("errorInput");
        }
    });

    $("#coperturaTemporale").click(function () {
        if ($(this).is(":checked")) {
            $(".divOpenTemp").slideDown();
        } else {
            $(".divOpenTemp").slideUp();
            $("#dataATemp").removeClass("dataATemp");
        }
    });

    $("#coperturaGeografica").click(function () {
        if ($(this).is(":checked")) {
            $(".divOpenGeog").slideDown();
        } else {
            $(".divOpenGeog").slideUp();
        }
    });

    $("#canaliErogazione").click(function () {
        if ($(this).is(":checked")) $(".divOpenCanErog").slideDown();
        else $(".divOpenCanErog").slideUp();
    });

    $("#contattoAForm").validate({
        rules: {
            nomeUfficioContatti: "required",
            nomeUfficioContattiEdit: "required",
            emailContatti: {
                required: true,
                email: true
            },
            emailContattiEdit: {
                required: true,
                email: true
            },
            telefonoContatti: {
                pattern: '[0-9 +]{5,15}'
                // minlength: 9,
                // maxlength: 11
            },
            telefonoContattiEdit: {
                pattern: '[0-9 +]{5,15}'
                // minlength: 9,
                // maxlength: 11
            },

            sitoWebContatti: {
                pattern: /^(http|https)?(:\/\/)?[a-zA-Z0-9-\.]+\.[a-z]{2,4}/
            },
            sitoWebContattiEdit: {
                pattern: /^(http|https)?(:\/\/)?[a-zA-Z0-9-\.]+\.[a-z]{2,4}/
            }

        },
        messages: {
            nomeUfficioContatti: "Campo obbligatorio",
            emailContatti: {
                required: "Campo obbligatorio",
                email: "Inserire email valida"
            },
            telefonoContatti: "Inserire telefono valido",
            sitoWebContatti: "Inserire url valido",
            nomeUfficioContattiEdit: "Campo obbligatorio",
            emailContattiEdit: {
                required: "Campo obbligatorio",
                email: "Inserire email valida"
            },
            telefonoContattiEdit: "Inserire telefono valido",
            sitoWebContattiEdit: "Inserire url valido",
        },
        errorClass: "errorText",
        highlight: function (element) {
            $(element).addClass("errorInput");
        },
        unhighlight: function (element) {
            $(element).removeClass("errorInput");
        }
    });

    $("#costo").click(function () {
        if ($(this).is(":checked")) $(".divOpenCosti").slideDown();
        else $(".divOpenCosti").slideUp();
    });

    $('a[data-toggle="tab"]').on("hide.bs.tab", function (e) {

        if (e.target.tabIndex < e.relatedTarget.tabIndex) {
            var tab = e.relatedTarget.tabIndex;
            tab++
            $('a[tabIndex=' + tab + ']').removeClass("disabled")
            // $("#"+e.relatedTarget.id).removeClass("disabled")
            if (e.target.id != "faqA" &&
                e.target.id != "temaA" &&
                e.target.id != "accessoA"
            ) {
                var formName = e.target.id;
                var form = "Form";
                var bool = $("#" + formName + form).valid();
                if (e.relatedTarget.id == "fineA") {
                    $("#nextTabBottom").hide()
                    $("#nextTabTop").hide()
                    $("#prevTabTop").show()
                    $("#prevTabBottom").show()
                } else if (bool) {
                    $("#nextTabBottom").show()
                    $("#nextTabTop").show()
                    $("#prevTabTop").show()
                    $("#prevTabBottom").show()
                }
                return bool
            } else if (e.target.id == "temaA") {
                if (e.relatedTarget.id == "fineA") {
                    $("#nextTabBottom").hide()
                    $("#nextTabTop").hide()
                    $("#prevTabTop").show()
                    $("#prevTabBottom").show()
                } else {
                    $("#nextTabBottom").show()
                    $("#nextTabTop").show()
                    $("#prevTabTop").show()
                    $("#prevTabBottom").show()
                }
                var appTemaBool = false;
                // var appKeyBool = false;
                if (
                    $("#popolateSettoreDiv")
                    .children()
                    .children().length > 0
                ) {
                    $("#alertServizi").hide();
                    appTemaBool = true;
                } else {
                    $("#alertServizi").show();
                    appTemaBool = false;
                }
                // if ($("#paroleChiaveClass").length > 0) {
                //     if ($("#paroleChiaveClass").tagsinput('items').length > 0) {
                //         $("#textKey").hide();
                //         $("#paroleChiaveClass").prev().removeClass("errorInput");
                //         appKeyBool = true;
                //     } else {
                //         $("#textKey").show();
                //         $("#paroleChiaveClass").prev().addClass("errorInput");
                //         appKeyBool = false;
                //     }
                // } else
                //     appKeyBool = true;
                // return $("#temaAForm").valid() && appTemaBool && appKeyBool;
                return $("#temaAForm").valid() && appTemaBool;
            } else if (e.target.id == "accessoA") {

                var appAccessoBool = false;
                if ($("#divPopolateCanaliErogazione").length > 0) {
                    if (
                        $("#divPopolateCanaliErogazione")
                        .children()
                        .children().length > 0
                    ) {
                        $("#alertCanaleErogazione").hide();
                        appAccessoBool = true;
                    } else {
                        $("#alertCanaleErogazione").show();
                        appAccessoBool = false;
                    }
                } else
                    appAccessoBool = true;
                if (e.relatedTarget.id == "fineA" && $("#accessoAForm").valid() && appAccessoBool) {
                    $("#nextTabBottom").hide()
                    $("#nextTabTop").hide()
                    $("#prevTabTop").show()
                    $("#prevTabBottom").show()
                } else {
                    $("#nextTabBottom").show()
                    $("#nextTabTop").show()
                    $("#prevTabTop").show()
                    $("#prevTabBottom").show()
                }
                return $("#accessoAForm").valid() && appAccessoBool;
            } else if (e.target.id == "faqA") {
                if (e.relatedTarget.id == "fineA") {
                    $("#nextTabBottom").hide()
                    $("#nextTabTop").hide()
                    $("#prevTabTop").show()
                    $("#prevTabBottom").show()
                } else {
                    $("#nextTabBottom").show()
                    $("#nextTabTop").show()
                    $("#prevTabTop").show()
                    $("#prevTabBottom").show()
                }
            }

        } else if (e.relatedTarget.id == "infoA") {
            $("#nextTabBottom").show()
            $("#nextTabTop").show()
            $("#prevTabTop").hide()
            $("#prevTabBottom").hide()
        } else {
            $("#nextTabBottom").show()
            $("#nextTabTop").show()
            $("#prevTabTop").show()
            $("#prevTabBottom").show()
        }
    });

    $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
        if (e.target.id == "accessoA") {
            if (!loadAccesso) {
                loadAccesso = true;

                loadComponentTabAccesso();
                popolateChannelsFromService(template.publicService.channels);
            }
            //            setTimeout($('#livInterazione').select2({"width": "100%" , placeholder: "Please select a country",allowClear: true}),2000);
            if (sessionStorage.getItem("serviceArchivedId") || sessionStorage.getItem("isArchived") == 'true') {
                $(":input").prop("disabled", true)
                $(".btn-primary").prop("disabled", false)
            }
        } else if (e.target.id == "organizzazioneA") {
            if (!loadOrganizzazione) {
                $("#selectChoiceQuery").trigger("change");
                loadComponentTabOrganizzazione();

            }
            if (firstLoad && template && !loadOrganizzazione) {
                PopulateTab3Fields(template);
            }
            loadOrganizzazione = true;
            if (sessionStorage.getItem("serviceArchivedId") || sessionStorage.getItem("isArchived") == 'true') {
                $(":input").prop("disabled", true)
                $(".btn-primary").prop("disabled", false)
            }
        } else if (e.target.id == "temaA") {
            if (!loadTema) {
                loadComponentTabTema();
                loadTema = true;
                $(".bootstrap-tagsinput")
                    .children()
                    .attr("name", "bootstrapTags")
                    .attr("id", "bootstrapTags");
                if (firstLoad) PopulateTab2Fields(template);
            }
            if (sessionStorage.getItem("serviceArchivedId") || sessionStorage.getItem("isArchived") == 'true') {
                $(":input").prop("disabled", true)
                $(".btn-primary").prop("disabled", false)
            }
        } else if (e.target.id == "contattoA") {
            if (firstLoad && !loadContatti) {
                if (template) {
                    PopulateTab4Fields(template);
                }
                loadContatti = true
            }
            if (sessionStorage.getItem("serviceArchivedId") || sessionStorage.getItem("isArchived") == 'true') {
                $(":input").prop("disabled", true)
                $(".btn-primary").prop("disabled", false)
            }
        } else return;
    });

    $("#tipoCanaleErog").change(function () {

        var selected = $(this)
            .children(":selected")
            .attr("id");
        showFieldsInput(selected);
    });

    $("#tipoCanaleErogEdit").change(function () {
        var selected = $(this)
            .children(":selected")
            .attr("id");
        //        $('#containerInputEdit').html('')
        showFieldsInputEdit(selected);
    });

    $("#tipoCanaleNonTelematico").change(function () {
        var self = $(this);
        loadSubTypeNonTelematico(self);
    });

    $("#tipoAltroCanale").change(function () {
        var self = $(this);
        loadSubTypeAltriCanali(self);
    });

    $("#tipoCanaleNonTelematicoEdit").change(function () {
        var self = $(this);
        loadSubTypeNonTelematicoEdit(self);
    });

    $("#tipoAltroCanaleEdit").change(function (e) {
        console.log(e)
        var self = $(this);
        loadSubTypeAltriCanaliEdit(self);
    });

    $("#btnEditOrganizz").click(function (e) {
        var nome = $("#nomeOrganizzEdit").val();
        var ruolo = $("#ruoloOrganizzModalEdit").val();
        var dal = $("#dalOrganizzEdit").val();
        var al = $("#alOrganizzEdit").val();
        var number = $("#numberOfRowOrganization").val();
        $("#" + number + "_organizz").html(nome);
        $("#" + number + "_ruolo").html(ruolo);
        $("#" + number + "_dal").html(dal);
        $("#" + number + "_al").html(al);
        $("#nomeOrganizzEdit").val("");
        //        $("#ruoloOrganizzModalEdit").val("");
        $("#dalOrganizzEdit").val("");
        $("#alOrganizzEdit").val("");
        $("#modalOrganizzEdit").modal("hide");
    });

    $("#btnEditContacts").click(function (e) {
        var nomeContatto = $("#nomeUfficioContattiEdit").val();
        var emailContatto = $("#emailContattiEdit").val();
        var telefonoContatto = $("#telefonoContattiEdit").val();
        var urlContatto = $("#sitoWebContattiEdit").val();
        var number = $("#numberOfRowContacts").val();
        $("#" + number + "_nomeContatto").html(nomeContatto);
        $("#" + number + "_emailContatto").html(emailContatto);
        $("#" + number + "_telefonoContatto").html(telefonoContatto);
        $("#" + number + "_urlContatto").html(urlContatto);
        $("#nomeOrganizzEdit").val("");
        //        $("#ruoloOrganizzModalEdit").val("");
        $("#dalOrganizzEdit").val("");
        $("#alOrganizzEdit").val("");
        $("#modalContattiEdit").modal("hide");
    });

    $("#btnEditServizio").click(function (e) {
        var tipo1 =
            $("#settoreservizio_1Edit").val() == "" ||
            $("#settoreservizio_1Edit").val() == undefined ?
            " " :
            $("#settoreservizio_1Edit").val();
        var tipo2 =
            $("#settoreservizio_2Edit").val() == "" ||
            $("#settoreservizio_2Edit").val() == undefined ?
            " " :
            $("#settoreservizio_2Edit").val();
        var tipo3 =
            $("#settoreservizio_3Edit").val() == "" ||
            $("#settoreservizio_3Edit").val() == undefined ?
            " " :
            $("#settoreservizio_3Edit").val();
        var tipo4 =
            $("#settoreservizio_4Edit").val() == "" ||
            $("#settoreservizio_4Edit").val() == undefined ?
            " " :
            $("#settoreservizio_4Edit").val();
        var identifierTipo1 =
            $("#settoreservizio_1Edit")
            .children(":selected")
            .attr("id") == "" ||
            $("#settoreservizio_1Edit")
            .children(":selected")
            .attr("id") == undefined ?
            " " :
            $("#settoreservizio_1Edit")
            .children(":selected")
            .attr("id");
        var identifierTipo2 =
            $("#settoreservizio_2Edit")
            .children(":selected")
            .attr("id") == "" ||
            $("#settoreservizio_2Edit")
            .children(":selected")
            .attr("id") == undefined ?
            " " :
            $("#settoreservizio_2Edit")
            .children(":selected")
            .attr("id");
        var identifierTipo3 =
            $("#settoreservizio_3Edit")
            .children(":selected")
            .attr("id") == "" ||
            $("#settoreservizio_3Edit")
            .children(":selected")
            .attr("id") == undefined ?
            " " :
            $("#settoreservizio_3Edit")
            .children(":selected")
            .attr("id");
        var identifierTipo4 =
            $("#settoreservizio_4Edit")
            .children(":selected")
            .attr("id") == "" ||
            $("#settoreservizio_4Edit")
            .children(":selected")
            .attr("id") == undefined ?
            " " :
            $("#settoreservizio_4Edit")
            .children(":selected")
            .attr("id");

        var number = $("#numberOfRowSettoriEdit").val();

        $("#serviziotipo_" + number).html(tipo1);
        $("#serviziosottotipo2_" + number).html(tipo2);
        $("#serviziosottotipo3_" + number).html(tipo3);
        $("#serviziosottotipo4_" + number).html(tipo4);
        $("#serviziotipo_" + number).attr("number", identifierTipo1);
        $("#serviziosottotipo2_" + number).attr("number", identifierTipo2);
        $("#serviziosottotipo3_" + number).attr("number", identifierTipo3);
        $("#serviziosottotipo4_" + number).attr("number", identifierTipo4);
        $("#settoreservizio_1Edit").val("");
        $("#settoreservizio_2Edit").val("");
        $("#settoreservizio_3Edit").val("");
        $("#settoreservizio_4Edit").val("");
        $("#modalSettoriEdit").modal("hide");
    });

    $("#btnAggiungiOrganizz").click(function () {
        popolateOrganization();
    });

    $("#btnAggiungiContatti").click(function () {
        if ($("#contattoAForm").valid() == true) {
            $("#modalContatti").modal("hide");
            popolateContatti();
            blankFieldContacts();
            $("#tableContatti").show()
        }
    });

    $("#aggiungiInputRichiesti").click(function (e) {
        blanckInputFields();
    });

    $("#settoreservizio_1").change(function (e) {
        $("#settoreservizio_3").html("");
        $("#settoreservizio_4").html("");
        // $("#settoreservizio_1 option").removeAttr("selected");
        value = $("#settoreservizio_1").val();
        $("#settoreservizio_2").html("");
        var idLiv0 = $('#settoreservizio_1 option[value="' + value + '"]').attr(
            "id"
        );
        loadLiv1(idLiv0);
    });

    $("#settoreservizio_1Edit").change(function (e) {
        $("#settoreservizio_3Edit").html("");
        $("#settoreservizio_4Edit").html("");
        // $("#settoreservizio_1 option").removeAttr("selected");
        value = $("#settoreservizio_1Edit").val();
        $("#settoreservizio_2Edit").html("");
        var idLiv0 = $('#settoreservizio_1Edit option[value="' + value + '"]').attr(
            "id"
        );
        loadLiv1Edit(idLiv0);
    });

    $("#settoreservizio_2").change(function (e) {
        $("#settoreservizio_3").html("");
        var value = $("#settoreservizio_2").val();
        var idLiv1 = $('#settoreservizio_2 option[value="' + value + '"]').attr(
            "id"
        );
        loadLiv2(idLiv1);
    });

    $("#settoreservizio_2Edit").change(function (e) {
        $("#settoreservizio_3Edit").html("");
        var value = $("#settoreservizio_2Edit").val();
        var idLiv1 = $('#settoreservizio_2Edit option[value="' + value + '"]').attr(
            "id"
        );
        loadLiv2Edit(idLiv1);
    });

    $("#settoreservizio_3").change(function (e) {
        //   $("#settoreservizio_2 option").removeAttr("selected");
        $("#settoreservizio_4").html("");
        var value = $("#settoreservizio_3").val();
        var idLiv0 = $('#settoreservizio_3 option[value="' + value + '"]').attr(
            "id"
        );
        loadLiv3(idLiv0);
    });

    $("#settoreservizio_3Edit").change(function (e) {
        $("#settoreservizio_4Edit").html("");
        //   $("#settoreservizio_2 option").removeAttr("selected");
        var value = $("#settoreservizio_3Edit").val();
        var idLiv0 = $('#settoreservizio_3Edit option[value="' + value + '"]').attr(
            "id"
        );
        loadLiv3Edit(idLiv0);
    });

    $("#settoreservizio_4").change(function (e) {
        var value = $("#settoreservizio_4").val();
        var idLiv0 = $('#settoreservizio_4 option[value="' + value + '"]').attr(
            "id"
        );
        //            loadLiv3(idLiv0);
    });

    $("#btnAggiungiInput").click(function (e) {
        if ($("#infoAForm").valid())
            popolateInputFields();
    });

    $("#btnAggiungiOutput").click(function (e) {
        if ($("#infoAForm").valid()) {
            popolateOutputFields();
            blanckOutputFields();
        }
    });

    $("#btnAggiungiInputEdit").click(function (e) {
        if ($("#infoAForm").valid()) {
            var nome = $("#nomeInputRichiestiEdit").val();
            var tipo = $("#tipoInputRichiestiEdit").val();
            var doc = $("#docRifInputRichiestiEdit").val();
            var numberRow = $("#numberOfRowInputEdit").val();
            $("#nomeInput_" + numberRow).html(nome);
            $("#tipoInput_" + numberRow).html(tipo);
            $("#documInput_" + numberRow).html(doc);
            $("#nomeInputRichiestiEdit").val("");
            //        //        $("#ruoloOrganizzModalEdit").val("");
            $("#tipoInputRichiestiEdit").val("");
            $("#docRifInputRichiestiEdit").val("");
            $("#modalInputRichiestiEdit").modal("hide");
        }
    });

    $("#btnAggiungiOutputEdit").click(function (e) {
        var nome = $("#nomeOutputProdottiEdit").val();
        var tipo = $("#tipoOutputProdottiEdit").val();
        var numberRow = $("#numberOfRowOutputEdit").val();
        $("#nomeOutput_" + numberRow).html(nome);
        $("#tipoOutput_" + numberRow).html(tipo);
        //$("#nomeOutputProdottiEdit").val("");
        //        //        $("#ruoloOrganizzModalEdit").val("");
        //$("#tipoOutputProdottiEdit").val("");
        // $("#modalOutputProdottiEdit").modal("hide");
    });

    $("#btnAggiungiOutputEdit").click(function (e) {
        var nome = $("#nomeOutputProdottiEdit").val();
        var tipo = $("#tipoOutputProdottiEdit").val();
        var numberRow = $("#numberOfRowOutputEdit").val();
        $("#nomeOutput_" + numberRow).html(nome);
        $("#tipoOutput_" + numberRow).html(tipo);
        //$("#nomeOutputProdottiEdit").val("");
        //        //        $("#ruoloOrganizzModalEdit").val("");
        //$("#tipoOutputProdottiEdit").val("");
        $("#modalOutputProdottiEdit").modal("hide");
    });

    $("#btnCanaleErogazione").click(function (e) {
        var valid = $("#formCanaleErogazione").valid();
        if (valid) {
            popolateCanaliErogazione();
            $("#tableCanaliErogazione").slideDown();
            $("#modalCanaliErogazione").modal("hide");
        }
    });

    $("#btnCanaleErogazioneEdit").click(function (e) {
        var numberInput = $("#containerAllInputEdit :input:visible").length;
        var input = $("#containerAllInputEdit :input:visible");

        $.map(input, function (val, i) {
            if ($("#" + val.id).is("select")) {
                var id = $("#" + val.id).attr("id");

                var idInput = id.substring(0, id.length - 4);
                var valueText = val.value == null || val.value == "" ? " " : val.value;
                $("#" + idInput + "_" + $("#numberOfRowErogCan").val()).html(valueText);
                $("#" + idInput + "_" + $("#numberOfRowErogCan").val()).attr(
                    "identifier",
                    $("#" + val.id)
                    .children(":selected")
                    .attr("id")
                );

                //            var selected = $("#tipoCanaleErogEdit").children(":selected").attr("id");
                //            showFieldsInputEdit(selected);
            } else {
                var id = $("#" + val.id).attr("id");

                var idInput = id.substring(0, id.length - 4);
                var valueText = val.value == null || val.value == "" ? " " : val.value;
                $("#" + idInput + "_" + $("#numberOfRowErogCan").val()).html(valueText);
                //            var selected = $("#tipoCanaleErogEdit").children(":selected").attr("id");
                //            showFieldsInputEdit(selected);
            }
        });
        $("#modalCanaliErogazioneEdit").modal("hide");
    });

    $("#btnAggiungiServizio").click(function (e) {
        if ($("#settoreservizio_1").val()) {
            popolateServiziFields();
            blankFieldsServizi();
            $("#tableSettori").slideDown();
        }
    });

    $("#regioneCoperturaGeog").change(function (e) {
        $("#provCoperturaGeog").html("");
        $("#cittaCoperturaGeog").html("");
        var selector = String.format('#regioneCoperturaGeog option[value="{0}"]', $(this).val())
        var idRegione = $(selector).attr("id");
        getProvCopert(idRegione);
    });

    $("#regioneCoperturaGeogEdit").change(function (e) {
        $("#provCoperturaGeogEdit").html("");
        $("#cittaCoperturaGeogEdit").html("");
        var idRegione = $(
            '#regioneCoperturaGeogEdit option[value="' + $(this).val() + '"]'
        ).attr("id");
        getProvCopertEdit(idRegione);
    });

    $("#provCoperturaGeog").change(function (e) {
        $("#cittaCoperturaGeog").html("");
        var idProv = $(
            '#provCoperturaGeog option[value="' + $(this).val() + '"]'
        ).attr("id");
        getCittaCopert(idProv);
    });

    $("#provCoperturaGeogEdit").change(function (e) {
        $("#cittaCoperturaGeogEdit").html("");
        var idProv = $(
            '#provCoperturaGeogEdit option[value="' + $(this).val() + '"]'
        ).attr("id");
        getCittaCopertEdit(idProv);
    });

    $("#btnAggiungiGeog").click(function () {
        if ($("#infoAForm").valid()) {
            popolateFieldsCopertGeog();
            blankFieldsGeog();
            $("#modalGeog").modal("hide");
        }
    });

    $("#btnEditGeog").click(function () {
        var regione = $("#regioneCoperturaGeogEdit").val();
        var provincia = $("#provCoperturaGeogEdit").val();
        var citta = $("#cittaCoperturaGeogEdit").val();
        var number = $("#numberRowCopertGeog").val();
        var idRegione = $("#regioneCoperturaGeogEdit")
            .children(":selected")
            .attr("id");
        var idProvincia = $("#provCoperturaGeogEdit")
            .children(":selected")
            .attr("id");
        var idCitta = $("#cittaCoperturaGeogEdit")
            .children(":selected")
            .attr("id");
        $("#regione_" + number).html(regione);
        $("#provincia_" + number).html(provincia);
        $("#citta_" + number).html(citta);

        $("#regione_" + number).attr("identifier", idRegione);
        $("#provincia_" + number).attr("identifier", idProvincia);
        $("#citta_" + number).attr("identifier", idCitta);
        $("#regioneCoperturaGeogEdit").val("");
        $("#provCoperturaGeogEdit").val("");
        $("#cittaCoperturaGeogEdit").val("");
        $("#modalGeogEdit").modal("hide");
    });

    $("#btnAggiungiCosto").click(function () {
        if (validateCost()) {
            popolateCostoField();
            blanckInputCosto();
        }
    });

    $("#btnModificaCosto").click(function () {
        if (validateCostEdit()) {
            var costoEuroEdit = $("#costoEuroEdit").val();
            var descrizioneCostiEdit = $("#descrizioneCostiEdit").val();
            var numberOfRowCosto = $("#numberOfRowCosto").val();
            $("#" + numberOfRowCosto + "_costoEuro").html(costoEuroEdit);
            $("#" + numberOfRowCosto + "_descrCosto").html(descrizioneCostiEdit);
            $("#costoEuroEdit").val("");
            $("#descrizioneCostiEdit").val("");
            $("#modalCostoEdit").modal("hide");
        }
    });

    $("#btnAggiungiTemp").click(function (e) {
        if (validateCopertGeogToAdd()) {
            var fieldObj = getFieldTemp();
            popolateTableCopertTemporale(fieldObj);
        }
    })
    $("#btnEditTemp").click(function (e) {
        if (validateCopertGeogToAddEdit()) {
            var fieldObj = getFieldTempEdit();
            var row = $("#rowCopertGeog").val()
            editTableCopertGeog(fieldObj, row);
            $("#modalCopertTempEdit").modal("hide");
            blankFieldCoperGeogEdit();
        }
    })

    popolateServiceStatus();
});

function getFieldTemp() {
    var obj = {}
    var giorni = []
    obj.dataDa = $("#dataDaTemp").val()
    obj.dataDaOra = $("#dataDaTempOra").val()
    obj.dataA = $("#dataATemp").val()
    obj.dataAOra = $("#dataATempOra").val()
    obj.giorni = []
    $.each($('input[name="giornoCheck[]"]:checked'), function (i, val) {
        obj.giorni.push($(val).attr("id"));
    });
    return obj
}

function getFieldTempEdit() {
    var obj = {}
    var giorni = []
    obj.dataDa = $("#dataDaTempEdit").val()
    obj.dataDaOra = $("#dataDaTempOraEdit").val()
    obj.dataA = $("#dataATempEdit").val()
    obj.dataAOra = $("#dataATempOraEdit").val()
    obj.giorni = []
    $.each($('input[name="giornoCheckEdit[]"]:checked'), function (i, val) {
        obj.giorni.push($(val).attr("id"));
    });
    return obj
}

function popolateTableCopertTemporale(obj) {
    var container = $("#popolateCopertTemporaleDiv");
    var numberRowTableParziale = container.children().attr("id")

    if (numberRowTableParziale == undefined)
        numberRowTableParziale = 0
    else
        numberRowTableParziale++
        var giorni = obj.giorni + ""
    var html = '<tr id="' + numberRowTableParziale + '"><td>'
    if (obj.dataDa)
        html += '<span class="fa fa-ellipsis-h" style="margin-right:5px!important;margin-left:5px!important;font-size:15px !important"></span><span> Dal <span id="giorniDaCopert_' + numberRowTableParziale + '">' + obj.dataDa + '</span> Al <span id="giorniACopert_' + numberRowTableParziale + '">' + obj.dataA + '</span></span>';
    if (obj.dataDaOra)
        html += '<span class="fa fa-ellipsis-h" style="margin-right:5px!important;margin-left:5px!important;font-size:15px !important"></span><span>Dalle <span id="giorniDaCopertOra_' + numberRowTableParziale + '">' + obj.dataDaOra + '</span> Alle <span id="giorniACopertOra_' + numberRowTableParziale + '">' + obj.dataAOra + '</span></span>';
    if (giorni.length > 0)
        html += '<span class="fa fa-ellipsis-h" style="margin-right:5px!important;margin-left:5px!important;font-size:15px !important"></span><span><span id="giorniCopert_' + numberRowTableParziale + '">' + giorni + '</span></span>';
    html += '</td>';
    html += '<td><button type="button" onClick="editRowCoperTemp(' +
        numberRowTableParziale +
        ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowCopertTemp(' +
        numberRowTableParziale +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';
    html += '</tr>';
    container.prepend(html)
    $("#tableCoperturTempor").show();
    blankFieldCoperGeog();
    $("#modalCopertTemp").modal("hide")
}

function deleteRowCopertTemp(id) {
    $("#popolateCopertTemporaleDiv #" + id).remove();
}

function blankFieldCoperGeogEdit() {
    $("#dataDaTempEdit").val("")
    $("#dataDaTempOraEdit").val("")
    $("#dataATempEdit").val("")
    $("#dataATempOraEdit").val("")
    $.each($('input[name="giornoCheckEdit[]"]:checked'), function (i, val) {
        $(val).prop('checked', false);
    });
}

function blankFieldCoperGeog() {
    $("#dataDaTemp").val("")
    $("#dataDaTempOra").val("")
    $("#dataATemp").val("")
    $("#dataATempOra").val("")
    $.each($('input[name="giornoCheck[]"]:checked'), function (i, val) {
        $(val).prop('checked', false);
    });
}

function editRowCoperTemp(numebrRowCopertGeog) {
    $("#rowCopertGeog").val(numebrRowCopertGeog)
    $("#modalCopertTempEdit").modal("show");
    $("#dataDaTempEdit").datepicker("setDate", $("#giorniDaCopert_" + numebrRowCopertGeog).html())
    $("#dataDaTempOraEdit").val($("#giorniDaCopertOra_" + numebrRowCopertGeog).html())
    $("#dataATempEdit").datepicker("setDate", $("#giorniACopert_" + numebrRowCopertGeog).html())
    $("#dataATempOraEdit").val($("#giorniACopertOra_" + numebrRowCopertGeog).html())
    var giorni = $("#giorniCopert_" + numebrRowCopertGeog).html().split(",")

    $.each($('input[name="giornoCheckEdit[]"]'), function (i, val) {
        for (var a = 0; a < giorni.length; a++) {
            if ($(val).attr("id") == giorni[a])
                $(val).prop('checked', true);
        }
    });
    // $("#dataATemp").datepicker("setDate", end.substring(0, end.lastIndexOf("-")))
    // $("#dataATempOra").val(end.substring(end.lastIndexOf("-") + 1, end.length))
}

function editTableCopertGeog(obj, row) {
    $("#popolateCopertTemporaleDiv #" + row).remove();
    popolateTableCopertTemporale(obj)
    // $("#giorniDaCopert_" + row).html(obj.dataDa)
    // $("#giorniDaCopertOra_" + row).html(obj.dataDaOra)
    // $("#giorniACopert_" + row).html(obj.dataA)
    // $("#giorniACopertOra_" + row).html(obj.dataAOra)
    // $("#giorniCopert_" + row).html(obj.giorni + "")
}

function popolateChannelsFromService(templateChannel) {
    $.each(templateChannel, function (i, field) {
        switch (i) {
            case "otherElectronicChannels":
                var objInput = [];
                $.each(field, function (index, value) {
                    var idType = value.type;
                    var idSubType = value.subType;
                    var labelType;
                    var labelSubType;
                    objInput.push(JSON.parse('{"name":"Altro telematico"}'));

                    var inputCanaliErogazioneType =
                        '{"identifier": "' + idType + '", "language": "it"}';
                    var name = "sgichannel"
                    var collection = "channels/"
                    var query = "getDescriptionByIdentifier?identifier=" + inputCanaliErogazioneType;
                    var environment = ""
                    var url = urlComposer(name, collection, query, environment);

                    var objData = callService("GET", url);
                    if (objData.success) {
                        var data = objData.data
                        var json = idType + '":"' + data.response;
                        // JSON.parse(json)
                        objInput.push(
                            JSON.parse(
                                '{"description":"' +
                                data.response +
                                '","id":"' +
                                idType +
                                '"}'
                            )
                        );
                    } else {

                    }

                    // $.ajax({
                    //         type: "GET",
                    //         // data: inputCanaliErogazione,
                    //         async: false,
                    //         processData: false,
                    //         url: "https://sgichannel.xxxx/api/channels/getDescriptionByIdentifier?identifier=" +
                    //             inputCanaliErogazioneType,
                    //         success: function (data) {
                    //             var json = idType + '":"' + data.response;
                    //             // JSON.parse(json)
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"description":"' +
                    //                     data.response +
                    //                     '","id":"' +
                    //                     idType +
                    //                     '"}'
                    //                 )
                    //             );

                    //         },
                    //         error: function (data) {}
                    //     })
                    var inputCanaliErogazioneSubType =
                        '{"identifier": "' + idSubType + '", "language": "it"}';
                    var nameCanaliErogSubType = "sgichannel"
                    var collectionCanaliErogSubType = "channels/"
                    var queryCanaliErogSubType = "getDescriptionByIdentifier?identifier=" + inputCanaliErogazioneType;
                    var environmentCanaliErogSubType = ""
                    var urlCanaliErogSubType = urlComposer(nameCanaliErogSubType, collectionCanaliErogSubType, queryCanaliErogSubType, environmentCanaliErogSubType);

                    var objData = callService("GET", urlCanaliErogSubType);
                    if (objData.success) {
                        var data = objData.data
                        objInput.push(
                            JSON.parse(
                                '{"description":"' +
                                data.response +
                                '","id":"' +
                                idSubType +
                                '"}'
                            )
                        );
                        objInput.push(
                            JSON.parse(
                                '{"id":"accessReferenceCanErog","description":"' +
                                value.accessReference.description +
                                '"}'
                            )
                        );
                        var idCampi = [
                            "tipoCanaleErog",
                            "tipoAltroCanale",
                            "sottotipoAltroCanale",
                            "accessReferenceCanErog"
                        ];
                        popolateCanaliErogazioneService(
                            templateChannel,
                            objInput,
                            idCampi
                        );
                        objInput = []
                    } else {

                    }
                    // $.ajax({
                    //         type: "GET",
                    //         // data: inputCanaliErogazione,
                    //         async: false,
                    //         processData: false,
                    //         url: "https://sgichannel.xxxx/api/channels/getDescriptionByIdentifier?identifier=" +
                    //             inputCanaliErogazioneSubType,
                    //         success: function (data) {
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"description":"' +
                    //                     data.response +
                    //                     '","id":"' +
                    //                     idSubType +
                    //                     '"}'
                    //                 )
                    //             );
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"id":"accessReferenceCanErog","description":"' +
                    //                     value.accessReference.description +
                    //                     '"}'
                    //                 )
                    //             );

                    //         },
                    //         error: function (data) {}
                    //     })
                    //     .done(function (data) {
                    //         var idCampi = [
                    //             "tipoCanaleErog",
                    //             "tipoAltroCanale",
                    //             "sottotipoAltroCanale",
                    //             "accessReferenceCanErog"
                    //         ];
                    //         popolateCanaliErogazioneService(
                    //             templateChannel,
                    //             objInput,
                    //             idCampi
                    //         );
                    //         objInput = []
                    //     })
                });
                $("#tableCanaliErogazione").show();

                break;
            case "webApplications":




                var objInput = [];
                $.each(field, function (index, value) {
                    var idType = value.type;
                    var idSubType = value.subType;
                    var labelType;
                    var labelSubType;
                    objInput.push(JSON.parse('{"name":"Sito Web"}'));


                    var inputCanaliErogazioneType =
                        '{"identifier":"' + idType + '", "language": "it"}';

                    var nameCanaliErogType = "sgichannel"
                    var collectionCanaliErogType = "channels/"
                    var queryCanaliErogType = "getDescriptionByIdentifier?identifier=" + inputCanaliErogazioneType;
                    var environmentCanaliErogType = ""
                    var urlCanaliErogType = urlComposer(nameCanaliErogType, collectionCanaliErogType, queryCanaliErogType, environmentCanaliErogType);

                    var objData = callService("GET", urlCanaliErogType);
                    if (objData.success) {
                        var data = objData.data

                        objInput.push(
                            JSON.parse(
                                '{"description":"' +
                                data.response +
                                '","id":"' +
                                idType +
                                '"}'
                            )
                        );
                        objInput.push(
                            JSON.parse(
                                '{"id":"urlWebApplErogCan","description":"' +
                                value.url +
                                '"}'
                            )
                        );
                        var idCampi = [
                            "tipoCanaleErog",
                            "tipoCanaleSitoWeb",
                            "urlWebApplErogCan"
                        ];
                        popolateCanaliErogazioneService(
                            templateChannel,
                            objInput,
                            idCampi
                        );
                        objInput = []

                    } else {

                    }
                    // $.ajax({
                    //         type: "GET",
                    //         // data: inputCanaliErogazione,
                    //         async: false,
                    //         processData: false,
                    //         url: "https://sgichannel.xxxx/api/channels/getDescriptionByIdentifier?identifier=" +
                    //             inputCanaliErogazioneType,
                    //         success: function (data) {
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"description":"' +
                    //                     data.response +
                    //                     '","id":"' +
                    //                     idType +
                    //                     '"}'
                    //                 )
                    //             );
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"id":"urlWebApplErogCan","description":"' +
                    //                     value.url +
                    //                     '"}'
                    //                 )
                    //             );

                    //         },
                    //         error: function (data) {}
                    //     })
                    //     .done(function (data) {
                    //         var idCampi = [
                    //             "tipoCanaleErog",
                    //             "tipoCanaleSitoWeb",
                    //             "urlWebApplErogCan"
                    //         ];
                    //         popolateCanaliErogazioneService(
                    //             templateChannel,
                    //             objInput,
                    //             idCampi
                    //         );
                    //         objInput = []
                    //     })
                    //     .fail(function () {});
                });
                $("#tableCanaliErogazione").show();
                break;


            case "phones":
                var objInput = [];
                $.each(field, function (index, value) {
                    var idType = value.type;
                    var idSubType = value.subType;
                    var labelType;
                    var labelSubType;
                    objInput.push(JSON.parse('{"name":"Telefono"}'));
                    var inputCanaliErogazioneType =
                        '{"identifier": "' + idType + '", "language": "it"}';
                    var nameCanaliErogType = "sgichannel"
                    var collectionCanaliErogType = "channels/"
                    var queryCanaliErogType = "getDescriptionByIdentifier?identifier=" + inputCanaliErogazioneType;
                    var environmentCanaliErogType = ""
                    var urlCanaliErogType = urlComposer(nameCanaliErogType, collectionCanaliErogType, queryCanaliErogType, environmentCanaliErogType);
                    var objData = callService("GET", urlCanaliErogType);
                    if (objData.success) {
                        var data = objData.data
                        objInput.push(
                            JSON.parse(
                                '{"description":"' +
                                data.response +
                                '","id":"' +
                                idType +
                                '"}'
                            )
                        );
                        objInput.push(
                            JSON.parse(
                                '{"id":"phoneNumber","description":"' +
                                value.phoneNumber +
                                '"}'
                            )
                        );
                        var idCampi = [
                            "tipoCanaleErog",
                            "tipoCanaleTelefonico",
                            "phoneNumberErogCan"
                        ];
                        popolateCanaliErogazioneService(
                            templateChannel,
                            objInput,
                            idCampi
                        );
                        objInput = []

                    } else {

                    }
                    // $.ajax({
                    //         type: "GET",
                    //         // data: inputCanaliErogazione,
                    //         async: false,
                    //         processData: false,
                    //         url: "https://sgichannel.xxxx/api/channels/getDescriptionByIdentifier?identifier=" +
                    //             inputCanaliErogazioneType,
                    //         success: function (data) {
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"description":"' +
                    //                     data.response +
                    //                     '","id":"' +
                    //                     idType +
                    //                     '"}'
                    //                 )
                    //             );
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"id":"phoneNumber","description":"' +
                    //                     value.phoneNumber +
                    //                     '"}'
                    //                 )
                    //             );
                    //         },
                    //         error: function (data) {}
                    //     })
                    //     .done(function (data) {
                    //         var idCampi = [
                    //             "tipoCanaleErog",
                    //             "tipoCanaleTelefonico",
                    //             "phoneNumberErogCan"
                    //         ];
                    //         popolateCanaliErogazioneService(
                    //             templateChannel,
                    //             objInput,
                    //             idCampi
                    //         );
                    //         objInput = []
                    //     })
                    //     .fail(function () {});
                });
                $("#tableCanaliErogazione").show();


                break;

            case "emails":
                var objInput = [];
                $.each(field, function (index, value) {
                    var idType = value.type;
                    var idSubType = value.subType;
                    var labelType;
                    var labelSubType;
                    objInput.push(JSON.parse('{"name":"Email"}'));


                    var inputCanaliErogazioneType =
                        '{"identifier": "' + idType + '", "language": "it"}';
                    var nameCanaliErogType = "sgichannel"
                    var collectionCanaliErogType = "channels/"
                    var queryCanaliErogType = "getDescriptionByIdentifier?identifier=" + inputCanaliErogazioneType;
                    var environmentCanaliErogType = ""
                    var urlCanaliErogType = urlComposer(nameCanaliErogType, collectionCanaliErogType, queryCanaliErogType, environmentCanaliErogType);
                    var objData = callService("GET", urlCanaliErogType);
                    if (objData.success) {
                        var data = objData.data
                        objInput.push(
                            JSON.parse(
                                '{"description":"' +
                                data.response +
                                '","id":"' +
                                idType +
                                '"}'
                            )
                        );
                        objInput.push(
                            JSON.parse(
                                '{"id":"email","description":"' +
                                value.email +
                                '"}'
                            )
                        );
                        var idCampi = [
                            "tipoCanaleErog",
                            "tipoCanaleEmail",
                            "emailErogCan"
                        ];
                        popolateCanaliErogazioneService(
                            templateChannel,
                            objInput,
                            idCampi
                        );
                        objInput = []
                    } else {

                    }
                    // $.ajax({
                    //         type: "GET",
                    //         // data: inputCanaliErogazione,
                    //         async: false,
                    //         processData: false,
                    //         url: "https://sgichannel.xxxx/api/channels/getDescriptionByIdentifier?identifier=" +
                    //             inputCanaliErogazioneType,
                    //         success: function (data) {
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"description":"' +
                    //                     data.response +
                    //                     '","id":"' +
                    //                     idType +
                    //                     '"}'
                    //                 )
                    //             );
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"id":"email","description":"' +
                    //                     value.email +
                    //                     '"}'
                    //                 )
                    //             );
                    //         },
                    //         error: function (data) {}
                    //     })
                    //     .done(function (data) {
                    //         var idCampi = [
                    //             "tipoCanaleErog",
                    //             "tipoCanaleEmail",
                    //             "emailErogCan"
                    //         ];
                    //         popolateCanaliErogazioneService(
                    //             templateChannel,
                    //             objInput,
                    //             idCampi
                    //         );
                    //         objInput = []
                    //     })
                    //     .fail(function () {});
                });
                $("#tableCanaliErogazione").show();


                break;
            case "offlineChannels":
                var objInput = [];
                $.each(field, function (index, value) {
                    console.log(value)
                    var idType = value.type;
                    var idSubType = value.subType;
                    var labelType;
                    var labelSubType;
                    objInput.push(JSON.parse('{"name":"Non Telematico"}'));


                    var inputCanaliErogazioneType =
                        '{"identifier": "' + idType + '", "language": "it"}';
                    var nameCanaliErogType = "sgichannel"
                    var collectionCanaliErogType = "channels/"
                    var queryCanaliErogType = "getDescriptionByIdentifier?identifier=" + inputCanaliErogazioneType;
                    var environmentCanaliErogType = ""
                    var urlCanaliErogType = urlComposer(nameCanaliErogType, collectionCanaliErogType, queryCanaliErogType, environmentCanaliErogType);

                    var objData = callService("GET", urlCanaliErogType);
                    if (objData.success) {
                        var data = objData.data
                        var json = idType + '":"' + data.response;
                        // JSON.parse(json)
                        objInput.push(
                            JSON.parse(
                                '{"description":"' +
                                data.response +
                                '","id":"' +
                                idType +
                                '"}'
                            )
                        );

                    } else {

                    }

                    // $.ajax({
                    //         type: "GET",
                    //         // data: inputCanaliErogazione,
                    //         async: false,
                    //         processData: false,
                    //         url: "https://sgichannel.xxxx/api/channels/getDescriptionByIdentifier?identifier=" +
                    //             inputCanaliErogazioneType,
                    //         success: function (data) {
                    //             var json = idType + '":"' + data.response;
                    //             // JSON.parse(json)
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"description":"' +
                    //                     data.response +
                    //                     '","id":"' +
                    //                     idType +
                    //                     '"}'
                    //                 )
                    //             );
                    //         },
                    //         error: function (data) {}
                    //     })


                    var inputCanaliErogazioneSubType =
                        '{"identifier": "' + idSubType + '", "language": "it"}';
                    var nameCanaliErogTypeSub = "sgichannel"
                    var collectionCanaliErogTypeSub = "channels/"
                    var queryCanaliErogTypeSub = "getDescriptionByIdentifier?identifier=" + inputCanaliErogazioneSubType;
                    var environmentCanaliErogTypeSub = ""
                    var urlCanaliErogTypeSub = urlComposer(nameCanaliErogTypeSub, collectionCanaliErogTypeSub, queryCanaliErogTypeSub, environmentCanaliErogTypeSub);

                    var objData = callService("GET", urlCanaliErogTypeSub);
                    if (objData.success) {
                        var data = objData.data;
                        objInput.push(
                            JSON.parse(
                                '{"description":"' +
                                data.response +
                                '","id":"' +
                                idSubType +
                                '"}'
                            )
                        );
                        objInput.push(
                            JSON.parse(
                                '{"id":"locationNameErogCan","description":"' + value.locationName.description + '"}'));


                        objInput.push(
                            JSON.parse('{"id":"streetTypeErogCan","description":"' + value.streetType + '"}'));
                        objInput.push(
                            JSON.parse('{"id":"streetNameErogCan","description":"' + value.streetName + '"}'));
                        objInput.push(
                            JSON.parse('{"id":"numberErogCan","description":"' + value.number + '"}'));
                        objInput.push(
                            JSON.parse('{"id":"cityErgoCan","description":"' + value.city + '"}'));
                        objInput.push(
                            JSON.parse('{"id":"postCodeErogCan","description":"' + value.postCode + '"}'));
                        objInput.push(
                            JSON.parse('{"id":"typeGeometryErogCan","description":"' + value.geometry.type + '"}'));
                        objInput.push(
                            JSON.parse('{"id":"latitudeCanErog","description":"' + value.geometry.latitude + '"}'));
                        objInput.push(
                            JSON.parse('{"id":"longitudeCanErog","description":"' + value.geometry.longitude + '"}'));

                        var idCampi = [
                            "tipoCanaleErog",
                            "tipoCanaleNonTelematico",
                            "sottotipoCanaleNonTelematico",
                            "locationNameErogCan",
                            "streetTypeErogCan",
                            "streetNameErogCan",
                            "numberErogCan",
                            "cityErgoCan",
                            "postCodeErogCan",
                            "typeGeometryErogCan",

                            "latitudeCanErog",
                            "longitudeCanErog"


                        ];
                        popolateCanaliErogazioneService(
                            templateChannel,
                            objInput,
                            idCampi
                        );
                        objInput = []

                    } else {

                    }
                    // $.ajax({
                    //         type: "GET",
                    //         // data: inputCanaliErogazione,
                    //         async: false,
                    //         processData: false,
                    //         url: "https://sgichannel.xxxx/api/channels/getDescriptionByIdentifier?identifier=" +
                    //             inputCanaliErogazioneSubType,
                    //         success: function (data) {
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"description":"' +
                    //                     data.response +
                    //                     '","id":"' +
                    //                     idSubType +
                    //                     '"}'
                    //                 )
                    //             );
                    //             objInput.push(
                    //                 JSON.parse(
                    //                     '{"id":"locationNameErogCan","description":"' + value.locationName.description + '"}'));


                    //             objInput.push(
                    //                 JSON.parse('{"id":"streetTypeErogCan","description":"' + value.streetType + '"}'));
                    //             objInput.push(
                    //                 JSON.parse('{"id":"streetNameErogCan","description":"' + value.streetName + '"}'));
                    //             objInput.push(
                    //                 JSON.parse('{"id":"numberErogCan","description":"' + value.number + '"}'));
                    //             objInput.push(
                    //                 JSON.parse('{"id":"cityErgoCan","description":"' + value.city + '"}'));
                    //             objInput.push(
                    //                 JSON.parse('{"id":"postCodeErogCan","description":"' + value.postCode + '"}'));
                    //             objInput.push(
                    //                 JSON.parse('{"id":"typeGeometryErogCan","description":"' + value.geometry.type + '"}'));
                    //             objInput.push(
                    //                 JSON.parse('{"id":"latitudeCanErog","description":"' + value.geometry.latitude + '"}'));
                    //             objInput.push(
                    //                 JSON.parse('{"id":"longitudeCanErog","description":"' + value.geometry.longitude + '"}'));


                    //         },
                    //         error: function (data) {}
                    //     })
                    //     .done(function (data) {
                    //         var idCampi = [
                    //             "tipoCanaleErog",
                    //             "tipoCanaleNonTelematico",
                    //             "sottotipoCanaleNonTelematico",
                    //             "locationNameErogCan",
                    //             "streetTypeErogCan",
                    //             "streetNameErogCan",
                    //             "numberErogCan",
                    //             "cityErgoCan",
                    //             "postCodeErogCan",
                    //             "typeGeometryErogCan",

                    //             "latitudeCanErog",
                    //             "longitudeCanErog"


                    //         ];
                    //         popolateCanaliErogazioneService(
                    //             templateChannel,
                    //             objInput,
                    //             idCampi
                    //         );
                    //         objInput = []

                    //     })
                    //     .fail(function () {});
                });
                $("#tableCanaliErogazione").show();

                break;

        }
        console.log(field);
    });
}

function popolateCanaliErogazioneService(templateLoad, objInput, idCampi) {
    var number = $("#divPopolateCanaliErogazione")
        .children()
        .attr("id");
    number++;
    var container = $("#divPopolateCanaliErogazione");
    var html = "";

    // var rowFormGroup = '<div class="form-group row" id="' + number + '">';
    var buttonAction =
        '<td><button type="button" onClick="editRowCanErog(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowCanErog(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';

    var tipo =
        '<tr id="' +
        number +
        '"><td id="nomeOutput_' +
        number +
        '"><span id="tipoCanaleErog' +
        "_" +
        number +
        '" identifier="05" >' +
        objInput[0].name +
        "</span></td><td>";
    var closeInformazione = "</td>";
    // a++;
    // // html += rowFormGroup;
    // // html += labelNome;
    // //    html+=col
    html += tipo;
    // // html += informazione;
    // // numberInput++;
    $.each(objInput, function (key, value) {
        if (key != 0) {
            html +=
                "<div style='margin-left:0px' class='row'><span id='" +
                idCampi[key] +
                "_" +
                number +
                "'  identifier='" +
                value.id +
                "'>" +
                value.description +
                "</span> </div>";
            value = "";
        }
    });

    //  html+=closeDiv

    html += closeInformazione;
    html += buttonAction;

    container.prepend(html);
}

function showFieldsInput(inputSelected) {
    switch (inputSelected) {
        case "01":
            var container = $("#containerInput");
            $("#containerInputWebApplication").slideUp();

            $("#containerInputPhones").slideUp();

            $("#containerInputEmails").slideUp();

            $("#containerInputOtherElectronicChannels").slideUp();

            $("#containerInputOfflineChannels").slideDown();

            //            $.get('templateLoadChannels/offlineChannels.html',function(result){
            //                container.hide("slow")
            //                container.html('');
            //                container.append(result).show("slow");
            //            })
            getChildren("tipoCanaleNonTelematico", inputSelected);
            break;
        case "02":
            var container = $("#containerInput");
            $("#containerInputOfflineChannels").slideUp();

            $("#containerInputPhones").slideUp();

            $("#containerInputEmails").slideUp();

            $("#containerInputOtherElectronicChannels").slideUp();

            $("#containerInputWebApplication").slideDown();
            //            $.get('templateLoadChannels/webApplications.html',function(result){
            //                container.hide("slow")
            //                container.html('');
            //                container.append(result).show("slow");
            //            })
            getChildren("tipoCanaleSitoWeb", inputSelected);

            break;
        case "03":
            var container = $("#containerInput");
            $("#containerInputOfflineChannels").slideUp();

            $("#containerInputWebApplication").slideUp();

            $("#containerInputEmails").slideUp();

            $("#containerInputOtherElectronicChannels").slideUp();

            $("#containerInputPhones").slideDown();
            //            $.get('templateLoadChannels/phones.html',function(result){
            //                container.hide("slow")
            //                container.html('');
            //                container.append(result).show("slow");
            //            })
            getChildren("tipoCanaleTelefonico", inputSelected);

            break;
        case "04":
            var container = $("#containerInput");
            $("#containerInputOfflineChannels").slideUp();

            $("#containerInputWebApplication").slideUp();

            $("#containerInputPhones").slideUp();

            $("#containerInputOtherElectronicChannels").slideUp();

            $("#containerInputEmails").slideDown();
            //            $.get('templateLoadChannels/emails.html',function(result){
            //                container.hide("slow")
            //                container.html('');
            //                container.append(result).show("slow");
            //            })
            getChildren("tipoCanaleEmail", inputSelected);

            break;
        case "05":
            var container = $("#containerInput");
            $("#containerInputOfflineChannels").slideUp();

            $("#containerInputWebApplication").slideUp();

            $("#containerInputPhones").slideUp();

            $("#containerInputEmails").slideUp();

            $("#containerInputOtherElectronicChannels").slideDown();
            //            $.get('templateLoadChannels/otherElectronicChannels.html',function(result){
            //                container.hide("slow")
            //                container.html('');
            //                container.append(result).show("slow");
            //            })
            getChildren("tipoAltroCanale", inputSelected);

            break;
    }
}

function showFieldsInputEdit(inputSelected) {
    switch (inputSelected) {
        case "01":
            var container = $("#containerInputEdit");
            $("#containerInputWebApplicationEdit").slideUp();

            $("#containerInputPhonesEdit").slideUp();

            $("#containerInputEmailsEdit").slideUp();

            $("#containerInputOtherElectronicChannelsEdit").slideUp();

            $("#containerInputOfflineChannelsEdit").slideDown();

            //            $.get('templateLoadChannels/offlineChannelsEdit.html',function(result){
            //                container.hide("slow")
            //                container.append(result).show("slow");
            //            })
            getChildrenEdit("tipoCanaleNonTelematicoEdit", inputSelected);
            break;
        case "02":
            var container = $("#containerInputEdit");
            $("#containerInputOfflineChannelsEdit").slideUp();

            $("#containerInputPhonesEdit").slideUp();

            $("#containerInputEmailsEdit").slideUp();

            $("#containerInputOtherElectronicChannelsEdit").slideUp();

            $("#containerInputWebApplicationEdit").slideDown();
            //            $.get('templateLoadChannels/webApplicationsEdit.html',function(result){
            //                container.hide("slow")
            //                container.append(result).show("slow");
            //            })
            getChildrenEdit("tipoCanaleSitoWebEdit", inputSelected);

            break;
        case "03":
            var container = $("#containerInputEdit");
            $("#containerInputOfflineChannelsEdit").slideUp();

            $("#containerInputWebApplicationEdit").slideUp();

            $("#containerInputEmailsEdit").slideUp();

            $("#containerInputOtherElectronicChannelsEdit").slideUp();

            $("#containerInputPhonesEdit").slideDown();
            //            $.get('templateLoadChannels/phonesEdit.html',function(result){
            //                container.hide("slow")
            //                container.append(result).show("slow");
            //            })
            getChildrenEdit("tipoCanaleTelefonicoEdit", inputSelected);

            break;
        case "04":
            var container = $("#containerInputEdit");
            //            $.get('templateLoadChannels/emailsEdit.html',function(result){
            //                container.hide("slow")
            //                container.append(result).show("slow");
            //            })
            $("#containerInputOfflineChannelsEdit").slideUp();

            $("#containerInputWebApplicationEdit").slideUp();

            $("#containerInputPhonesEdit").slideUp();

            $("#containerInputOtherElectronicChannelsEdit").slideUp();

            $("#containerInputEmailsEdit").slideDown();
            getChildrenEdit("tipoCanaleEmailEdit", inputSelected);

            break;
        case "05":
            var container = $("#containerInputEdit");
            //            $.get('templateLoadChannels/otherElectronicChannelsEdit.html',function(result){
            //                container.hide("slow")
            //                container.append(result).show("slow");
            //            })
            $("#containerInputOfflineChannelsEdit").slideUp();

            $("#containerInputWebApplicationEdit").slideUp();

            $("#containerInputPhonesEdit").slideUp();

            $("#containerInputEmailsEdit").slideUp();

            $("#containerInputOtherElectronicChannelsEdit").slideDown();
            getChildrenEdit("tipoAltroCanaleEdit", inputSelected);
            break;
    }




}

function blankFieldContacts() {
    $("#nomeUfficioContatti").val("");
    $("#emailContatti").val("");
    $("#telefonoContatti").val("");
    $("#sitoWebContatti").val("");
}

function blankFieldOrganizz() {
    $("#nomeOrganizz").val("");
    $("#ruoloOrganizzModal").val("");
    $("#dalOrganizz").val("");
    $("#alOrganizz").val("");
}

function loadSubTypeNonTelematico(self) {
    var id = self.find("option:selected").attr("id");
    getChildren("sottotipoCanaleNonTelematico", id);
}

function loadSubTypeNonTelematicoEdit(self) {
    var id = self.find("option:selected").attr("id");
    getChildrenEdit("sottotipoCanaleNonTelematicoEdit", id);
}

function loadSubTypeSitoWeb(self) {
    var id = self.find("option:selected").attr("id");
    //PAGOPA E PAGAM BANCARI

    getChildren("sottotipoCanaleSitoWeb", id, "containerSubTypeSitoWeb");
}

function loadSubTypeSitoWebEdit(self) {
    var id = self.find("option:selected").attr("id");
    //PAGOPA E PAGAM BANCARI

    getChildrenEdit(
        "sottotipoCanaleSitoWebEdit",
        id,
        "containerSubTypeSitoWebEdit"
    );
}

function loadSubTypeAltriCanali(self) {
    var id = self.find("option:selected").attr("id");
    //    containerSubTypeAltriCanali
    //    sottotipoAltroCanale
    getChildren("sottotipoAltroCanale", id, "containerSubTypeAltriCanali");
}

function loadSubTypeAltriCanaliEdit(self) {
    var id = self.find("option:selected").attr("id");
    //    containerSubTypeAltriCanali
    //    sottotipoAltroCanale
    getChildrenEdit(
        "sottotipoAltroCanaleEdit",
        id,
        "containerSubTypeAltriCanaliEdit"
    );
}

function loadSubTypePhone(self) {
    var id = self.find("option:selected").attr("id");
    //    containerSubTypeAltriCanali
    //    sottotipoAltroCanale
    getChildren("subtypePhonesErogCan", id);
}

function loadSubTypePhoneEdit(self) {
    var id = self.find("option:selected").attr("id");
    //    containerSubTypeAltriCanali
    //    sottotipoAltroCanale
    getChildrenEdit("subtypePhonesErogCanEdit", id);
}

function loadComponentTabOrganizzazione() {
    // defaultOrganizzazione()
    //  startWait("ruolo", "Caricamento ruoli in corso...")
    var name = "sgiroletype"
    var collection = "roles"
    var query = "";
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data;
        //$("#wait").css("display", "block");
        popolateRoles(data);
        stopWait("ruolo")
    } else {
        $("#ruoloOrganizzModal").html("");
        $("#ruoloOrganizzModalEdit").html("");
        error("Errore durante il caricamento dei ruoli")
        $("#ruoloOrganizzModal").append(
            "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
        );
        $("#ruoloOrganizzModalEdit").append(
            "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
        );
        // $("#wait").css("display", "none");

    }

    // $.ajax({
    //         dataType: "json",
    //         url: "https://sgiroletype.xxxx/api/roles",
    //         //url:'https://',
    //         success: function (data) {
    //             $("#wait").css("display", "block");

    //             popolateRoles(data);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //             //            $("#ruoloOrganizzazioni").html("");
    //             $("#ruoloOrganizzModal").html("");
    //             $("#ruoloOrganizzModalEdit").html("");
    //             //            $("#ruoloOrganizzazioni").append('<option value selected disabled>SERVIZIO NON DISPONIBILE</option>');
    //             $("#ruoloOrganizzModal").append(
    //                 "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //             $("#ruoloOrganizzModalEdit").append(
    //                 "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function defaultOrganizzazione() {
    var name = sessionStorage.getItem("description")
    var role = "titolare"
    var a = 1
    var appRows = "";
    appRows += '<tr id="' + a + '"><td id="' + a + '_organizz">';
    appRows += name;
    appRows += '</td><td id="' + a + '_ruolo">';
    appRows += role;
    appRows += '</td><td id="' + a + '_dal">';

    appRows += '</td><td id="' + a + '_al">';

    appRows +=
        '</td><td><button type="button" onClick="editRowOrganiz(' +
        a +
        ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowOrganiz(' +
        a +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';


    $("#bodyOrganizz").prepend(appRows);
    $("#tableOrg").show();

}

function popolateRoles(result) {
    //    $("#ruoloOrganizzazioni").html("");
    $("#ruoloOrganizzModal").html("");
    $("#ruoloOrganizzModalEdit").html("");
    //    $("#ruoloOrganizzazioni").append('<option value selected disabled>Seleziona un campo</option>');
    $("#ruoloOrganizzModal").append(
        "<option value selected disabled>Scegli</option>"
    );
    $("#ruoloOrganizzModalEdit").append(
        "<option value selected disabled>Scegli</option>"
    );
    $.each(result, function (i, field) {
        var z = result;
        var option =
            '<option value="' + field.value + '">' + field.value + "</option>";
        $("#ruoloOrganizzazioni").append(option);
        $("#ruoloOrganizzModal").append(option);
        $("#ruoloOrganizzModalEdit").append(option);
    });
}

function loadComponentTabInfo() {
    //startWait("info", "Caricamento tab in corso...")
    var name = "sgiserviceinputoutput"
    var collection = "serviceinputoutputs"
    var query = "?filter[where][language]=it"
    var environment = ""
    var url = urlComposer(name, collection, query, environment)

    var objData = callService("GET", url);
    if (objData.success) {
        // $("#wait").css("display", "block");
        popolateInputOutput(objData.data);
    } else {
        //stopWait("info")
        // $("#wait").css("display", "block");
        $("#tipoInputRichiesti").html("");
        $("#tipoOutputProdotti").html("");
        $("#tipoInputRichiestiEdit").html("");
        $("#tipoInputRichiesti").append(
            "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
        );
        $("#tipoOutputProdotti").append(
            "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
        );
        $("#tipoInputRichiestiEdit").append(
            "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
        );
    }


    var nameCopertGeog = "sgispatialdefinition"
    var collectionCopertGeog = "regions"
    var queryCopertGeog = ""
    var environmentCopertGeog = ""
    var urlCopertGeog = urlComposer(nameCopertGeog, collectionCopertGeog, queryCopertGeog, environmentCopertGeog)
    var objData = callService("GET", urlCopertGeog);
    if (objData.success) {
        var data = objData.data
        // $("#wait").css("display", "block");
        popolateRegionCopGeog(data);
        stopWait("info")
        // $("#wait").css("display", "none");
    } else {
        // $("#wait").css("display", "block");
        stopWait("info")
    }

    // $.ajax({
    //         dataType: "json",
    //         url: "https://sgispatialdefinition.xxxx/api/regions",
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateRegionCopGeog(data);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");
    //             //   $("#tipoInputRichiesti").html("");
    //             //   $("#tipoOutputProdotti").html("");
    //             //   $("#tipoInputRichiestiEdit").html("");
    //             //   $("#tipoInputRichiesti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoOutputProdotti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoInputRichiestiEdit").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //         }
    //     })

}

function popolateRegionCopGeog(data) {
    // console.log(data);
    $("#regioneCoperturaGeog").append(
        "<option selected disabled value>Scegli</option>"
    );
    $.each(data, function (i, value) {
        // console.log(value);
        var option =
            '<option id="' +
            value.codiceRegione +
            '" value ="' +
            value.denominazioneRegione +
            '">' +
            value.denominazioneRegione +
            "</option>";
        $("#regioneCoperturaGeog").append(option);
    });
}

function popolateRegionCopGeogEdit(data) {
    // console.log(data);
    $("#regioneCoperturaGeogEdit").append(
        "<option selected disabled value>Seleziona un elemento</option>"
    );
    $.each(data, function (i, value) {
        // console.log(value);
        var option =
            '<option id="' +
            value.codiceRegione +
            '" value ="' +
            value.denominazioneRegione +
            '">' +
            value.denominazioneRegione +
            "</option>";
        $("#regioneCoperturaGeogEdit").append(option);
    });
}

function getProvCopert(idRegione) {
    // var url =
    //     "https://sgispatialdefinition.xxxx/api/provinces?filter[where][codiceRegione]=" +
    //     idRegione;
    var name = "sgispatialdefinition"
    var collection = "provinces"
    var query = "?filter[where][codiceRegione]=" + idRegione;
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");
        popolateProvCopert(data);
        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
    }


    // $.ajax({
    //         dataType: "json",
    //         url: url,
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateProvCopert(data);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");
    //             //   $("#tipoInputRichiesti").html("");
    //             //   $("#tipoOutputProdotti").html("");
    //             //   $("#tipoInputRichiestiEdit").html("");
    //             //   $("#tipoInputRichiesti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoOutputProdotti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoInputRichiestiEdit").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function getProvCopertEdit(idRegione) {
    // var url =
    //     "https://sgispatialdefinition.xxxx/api/provinces?filter[where][codiceRegione]=" +
    //     idRegione;

    var name = "sgispatialdefinition"
    var collection = "provinces"
    var query = "?filter[where][codiceRegione]=" + idRegione;
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");
        popolateProvCopertEdit(data);
        $("#wait").css("display", "none");
        var numberRow = $("#numberRowCopertGeog").val();
        var provincia = $("#provincia_" + numberRow).html();
        $("#provCoperturaGeogEdit").val(provincia);
        $("#provCoperturaGeogEdit").trigger("change");
        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
    }




    // $.ajax({
    //         dataType: "json",
    //         url: url,
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateProvCopertEdit(data);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");
    //             //   $("#tipoInputRichiesti").html("");
    //             //   $("#tipoOutputProdotti").html("");
    //             //   $("#tipoInputRichiestiEdit").html("");
    //             //   $("#tipoInputRichiesti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoOutputProdotti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoInputRichiestiEdit").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //         var numberRow = $("#numberRowCopertGeog").val();
    //         var provincia = $("#provincia_" + numberRow).html();
    //         $("#provCoperturaGeogEdit").val(provincia);
    //         $("#provCoperturaGeogEdit").trigger("change");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function popolateProvCopert(data) {
    $("#provCoperturaGeog").append(
        "<option value selected disabled>Seleziona un elemento</option>"
    );
    $.each(data, function (i, value) {
        var option =
            '<option id="' +
            value.codiceProvincia +
            '" value="' +
            value.denomProvCitMetropol +
            '" >' +
            value.denomProvCitMetropol +
            "</option>";
        $("#provCoperturaGeog").append(option);
    });
}

function popolateProvCopertEdit(data) {
    $("#provCoperturaGeogEdit").append(
        "<option value selected disabled>Seleziona un elemento</option>"
    );
    $.each(data, function (i, value) {
        var option =
            '<option id="' +
            value.codiceProvincia +
            '" value="' +
            value.denomProvCitMetropol +
            '" >' +
            value.denomProvCitMetropol +
            "</option>";
        $("#provCoperturaGeogEdit").append(option);
    });
}

function getCittaCopert(idProv) {
    // var url =
    //     "https://sgispatialdefinition.xxxx/api/towns?filter[where][codiceProvincia]=" +
    //     idProv;
    var name = "sgispatialdefinition"
    var collection = "towns"
    var query = "?filter[where][codiceProvincia]=" + idProv;
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");
        popolateCittaCopert(data);
        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
    }



    // $.ajax({
    //         dataType: "json",
    //         url: url,
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateCittaCopert(data);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");
    //             //   $("#tipoInputRichiesti").html("");
    //             //   $("#tipoOutputProdotti").html("");
    //             //   $("#tipoInputRichiestiEdit").html("");
    //             //   $("#tipoInputRichiesti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoOutputProdotti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoInputRichiestiEdit").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function getCittaCopertEdit(idProv) {
    // var url =
    //     "https://sgispatialdefinition.xxxx/api/towns?filter[where][codiceProvincia]=" +
    //     idProv;
    var name = "sgispatialdefinition"
    var collection = "towns"
    var query = "?filter[where][codiceProvincia]=" + idProv;
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");
        popolateCittaCopertEdit(data);
        var numberRow = $("#numberRowCopertGeog").val();
        var citta = $("#citta_" + numberRow).html();
        $("#cittaCoperturaGeogEdit").val(citta);
        $("#cittaCoperturaGeogEdit").trigger("change");
        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
    }


    // $.ajax({
    //         dataType: "json",
    //         url: url,
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateCittaCopertEdit(data);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");
    //             //   $("#tipoInputRichiesti").html("");
    //             //   $("#tipoOutputProdotti").html("");
    //             //   $("#tipoInputRichiestiEdit").html("");
    //             //   $("#tipoInputRichiesti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoOutputProdotti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoInputRichiestiEdit").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");

    //         var numberRow = $("#numberRowCopertGeog").val();
    //         var citta = $("#citta_" + numberRow).html();
    //         $("#cittaCoperturaGeogEdit").val(citta);
    //         $("#cittaCoperturaGeogEdit").trigger("change");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function popolateCittaCopert(data) {
    $("#cittaCoperturaGeog").append(
        "<option value selected disabled>Seleziona un elemento</option>"
    );
    $.each(data, function (i, value) {
        var option =
            '<option id="' +
            value.codiceCatastale +
            '" value="' +
            value.denominazioneIt +
            '" >' +
            value.denominazioneIt +
            "</option>";
        $("#cittaCoperturaGeog").append(option);
    });
}

function popolateCittaCopertEdit(data) {
    $("#cittaCoperturaGeogEdit").append(
        "<option value selected disabled>Seleziona un elemento</option>"
    );
    $.each(data, function (i, value) {
        var option =
            '<option id="' +
            value.codiceCatastale +
            '" value="' +
            value.denominazioneIt +
            '" >' +
            value.denominazioneIt +
            "</option>";
        $("#cittaCoperturaGeogEdit").append(option);
    });
}

function popolateFieldsCopertGeogFromArray(geoData) {

    for (var k = 0; k < geoData.length; k++) {
        var count = $("#popolateCopertDivDiv")
            .children().length
        count++;
        var container = $("#popolateCopertDivDiv");
        var valueRegione = (geoData[k].regioneVal == "-") ? " " : geoData[k].regioneVal
        var valueProvincia = (geoData[k].provinciaVal == "-") ? " " : geoData[k].provinciaVal
        var valueCitta = (geoData[k].comuneVal == "-") ? " " : geoData[k].comuneVal
        var idRegione = geoData[k].regioneId;
        var idProvincia = geoData[k].provinciaId
        var idCitta = geoData[k].comuneId
        var html = "";
        var regione =
            "<tr id='" +
            count +
            "'><td><span identifier = '" + idRegione + "' value=\'" +
            valueRegione +
            "\' id='regione_" +
            count +
            "'>" +
            valueRegione +
            "</span></td>";

        var provincia =
            "<td><span  identifier = '" + idProvincia + "' value=\'" +
            valueProvincia +
            "\' id='provincia_" +
            count +
            "'>" +
            valueProvincia +
            "</span></td>";
        var citta =
            "<td><span  identifier = '" + idCitta + "' value=\'" +
            valueCitta +
            "\' id='citta_" +
            count +
            "'>" +
            valueCitta +
            "</span></td>";
        var action =
            '<td><button type="button" onClick="editRowCoperGeog(' +
            count +
            ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowCoperGeoc(' +
            count +
            ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';

        html += regione;
        html += provincia;
        html += citta;
        html += action;
        container.prepend(html);
    }
    $("#coperturaGeografica").prop("checked", true)
    $("#tableCoperturGeog").show();

    $(".divOpenGeog").slideDown();
}

function popolateFieldsCopertGeog() {
    var number = $("#popolateCopertDivDiv")
        .children().length;
    number++;
    var container = $("#popolateCopertDivDiv");

    var valueRegione =
        $("#regioneCoperturaGeog").val() == null ?
        " " :
        $("#regioneCoperturaGeog").val();
    var valueProvincia =
        $("#provCoperturaGeog").val() == null ? " " : $("#provCoperturaGeog").val();
    var valueCitta =
        $("#cittaCoperturaGeog").val() == null ?
        " " :
        $("#cittaCoperturaGeog").val();
    var idRegione = $("#regioneCoperturaGeog").children(":selected").attr("id") == null ?
        " " :
        $("#regioneCoperturaGeog").children(":selected").attr("id");
    var idProvincia = $("#provCoperturaGeog").children(":selected").attr("id") == null ? " " : $("#provCoperturaGeog").children(":selected").attr("id");
    var idCitta = $("#cittaCoperturaGeog").children(":selected").attr("id") == null ?
        " " :
        $("#cittaCoperturaGeog").children(":selected").attr("id");
    var html = "";
    var regione =
        '<tr id="' + number + '"><td><span identifier = "' + idRegione + '" value="' + valueRegione + '" id="regione_' + number + '">' + valueRegione + '</span></td>';
    var provincia =
        '<td><span  identifier = "' +
        idProvincia +
        '" value="' +
        valueProvincia +
        '" id="provincia_' +
        number +
        '">' +
        valueProvincia +
        '</span></td>';
    var citta =
        '<td><span  identifier = "' +
        idCitta +
        '" value="' +
        valueCitta +
        '" id="citta_' +
        number +
        '">' +
        valueCitta +
        '</span></td>';
    var action =
        '<td><button type="button" onClick="editRowCoperGeog(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowCoperGeoc(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';

    html += regione;
    html += provincia;
    html += citta;
    html += action;
    container.prepend(html);
    $("#tableCoperturGeog").show();
}

function blankFieldsGeog() {
    $("#regioneCoperturaGeog").val("");
    $("#provCoperturaGeog").html("");
    $("#cittaCoperturaGeog").html("");
}

function deleteRowCoperGeoc(numberRow) {
    var input = $("#regione_" + numberRow);
    input
        .parent()
        .parent()
        .remove();
}

function editRowCoperGeog(numberRow) {
    $("#numberRowCopertGeog").val(numberRow);

    popolateSelectRegioneEdit();

    $("#modalGeogEdit").modal("show");
}

function popolateSelectRegioneEdit() {
    var name = "sgispatialdefinition";
    var collection = "regions";
    var query = "";
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");
        popolateRegionCopGeogEdit(data);
        var numberRow = $("#numberRowCopertGeog").val();
        var regione = $("#regione_" + numberRow).html();
        $("#regioneCoperturaGeogEdit").val(regione);
        $("#regioneCoperturaGeogEdit").trigger("change");
        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
    }


    // $.ajax({
    //         dataType: "json",
    //         url: "https://sgispatialdefinition.xxxx/api/regions",
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateRegionCopGeogEdit(data);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");
    //             //   $("#tipoInputRichiesti").html("");
    //             //   $("#tipoOutputProdotti").html("");
    //             //   $("#tipoInputRichiestiEdit").html("");
    //             //   $("#tipoInputRichiesti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoOutputProdotti").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //             //   $("#tipoInputRichiestiEdit").append(
    //             //     "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             //   );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //         var numberRow = $("#numberRowCopertGeog").val();
    //         var regione = $("#regione_" + numberRow).html();
    //         $("#regioneCoperturaGeogEdit").val(regione);
    //         $("#regioneCoperturaGeogEdit").trigger("change");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function popolateInputOutput(result) {
    $("#tipoInputRichiesti").html("");
    $("#tipoOutputProdotti").html("");
    $("#tipoInputRichiesti").append(
        "<option value selected disabled>Scegli</option>"
    );
    $("#tipoInputRichiestiEdit").append(
        "<option value selected disabled>Scegli</option>"
    );
    $("#tipoOutputProdottiEdit").append(
        "<option value selected disabled>Scegli</option>"
    );

    $("#tipoOutputProdotti").append(
        "<option value selected disabled>Scegli</option>"
    );

    $.each(result, function (i, field) {
        var option =
            '<option value="' + field.label + '">' + field.label + "</option>";

        $("#tipoInputRichiesti").append(option);
        $("#tipoInputRichiestiEdit").append(option);

        $("#tipoOutputProdotti").append(option);
        $("#tipoOutputProdottiEdit").append(option);
    });
}

function loadComponentTabAccesso() {
    $("#containerRadioLivInteraizone").ready(function (e) {
        PopulateTab5Fields(template);
        if (isTemplate) {
            $("#NONE").prop('checked', "true")
        }
    });



    var name = "sgiinteractivitylevel"
    var collection = "interactivitylevels"
    var query = "?filter[where][language]=it";
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");
        popolateLivInterazione(data);


        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
        $("#containerRadioLivInteraizone").html("");
        $("#containerRadioLivInteraizone").append("SERVIZIO NON DISPONIBILE");
    }
    // //liv interazione
    // $.ajax({
    //         dataType: "json",
    //         async: false,
    //         url: "https://sgiinteractivitylevel.xxxx" +
    //             "/api/interactivitylevels?filter[where][language]=it",
    //         success: function (data) {
    //             $("#wait").css("display", "block");

    //             popolateLivInterazione(data);
    //             //PopulateTab5Fields(template)
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //             $("#containerRadioLivInteraizone").html("");
    //             $("#containerRadioLivInteraizone").append("SERVIZIO NON DISPONIBILE");
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //         //PopulateTab5Fields(template)
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
    // https://sgiauth.xxxx/api/authentications?filter[order]=order%20ASC&filter[where][language]=it

    var nameAuth = "sgiauth"
    var collectionAuth = "authentications"
    var queryAuth = "?filter[order]=order%20ASC&filter[where][language]=it";
    var environmentAuth = ""
    var urlAuth = urlComposer(nameAuth, collectionAuth, queryAuth, environmentAuth);
    var objDataAuth = callService("GET", urlAuth);
    if (objDataAuth.success) {
        var data = objDataAuth.data

        popolateModAuth(data);
        populateAuthTab5(template);
        // populateAuthTab5(template);
    } else {
        $("#modalitaautenticazione").append(
            "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
        );
    }

    //modalita auth
    // $.ajax({
    //         dataType: "json",
    //         url: "https://sgiauth.xxxx/api/authentications?filter[order]=order%20ASC&filter[where][language]=it ",
    //         async: false,
    //         //url: 'http://' + sgiauth.ip + '/' + sgiauth.serviceName + '/api/authentications?filter[where][language]=it',
    //         success: function (data) {
    //             $("#wait").css("display", "block");

    //             popolateModAuth(data);
    //             populateAuthTab5(template)
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //             $("#modalitaautenticazione").append(
    //                 "<option value selected disabled>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //         populateAuthTab5(template);
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });


    var nameChannel = "sgichannel"
    var collectionChannel = "channels"
    var queryChannel = "?filter[where][language]=it&filter[order]=lv0id";
    var environmentChannel = ""
    var urlChannel = urlComposer(nameChannel, collectionChannel, queryChannel, environmentChannel);
    var objDataChannel = callService("GET", urlChannel);
    if (objDataChannel.success) {
        var data = objDataChannel.data
        popolateChannels(data);
    } else {
        $("#tipoCanaleErog").append("SERVIZIO NON DISPONIBILE");
    }



    // $.ajax({
    //         dataType: "json",
    //         url: "https://sgichannel.xxxx" +
    //             "/api/channels?filter[where][language]=it&filter[order]=lv0id",
    //         //url: 'http://' + sgichannel.ip + '/' + sgichannel.serviceName + '/api/channels?filter[where][language]=it&filter[order]=lv0id',
    //         success: function (data) {
    //             $("#wait").css("display", "block");

    //             popolateChannels(data);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //             $("#tipoCanaleErog").html("");
    //             $("#tipoCanaleErog").append("SERVIZIO NON DISPONIBILE");
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function popolateLivInterazione(result) {
    $("#containerRadioLivInteraizone").html("");
    var html = "";
    var closeDiv = "</div></div>";
    // var element = '<div class="col-md-3"></div><div class='col-md-9 interaction"><div class="form-group row"><label class="custom-control custom-radio"><input id="radio1" name="radio" type="radio" aria-describedby="inter_1" class="custom-control-input"><span class="custom-control-indicator"></span><span class="custom-control-description">Personalizzazione</span></label><div id="inter_1" class="help-block"></div></div>'
    html += '<div class="col-md-9 interaction">';
    $.each(result, function (i, field) {
        html +=
            '<div class="form-group row"><label class="custom-control custom-radio"><input id="' +
            field.idlevel +
            '" name="radioOption" type="radio" aria-describedby="inter_' +
            i +
            '" class="custom-control-input"><span class="custom-control-indicator"></span><span class="custom-control-description">' +
            field.label +
            '</span></label><div id="inter_' +
            i +
            '" class="help-block col-12">' +
            field.definition +
            "</div></div>";

        // field.label +

        // field.idlevel +

        // element += closeDiv;
    });
    $("#containerRadioLivInteraizone").append(html);
    $("#containerRadioLivInteraizone").append(closeDiv);
}

function popolateModAuth(result) {
    var figlio = [];
    $("#modalitaautenticazione").html("");
    $("#modalitaautenticazione").append(
        '<fieldset class="ancestor"><legend class="ancestor stepform mb-4">Autenticazione</legend><p class="help-block">Indicare, se previste, le modalità di autenticazione necessarie per accedere al servizio</p><div id="appendField"></div></fieldset>'
    );
    $.each(result, function (i, field) {
        var descriptionPadre = field.description;
        var idPadre = field.lv0id;
        //        var padreTest ="<optgroup id='"+ idPadre + "' label='"+ descriptionPadre + "'>";
        var padreTest =
            '<fieldset id="' +
            idPadre +
            '" class="child"><legend class="child">' +
            descriptionPadre +
            "</legend></fieldset";
        var close = "</optgroup>";

        if (field.lv0id == "NONE") {
            //            $("#fildsetPadre").append('<option value="3276" id="' + field.lv0id +'" class="sg-option-depth-0">' + field.description +'</option>');

            // $("#appendField").prepend(
            //   '<div class="fieldset-like"><div class="row"><div class="col-9"><div class="app-checkbox"> <label><input type="checkbox" id="'+ field.lv0id + '"  name="checkBoxAuth" class="checkBoxValidate" checked value="0">' +
            //   field.description +
            //   '</label></div></div></div'
            // );
            $("#appendField").prepend(
                '<div class="fieldset-like"><div class="row"><div class="col-9"><label class="custom-control custom-checkbox"><input type="checkbox" id="' +
                field.lv0id +
                '"  name="checkBoxAuth" class="custom-control-input" value="0"><span class="custom-control-indicator"></span><span class="custom-control-description"> ' +
                field.description +
                "</span></label></div></div>"
            );


        } else {
            $("#appendField").append(padreTest);

            for (var a = 0; a < field.lv1child.length; a++) {
                //                $("#" + idPadre).append('<option id="' + field.lv1child[a].lv1id + '">' + field.lv1child[a].description + '</option>');
                if (
                    field.lv1child[a].description == "Credenziale SPID Livello 1" ||
                    field.lv1child[a].description == "SPID Livello 2" ||
                    field.lv1child[a].description == "SPID Livello 3"
                ) {
                    // $("#" + idPadre).append(
                    //   '<div class="app-checkbox"><label><input type="checkbox" id="'+field.lv1child[a].lv1id+'" name="checkBoxAuth" class="checkBoxValidate"  value="0"> ' +
                    //   field.lv1child[a].description +
                    //   ' <img src="/img/componenti/spid.png" alt="" width="30px"></label></div>'
                    // );
                    $("#" + idPadre).append(
                        '<div class="app-checkbox"><label class="custom-control custom-checkbox"><input type="checkbox" id="' +
                        field.lv1child[a].lv1id +
                        '" name="checkBoxAuth" class="custom-control-input"  value="0"><span class="custom-control-indicator"></span><span class="custom-control-description"> ' +
                        field.lv1child[a].description +
                        ' <img src="/img/componenti/spid.png" alt="" width="30px"></span></label></div>'
                    );
                } else
                    // $("#" + idPadre).append(
                    //   '<div class="app-checkbox"><label><input type="checkbox" id="'+field.lv1child[a].lv1id+'" name="checkBoxAuth" class="checkBoxValidate"  value="0"> ' +
                    //   field.lv1child[a].description +
                    //   "</label></div>"
                    // );
                    $("#" + idPadre).append(
                        '<div class="app-checkbox"><label class="custom-control custom-checkbox"><input type="checkbox" id="' +
                        field.lv1child[a].lv1id +
                        '" name="checkBoxAuth" class="custom-control-input"  value="0"> <span class="custom-control-indicator"></span><span class="custom-control-description"> ' +
                        field.lv1child[a].description +
                        "</span></label></div>"
                    );
            }
        }
    });
    // appendFreeAccess();
}

function popolateChannels(results) {
    $("#tipoCanaleErog").append(
        "<option disabled selected value>Scegli</option>"
    );
    $("#tipoCanaleErogEdit").append(
        "<option disabled selected value>Scegli</option>"
    );
    $.each(results, function (i, field) {
        $("#tipoCanaleErog").append(
            '<option id="' + field.lv0id + '">' + field.lv0description + "</option>"
        );
        $("#tipoCanaleErogEdit").append(
            '<option value="' +
            field.lv0description +
            '" id="' +
            field.lv0id +
            '">' +
            field.lv0description +
            "</option>"
        );
    });
}

function popolateOrganization() {
    var a = $("#bodyOrganizz").children().length;
    if ($("#formOrganizz").valid() == true) {
        $("#modalOrganizz").modal("hide");

        var name = $("#nomeOrganizz").val() == "" ? " " : $("#nomeOrganizz").val();
        var role = $("#ruoloOrganizzModal").val() == "" ? " " : $("#ruoloOrganizzModal").val();
        var dateDa = $("#dalOrganizz").val() == "" ? " " : $("#dalOrganizz").val();
        var dateA = $("#alOrganizz").val() == "" ? " " : $("#alOrganizz").val();
        var appRows = "";
        appRows += '<tr id="' + a + '"><td id="' + a + '_organizz">';
        appRows += name;
        appRows += '</td><td id="' + a + '_ruolo">';
        appRows += role;
        appRows += '</td><td id="' + a + '_dal">';
        appRows += dateDa;
        appRows += '</td><td id="' + a + '_al">';
        appRows += dateA;
        appRows +=
            '</td><td><button type="button" onClick="editRowOrganiz(' +
            a +
            ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowOrganiz(' +
            a +
            ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';

        $("#bodyOrganizz").prepend(appRows);
        blankFieldOrganizz();
        $("#tableOrg").show();
        a++;
    }
}

function popolateOrganizationTemplate(template) {
    var a = $("#bodyOrganizz").children().length;

    if (
        $("#formOrganizz").valid() == true &&
        template.publicService.organizations
    ) {
        $.each(template.publicService.organizations, function (index, element) {
            var name, role, dateDa, dateA;
            if (element.name) {
                name = element.name;
                name = (name == "-" || name == "undefined" ? " " : name)
            }
            if (element.role) {
                role = element.role;
                role = (role == "-" || role == "undefined" ? " " : role)
            }
            if (element.date && element.date.length > 0) {
                if (element.date[0].startDateTime) {
                    dateDa = element.date[0].startDateTime;
                    dateDa = (dateDa == "-" || dateDa == "undefined" ? " " : dateDa)
                } else dateDa = " ";
                if (element.date[0].endDateTime) {
                    dateA = element.date[0].endDateTime;
                    dateA = (dateA == "-" || dateA == "undefined" ? " " : dateA)
                } else dateA = " ";
            } else {
                dateDa = " ";
                dateA = " ";
            }
            var appRows = "";
            appRows += '<tr id="' + a + '"><td id="' + a + '_organizz">';
            appRows += name;
            appRows += '</td><td id="' + a + '_ruolo">';
            appRows += role;
            appRows += '</td><td id="' + a + '_dal">';
            appRows += dateDa;
            appRows += '</td><td id="' + a + '_al">';
            appRows += dateA;
            appRows +=
                '</td><td><button type="button" onClick="editRowOrganiz(' +
                a +
                ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowOrganiz(' +
                a +
                ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';

            $("#bodyOrganizz").prepend(appRows);
            $("#tableOrg").show();
            //blankFieldOrganizz();
            a++;
        })

    }
}

function editRowOrganiz(numberRow) {
    var nome = $("#" + numberRow + "_organizz").html();
    var ruolo = $("#" + numberRow + "_ruolo").text();
    var dal
    if ($("#" + numberRow + "_dal").html() != "" && $("#" + numberRow + "_dal").html() != undefined) {
        dal = new Date(
            $("#" + numberRow + "_dal")
            .html()
            .replace(/\s/g, "")
        ).setHours(15);
    }
    var al
    if ($("#" + numberRow + "_al").html() != "" && $("#" + numberRow + "_al").html() != undefined) {
        al = new Date(
            $("#" + numberRow + "_al")
            .html()
            .replace(/\s/g, "")
        ).setHours(15);
    }

    //alert(ruolo)
    $("#numberOfRowOrganization").val(numberRow);

    $("#nomeOrganizzEdit").val(nome);
    $("#ruoloOrganizzModalEdit").val(ruolo);
    //        $('#dalOrganizz').attr("value" , "05-05-2005")
    if (dal != undefined) {
        var dalControl = (document.getElementById(
            "dalOrganizzEdit"
        ).valueAsDate = new Date(dal));
    }
    //        dalControl.value = "2017/01/01"
    //        $("#dalOrganizz").trigger("change")
    if (dal != undefined) {
        var dalControl = (document.getElementById(
            "alOrganizzEdit"
        ).valueAsDate = new Date(al));
    }
    $("#modalOrganizzEdit").modal("show");
}

function deleteRowOrganiz(numberRowOrganizz) {
    var input = $("#" + numberRowOrganizz + "_organizz");
    input.parent().remove();
}

function popolateContatti() {
    var a = $("#bodyContatti")
        .children().length;
    a++;
    //    if($("#formOrganizz").valid() == true){

    //}
    // $('#modalContatti').modal('hide');
    var nameOffice = $("#nomeUfficioContatti").val();
    var emailOffice = $("#emailContatti").val();
    var phoneOffice = $("#telefonoContatti").val();
    var urlOffice = $("#sitoWebContatti").val();
    var appRows = "";
    appRows += '<tr id="' + a + '"><td id="' + a + '_nomeContatto">';
    appRows += nameOffice;
    appRows += '</td><td id="' + a + '_emailContatto">';
    appRows += emailOffice;
    appRows += '</td><td id="' + a + '_telefonoContatto">';
    appRows += phoneOffice;
    appRows += '</td><td id="' + a + '_urlContatto">';
    appRows += urlOffice;
    appRows +=
        '</td><td><button type="button" onClick="editRowContacts(' +
        a +
        ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowContacts(' +
        a +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';

    $("#bodyContatti").prepend(appRows);
    a++;
}

function popolateCostoField() {
    var a = $("#bodyPopolateCosto")
        .children()
        .attr("id");
    a++;
    //    if($("#formOrganizz").valid() == true){

    //}
    // $('#modalContatti').modal('hide');
    var costoEuro = $("#costoEuro").val();
    var descrCosto = $("#descrizioneCosti").val();

    var appRows = "";
    appRows += '<tr id="' + a + '"><td id="' + a + '_costoEuro">';
    appRows += costoEuro;
    appRows += '</td><td id="' + a + '_descrCosto">';
    appRows += descrCosto;
    appRows +=
        '</td><td><button type="button" onClick="editRowCosto(' +
        a +
        ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowCosto(' +
        a +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';

    $("#bodyPopolateCosto").prepend(appRows);
    a++;
    $("#modalCosto").modal("hide");
    $("#tableCosto").show();
}

function popolateCostoFieldFromTemplate(costs) {
    $.each(costs, function (index, cost) {
        var a = $("#bodyPopolateCosto")
            .children().length;
        a++;
        var appRows = "";
        appRows += '<tr id="' + a + '"><td id="' + a + '_costoEuro">';
        appRows += cost.value;
        appRows += '</td><td id="' + a + '_descrCosto">';
        appRows += cost.description.description;
        appRows +=
            '</td><td><button type="button" onClick="editRowCosto(' +
            a +
            ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowCosto(' +
            a +
            ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';

        $("#bodyPopolateCosto").prepend(appRows);
        a++;
    })

    $("#tableCosto").show();
    $("#costo").prop("checked", true);
    $(".divOpenCosti").slideDown();
}

function blanckInputCosto() {
    $("#costoEuro").val("");
    $("#descrizioneCosti").val("");
}

function deleteRowCosto(numberRow) {
    $("#" + numberRow + "_costoEuro")
        .parent()
        .remove();
}

function editRowCosto(numberRow) {
    var costoEuro = $("#" + numberRow + "_costoEuro")
        .html()
    //.replace(/\s/g, "");
    var descrCosto = $("#" + numberRow + "_descrCosto").html();
    //.replace(/\s/g, "");
    //alert(ruolo)
    $("#numberOfRowCosto").val(numberRow);

    $("#costoEuroEdit").val(costoEuro);
    $("#descrizioneCostiEdit").val(descrCosto);
    $("#modalCostoEdit").modal("show");
}

function popolateContattiTemplate(template) {
    if (firstLoad) {
        $.each(template.publicService.contacts, function (index, element) {
            var a = $("#bodyContatti")
                .children().length
            a++;
            var nameOffice = (element.office.description) ? element.office.description : "";
            var emailOffice = (element.email) ? element.email : "";
            var phoneOffice = (element.phoneNumber) ? element.phoneNumber : "";
            var urlOffice = (element.web) ? element.web : "";
            var appRows = "";
            appRows += '<tr id="' + a + '"><td id="' + a + '_nomeContatto">';
            appRows += nameOffice;
            appRows += '</td><td id="' + a + '_emailContatto">';
            appRows += emailOffice;
            appRows += '</td><td id="' + a + '_telefonoContatto">';
            appRows += phoneOffice;
            appRows += '</td><td id="' + a + '_urlContatto">';
            appRows += urlOffice;
            appRows +=
                '</td><td><button type="button" onClick="editRowContacts(' +
                a +
                ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button>  <button type="button" onClick="deleteRowContacts(' + a + ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button> </td></tr>';



            $("#bodyContatti").prepend(appRows);
            a++;
        })
    }
    $("#tableContatti").show();
}

function editRowContacts(numberRow) {
    var nameOffice = $("#" + numberRow + "_nomeContatto")
        .html()
    //.replace(/\s/g, "");
    var emailOffice = $("#" + numberRow + "_emailContatto")
        .html()
    //.replace(/\s/g, "");
    var phoneOffice = $("#" + numberRow + "_telefonoContatto")
        .html()
    //.replace(/\s/g, "");
    var urlOffice = $("#" + numberRow + "_urlContatto")
        .html()
    //.replace(/\s/g, "");
    //alert(ruolo)
    $("#numberOfRowContacts").val(numberRow);

    $("#nomeUfficioContattiEdit").val(nameOffice);
    $("#emailContattiEdit").val(emailOffice);
    $("#telefonoContattiEdit").val(phoneOffice);
    $("#sitoWebContattiEdit").val(urlOffice);

    $("#modalContattiEdit").modal("show");
}

function deleteRowContacts(numberRowContacts) {
    var input = $("#" + numberRowContacts + "_nomeContatto");
    input.parent().remove();
}

function loadComponentTabTema() {
    startWait("temaFieldset", "Caricamento temi in corso...")
    startWait("sectorFieldset", "Caricamento settori in corso...")
    var name = "sginace"
    var collection = "naces"
    var query = "";
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        popolateSettoreSelect(data);
        if (template) {
            if (template.publicService.themes) {
                $.each(template.publicService.themes, function (index, element) {
                    $("[identifier='" + element.id + "']").attr("checked", "checked");
                })
            }
        }
        stopWait("temaFieldset")
    } else {

        $("#settoreservizio_1").append(
            "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
        );
    }
    var nameTheme = "sgithemes"
    var collectionTheme = "themes"
    var queryTheme = "?filter[where][language]=it";
    var environment = ""
    var urlTheme = urlComposer(nameTheme, collectionTheme, queryTheme, environment);
    var objDataTheme = callService("GET", urlTheme);
    if (objDataTheme.success) {
        var data = objDataTheme.data
        // $("#wait").css("display", "block");
        popolateCheckTema(data);
        stopWait('sectorFieldset')
        // $("#wait").css("display", "none");
    } else {
        // $("#wait").css("display", "none");
        $("#settoreservizio_1").html("");
        $("#settoreservizio_1").append(
            "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
        );
    }
}

function popolateSettoreSelect(data) {
    //console.log(data)

    $("#settoreservizio_1").html("");
    $("#settoreservizio_1Edit").html("");
    $("#settoreservizio_1").append(
        "<option disabled selected value>Scegli</option> "
    );
    $("#settoreservizio_1Edit").append(
        "<option disabled selected value>Seleziona un elemento</option> "
    );

    $.each(data, function (i, results) {
        if (results.idParent == "" || results.idParent == undefined) {
            $("#settoreservizio_1").append(
                '<option value="' +
                results.description +
                '" id="' +
                results.identifier +
                '">' +
                results.description +
                "</option>"
            );
            $("#settoreservizio_1Edit").append(
                '<option value="' +
                results.description +
                '" id="' +
                results.identifier +
                '">' +
                results.description +
                "</option>"
            );
        }
    });

    //if (firstLoad) PopulateSettore1FromService(template);
}

function loadLiv1(id) {
    // if (!template.publicService.sector) {
    var name = "sginace"
    var collection = "naces"
    var query = "";
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");

        popolateLv1(data, id);
        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
        $("#settoreservizio_1").html("");
        $("#settoreservizio_1Edit").html("");

        $("#settoreservizio_1").append(
            "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
        );
        $("#settoreservizio_1Edit").append(
            "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
        );
    }
    // $.ajax({
    //         dataType: "json",
    //         url: "https://sginace.xxxx/api/naces",
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateLv1(data, id);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //             $("#settoreservizio_1").html("");
    //             $("#settoreservizio_1Edit").html("");

    //             $("#settoreservizio_1").append(
    //                 "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //             $("#settoreservizio_1Edit").append(
    //                 "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
    // }
    // else{
    //     console.log(template.publicService.sector)
    // }
}

function loadLiv1Edit(id) {
    // if (!template.publicService.sector) {
    var name = "sginace"
    var collection = "naces"
    var query = "";
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");

        popolateLv1Edit(data, id);
        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
        $("#settoreservizio_1").html("");
        $("#settoreservizio_1Edit").html("");

        $("#settoreservizio_1").append(
            "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
        );
        $("#settoreservizio_1Edit").append(
            "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
        );
    }
    // $.ajax({
    //         dataType: "json",
    //         url: "https://sginace.xxxx/api/naces",
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateLv1Edit(data, id);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //             $("#settoreservizio_1").html("");
    //             $("#settoreservizio_1Edit").html("");

    //             $("#settoreservizio_1").append(
    //                 "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //             $("#settoreservizio_1Edit").append(
    //                 "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
    // }
    // else{
    //     console.log(template.publicService.sector)
    // }
}

function popolateLv1(data, id) {
    $("#settoreservizio_2").append(
        "<option disabled selected value>Scegli</option>"
    );
    $.each(data, function (i, results) {
        if (results.idParent == id) {
            $("#settoreservizio_2").append(
                '<option value="' +
                results.description +
                '" id="' +
                results.identifier +
                '">' +
                results.description +
                "</option>"
            );
        }
    });
}

function popolateLv1Edit(data, id) {
    $("#settoreservizio_2Edit").append(
        "<option disabled selected value>Seleziona un elemento</option>"
    );
    $("#wait").css("display", "block");
    $.each(data, function (i, results) {
        if (results.idParent == id) {
            $("#settoreservizio_2Edit").append(
                '<option value="' +
                results.description +
                '" id="' +
                results.identifier +
                '">' +
                results.description +
                "</option>"
            );
        }
    });
    var numberRow = $("#numberOfRowSettoriEdit").val();
    var tipo_2 = $("#serviziosottotipo2_" + numberRow).html();
    $('#settoreservizio_2Edit option[value="' + tipo_2 + '" ]').attr(
        "selected",
        "selected"
    );
    $("#settoreservizio_2Edit").trigger("change");
    //   $("#settoreservizio_2Edit").val(tipo_2);
}

function loadLiv2(id) {
    var name = "sginace"
    var collection = "naces"
    var query = "";
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");

        popolateLv2(data, id);
        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
        $("#settoreservizio_2").html("");
        $("#settoreservizio_2").append(
            "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
        );
    }
    // $.ajax({
    //         dataType: "json",
    //         url: "https://sginace.xxxx/api/naces",
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateLv2(data, id);
    //             //if (firstLoad) PopulateSettore3FromService(template);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //             $("#settoreservizio_2").html("");
    //             $("#settoreservizio_2").append(
    //                 "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function loadLiv2Edit(id) {
    var name = "sginace"
    var collection = "naces"
    var query = "";
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");

        popolateLv2Edit(data, id);
        var number = $("#numberOfRowSettoriEdit").val();
        var tipo_3 = $("#serviziosottotipo3_" + number).html();
        $("#settoreservizio_3Edit").val(tipo_3);
        $("#settoreservizio_3Edit").trigger("change");

        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
        $("#settoreservizio_2Edit").html("");
        $("#settoreservizio_2Edit").append(
            "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
        );
    }
    // $.ajax({
    //         dataType: "json",
    //         url: "https://sginace.xxxx/api/naces",
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateLv2Edit(data, id);
    //             //if (firstLoad) PopulateSettore3FromService(template);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //             $("#settoreservizio_2Edit").html("");
    //             $("#settoreservizio_2Edit").append(
    //                 "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //         }
    //     })
    //     .done(function () {
    //         var number = $("#numberOfRowSettoriEdit").val();
    //         var tipo_3 = $("#serviziosottotipo3_" + number).html();
    //         $("#settoreservizio_3Edit").val(tipo_3);
    //         $("#settoreservizio_3Edit").trigger("change");
    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function popolateLv2(data, id) {
    $("#settoreservizio_3").append(
        "<option disabled selected value>Scegli</option>"
    );
    $.each(data, function (i, results) {
        if (results.idParent == id) {
            $("#settoreservizio_3").append(
                "<option value='" +
                results.description +
                "' id='" +
                results.identifier +
                "'>" +
                results.description +
                "</option>"
            );
        }
    });
}

function popolateLv2Edit(data, id) {
    $("#settoreservizio_3Edit").append(
        "<option disabled selected value>Seleziona un elemento</option>"
    );
    $("#wait").css("display", "block");
    $.each(data, function (i, results) {
        if (results.idParent == id) {
            $("#settoreservizio_3Edit").append(
                '<option value="' +
                results.description +
                '" id="' +
                results.identifier +
                '">' +
                results.description +
                "</option>"
            );
        }
    });
    var numberRow = $("#numberOfRowSettoriEdit").val();
    var tipo_3 = $("#sottotipo3_" + numberRow).html();
    $('#settoreservizio_3Edit option[value="' + tipo_3 + '" ]').attr(
        "selected",
        "selected"
    );
    // $("#settoreservizio_3Edit").trigger("change");
}

function loadLiv3(id) {
    var name = "sginace"
    var collection = "naces"
    var query = "";
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");
        popolateLv3(data, [id]);
        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
        $("#settoreservizio").html("");
        $("#settoreservizio").append(
            "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
        );
    }

    // $.ajax({
    //         dataType: "json",
    //         url: "https://sginace.xxxx/api/naces",
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateLv3(data, [id]);
    //             //if (firstLoad) PopulateSettore4FromService(template);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //             $("#settoreservizio").html("");
    //             $("#settoreservizio").append(
    //                 "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //         }
    //     })
    //     .done(function () {
    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function loadLiv3Edit(id) {
    var name = "sginace"
    var collection = "naces"
    var query = "";
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        $("#wait").css("display", "block");
        popolateLv3Edit(data, [id]);
        var numberRow = $("#numberOfRowSettoriEdit").val();
        var tipo_4 = $("#sottotipo4_" + numberRow).html();
        $("#wait").css("display", "none");
    } else {
        $("#wait").css("display", "none");
        $("#settoreservizio").html("");
        $("#settoreservizio").append(
            "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
        );
    }

    // $.ajax({
    //         dataType: "json",
    //         url: "https://sginace.xxxx/api/naces",
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             popolateLv3Edit(data, [id]);
    //             //if (firstLoad) PopulateSettore4FromService(template);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //             $("#settoreservizio").html("");
    //             $("#settoreservizio").append(
    //                 "<option disabled selected value>SERVIZIO NON DISPONIBILE</option>"
    //             );
    //         }
    //     })
    //     .done(function () {
    //         var numberRow = $("#numberOfRowSettoriEdit").val();
    //         var tipo_4 = $("#sottotipo4_" + numberRow).html();
    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function popolateLv3(data, id) {
    $("#settoreservizio_4").html("");
    $("#settoreservizio_4").append(
        "<option disabled selected value>Scegli</option>"
    );

    $.each(data, function (i, results) {
        if (results.idParent == id) {
            $("#settoreservizio_4").append(
                '<option value="' +
                results.description +
                '" id="' +
                results.identifier +
                '">' +
                results.description +
                "</option>"
            );
        }
    });
}

function popolateLv3Edit(data, id) {
    $("#settoreservizio_4Edit").html("");
    $("#settoreservizio_4Edit").append(
        "<option disabled selected value>Seleziona un elemento</option>"
    );

    $.each(data, function (i, results) {
        if (results.idParent == id) {
            $("#settoreservizio_4Edit").append(
                '<option value="' +
                results.description +
                '" id="' +
                results.identifier +
                '">' +
                results.description +
                "</option>"
            );
        }
    });
    var number = $("#numberOfRowSettoriEdit").val();
    var tipo_4 = $("#serviziosottotipo4_" + number).html();
    $("#settoreservizio_4Edit").val(tipo_4);
    var numberRow = $("#numberOfRowSettoriEdit").val();
    var tipo_3 = $("#sottotipo4_" + numberRow).html();
    $('#settoreservizio_4Edit option[value="' + tipo_3 + '" ]').attr(
        "selected",
        "selected"
    );
    // $("#settoreservizio_4Edit").trigger("change");
    $("#wait").css("display", "none");
}

function popolateInputFields() {
    var number = $("#popolateInputDiv")
        .children()
        .attr("id");
    number++;

    //    if (number == "" || number == undefined)
    //        number=0;
    var container = $("#popolateInputDiv");

    var appRows = "";

    var nomeInput = $("#nomeInputRichiesti").val();
    var tipoInput = $("#tipoInputRichiesti").val() == null ? " " : $("#tipoInputRichiesti").val();
    var documentazioneInput = $("#docRifInputRichiesti").val();

    appRows += '<tr id="' + number + '"><td id="nomeInput_' + number + '">';
    appRows += nomeInput;
    appRows += '</td><td id="tipoInput_' + number + '">';
    appRows += tipoInput;
    appRows += '</td><td id="documInput_' + number + '">';
    appRows += documentazioneInput;
    appRows +=
        '</td><td><button type="button" onClick="editRowInput(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowInput(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';

    // html += rowFormGroup;
    // html += labelNome;
    // html += col;
    // html += row;
    // html += tipo;
    // html += documentazione;
    // html += closeDiv;
    // html += closeDiv;
    // html += closeDiv;

    container.prepend(appRows);
    $("#modalInputRichiesti").modal("hide");
    $("#tableInput").show();
}

function popolateServiziFields() {
    var number = $("#popolateSettoreDiv")
        .children()
        .attr("id");
    number++;

    //    if (number == "" || number == undefined)
    //        number=0;
    //  = $("#settoreservizio_1").val();
    var tipo2 =
        $("#settoreservizio_2").val() == null ? " " : $("#settoreservizio_2").val();
    var tipo3 =
        $("#settoreservizio_3").val() == null ? " " : $("#settoreservizio_3").val();
    var tipo4 =
        $("#settoreservizio_4").val() == null ? " " : $("#settoreservizio_4").val();

    var tipo1Number = $(
        '#settoreservizio_1 option[value="' + $("#settoreservizio_1").val() + '"'
    ).attr("id");
    var tipo2Number = $(
        '#settoreservizio_2 option[value="' + $("#settoreservizio_2").val() + '"'
    ).attr("id");
    var tipo3Number = $(
        '#settoreservizio_3 option[value="' + $("#settoreservizio_3").val() + '"'
    ).attr("id");
    var tipo4Number = $(
        '#settoreservizio_4 option[value="' + $("#settoreservizio_4").val() + '"'
    ).attr("id");
    var html = "";
    html +=
        '<tr id="' +
        number +
        '"><td id="' +
        number +
        '"><span number="' +
        $(
            '#settoreservizio_1 option[value="' + $("#settoreservizio_1").val() + '"'
        ).attr("id") +
        '" id="serviziotipo_' +
        number +
        '">' +
        $("#settoreservizio_1").val() +
        "</span></td>";
    html +=
        '<td id="' +
        number +
        '"> <span number="' +
        $(
            '#settoreservizio_2 option[value="' + $("#settoreservizio_2").val() + '"'
        ).attr("id") +
        '" id="serviziosottotipo2_' +
        number +
        '">' +
        tipo2 +
        "</span><br/>";

    html +=
        "<span number='" +
        $(
            '#settoreservizio_3 option[value="' + $("#settoreservizio_3").val() + '"'
        ).attr("id") +
        "' id='serviziosottotipo3_" +
        number +
        "'>" +
        tipo3 +
        "</span><br/>";

    html +=
        '<span  number="' +
        $(
            '#settoreservizio_4 option[value="' + $("#settoreservizio_4").val() + '"'
        ).attr("id") +
        '" id="serviziosottotipo4_' +
        number +
        '">' +
        tipo4 +
        "</span></td>";
    html += '<td id="' + number + '">';
    html +=
        '<button type="button" onClick="editRowServizio(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowServizi(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td>';
    $("#popolateSettoreDiv").prepend(html);
    $("#modalSettori").modal("hide");
}

function populateSectorFromSortedArray(data) {
    //var test = data.sort(x => x.idLevel);
    var html = "";
    var x = 0;
    var number = $("#popolateSettoreDiv")
        .children()
        .attr("id");
    ++number;
    $.each(data, function (index, sector) {
        switch (sector.idLevel) {
            case "1":
                html +=
                    '<tr id="' +
                    number +
                    '"><td id="' +
                    number +
                    '"><span number="' +
                    sector.identifier +
                    '" id="serviziotipo_' +
                    number +
                    '">' +
                    sector.description +
                    "</span></td>";
                ++x;
                break;
            case "2":
                html +=
                    '<td id="' +
                    number +
                    '"> <span number="' +
                    sector.identifier +
                    '" id="serviziosottotipo2_' +
                    number +
                    '">' +
                    sector.description +
                    "</span>";
                ++x;
                break;
            case "3":

                html +=
                    "<br/><span number='" +
                    $('#settoreservizio_3 option[value="' + sector.description + '"]').attr("id") +
                    "' id='serviziosottotipo3_" +
                    number +
                    "'>" +
                    sector.description +
                    "</span>";
                ++x;
                break;
            case "4":

                html +=
                    '<br/><span  number="' +
                    sector.identifier +
                    '" id="serviziosottotipo4_' +
                    number +
                    '">' +
                    sector.description +
                    "</span></td>";
                ++x;
                break;
        }
    })

    switch (x) {
        case 1:
            (html +=
                '<td id="' +
                number +
                '"> <span number="' +
                $(
                    '#settoreservizio_2 option[value="' +
                    $("#settoreservizio_2").val() +
                    '"'
                ).attr("id") +
                '" id="serviziosottotipo2_' +
                number +
                '">' +
                " " +
                "</span><br/>"),
            // (html += " => "),
            (html +=
                "<span number='" +
                $(
                    '#settoreservizio_3 option[value="' +
                    $("#settoreservizio_3").val() +
                    '"'
                ).attr("id") +
                "' id='serviziosottotipo3_" +
                number +
                "'>" +
                " " +
                "</span><br/>"),
            // (html += "=>"),
            (html +=
                '<span  number="' +
                $(
                    '#settoreservizio_4 option[value="' +
                    $("#settoreservizio_4").val() +
                    '"'
                ).attr("id") +
                '" id="serviziosottotipo4_' +
                number +
                '">' +
                " " +
                "</span></td>");
            break;
        case 2:
            // (html += " => "),
            (html +=
                "<br/><span number='" +
                $(
                    '#settoreservizio_3 option[value="' +
                    $("#settoreservizio_3").val() +
                    '"'
                ).attr("id") +
                "' id='serviziosottotipo3_" +
                number +
                "'>" +
                " " +
                "</span><br/>"),
            // (html += "=>"),
            (html +=
                '<span  number="' +
                $(
                    '#settoreservizio_4 option[value="' +
                    $("#settoreservizio_4").val() +
                    '"'
                ).attr("id") +
                '" id="serviziosottotipo4_' +
                number +
                '">' +
                " " +
                "</span></td>");
            break;
        case 3:
            // (html += "=>"),
            (html +=
                '<br/><span  number="' +
                $(
                    '#settoreservizio_4 option[value="' +
                    $("#settoreservizio_4").val() +
                    '"'
                ).attr("id") +
                '" id="serviziosottotipo4_' +
                number +
                '">' +
                " " +
                "</span></td>");
    }
    html += '<td id="' + number + '">';
    html +=
        '<button type="button" onClick="editRowServizio(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowServizi(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td>';
    $("#popolateSettoreDiv").prepend(html);
    $("#tableSettori").removeAttr("style");
}

function blankFieldsServizi() {
    $("#settoreservizio_1").val("");
    $("#settoreservizio_2").html("");
    $("#settoreservizio_3").html("");
    $("#settoreservizio_4").html("");
}

function editRowServizio(numberRow) {
    $("#numberOfRowSettoriEdit").val(numberRow);
    var tipo = $("#serviziotipo_" + numberRow).html();
    var tipo_2 = $("#serviziosottotipo2_" + numberRow).html();
    // var tipo_3 = $("#serviziosottotipo3_" + numberRow).html();
    var tipo_4 = $("#serviziosottotipo4_" + numberRow).html();
    //alert(ruolo)

    $("#settoreservizio_1Edit").val(tipo);
    $("#settoreservizio_1Edit").trigger("change");
    //    $("#tipoInputRichiestiEdit option[value='" + ruolo+ "' ]").attr("selected" , "selected");
    //   var tipo_2 = $("#sottotipo2_" + numberRow).html();
    $("#settoreservizio_2Edit").val(tipo_2);
    // $("#settoreservizio_2Edit").trigger("change");
    // $("#settoreservizio_3Edit").val(tipo_3);

    // $("#settoreservizio_4Edit").val(tipo_4);

    $("#modalSettoriEdit").modal("show");
}

function deleteRowServizi(numberRow) {
    var input = $("#serviziotipo_" + numberRow);
    input
        .parent()
        .parent()
        .remove();
}

function popolateInputFieldsTemplate(template) {
    if (template.publicService.input) {
        $("#inputRichiesti").prop("checked", true);
        $(".divOpenInput").slideDown();
        $("#tableInput").show();
        $.each(template.publicService.input, function (index, element) {
            var number = $("#popolateInputDiv")
                .children()
                .attr("id");
            number++;
            var container = $("#popolateInputDiv");
            container.removeAttr("hidden");
            var appRows = "";
            appRows += '<tr id="' + number + '"><td id="nomeInput_' + number + '">';
            appRows += (element.name && element.name != "-") ? element.name : "";
            appRows += '</td><td id="tipoInput_' + number + '">';
            appRows += (element.type.label && element.type.label != "-") ? element.type.label : "";
            appRows += '</td><td id="documInput_' + number + '">';
            appRows += (element.referenceDocumentation &&
                    element.referenceDocumentation != "-" &&
                    element.referenceDocumentation != "undefined" &&
                    element.referenceDocumentation != undefined) ?
                element.referenceDocumentation :
                "";
            appRows +=
                '</td><td><button type="button" onClick="editRowInput(' +
                number +
                ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowInput(' +
                number +
                ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';
            container.prepend(appRows);
        })
    }
}

function popolateOutputFields() {
    var number = $("#popolateOutputDiv")
        .children()
        .attr("id");
    number++;
    var container = $("#popolateOutputDiv");
    var appRows = "";
    var nomeOtuput = $("#nomeOutputProdotti").val();
    var tipoOutput = $("#tipoOutputProdotti").val() == null ? " " : $("#tipoOutputProdotti").val();
    appRows += '<tr id="' + number + '"><td id="nomeOutput_' + number + '">';
    appRows += nomeOtuput != "-" ? nomeOtuput : "";
    appRows += '</td><td id="tipoOutput_' + number + '">';
    appRows += tipoOutput != "-" ? tipoOutput : "";
    appRows +=
        '</td><td><button type="button" onClick="editRowOutput(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowOutput(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';
    container.prepend(appRows);
    $("#modalOutputProdotti").modal("hide");
    $("#tableOutput").show();
}

function popolateOutputFieldsTemplate(template) {
    if (firstLoad && template.publicService.output) {
        $("#outputProdotti").prop("checked", true);
        $(".divOpenOutput").slideDown();
        $("#tableOutput").show();
        $.each(template.publicService.output, function (index, element) {
            var number = $("#popolateOutputDiv")
                .children()
                .attr("id");
            number++;
            var container = $("#popolateOutputDiv");
            var appRows = "";
            appRows += '<tr id="' + number + '"><td id="nomeOutput_' + number + '">';
            appRows += element.name ? element.name : "";
            appRows += '</td><td id="tipoOutput_' + number + '">';
            appRows += element.type.label ? element.type.label : "";
            appRows +=
                '</td><td><button type="button" onClick="editRowOutput(' +
                number +
                ')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowOutput(' +
                number +
                ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';
            container.prepend(appRows);
        })
    }
}

function popolateCheckTema(results) {
    var container1 = $("#appendCheck1");
    var container2 = $("#appendCheck2");
    var html = "";
    $.each(results, function (i, data) {
        var appCheckbox = '<div class="app-checkbox">';
        var inputCheck =
            '<label><input type="checkbox" id="temaCheck" name="temaCheck[]" class="checkBoxValidate" value="' +
            data.identifier +
            '" aria-required="true" identifier="' +
            data.identifier +
            '" aria-invalid="false"> ' +
            data.label +
            "</label>";
        var closeDiv = "</div>";
        html += appCheckbox;
        html += inputCheck;
        html += closeDiv;
        if (i > 6) container2.append(html);
        else container1.append(html);
        html = "";
    });
}

function editRowInput(numberRow) {
    var nome = $("#nomeInput_" + numberRow)
        .html()
    //.replace(/\s/g, "");
    var ruolo = $("#tipoInput_" + numberRow).html();
    var doc = $("#documInput_" + numberRow)
        .html()
    //.replace(/\s/g, "");
    //alert(ruolo)
    $("#numberOfRowInputEdit").val(numberRow);

    $("#nomeInputRichiestiEdit").val(nome);
    //    $("#tipoInputRichiestiEdit option[value='" + ruolo+ "' ]").attr("selected" , "selected");
    $("#tipoInputRichiestiEdit").val(ruolo);

    $("#docRifInputRichiestiEdit").val(doc);

    $("#modalInputRichiestiEdit").modal("show");
}

function deleteRowInput(numberRow) {
    var input = $("#nomeInput_" + numberRow);
    input.parent().remove();
}

function blanckInputFields() {
    $("#nomeInputRichiesti").val("");
    $("#tipoInputRichiesti").val("");
    $("#docRifInputRichiesti").val("");
}

function blanckOutputFields() {
    $("#nomeOutputProdotti").val("");
    $("#tipoOutputProdotti").val("");
}

function editRowOutput(numberRow) {
    var nome = $("#nomeOutput_" + numberRow)
        .html()
    //.replace(/\s/g, "");
    var ruolo = $("#tipoOutput_" + numberRow).html();
    //alert(ruolo)
    $("#numberOfRowOutputEdit").val(numberRow);

    $("#nomeOutputProdottiEdit").val(nome);
    //    $("#tipoInputRichiestiEdit option[value='" + ruolo+ "' ]").attr("selected" , "selected");
    $("#tipoOutputProdottiEdit").val(ruolo);

    $("#modalOutputProdottiEdit").modal("show");
}

function deleteRowOutput(numberRow) {
    var input = $("#nomeOutput_" + numberRow);
    input.parent().remove();
}

function getChildren(idAppend, idFields, containerBlankChildren) {
    var getChildren =
        'channelIdLang={"identifier":"' + idFields + '","language":"it"}';
    $("#" + idAppend).html("");
    var name = "sgichannel"
    var collection = "channels/getChildListById"
    var query = ""
    var environment
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("POST", url, getChildren);
    if (objData.success) {
        var data = objData.data;
        if (
            data.response == [] ||
            data.response == "" ||
            data.response == undefined ||
            data.response.length == 0
        ) {
            $("." + containerBlankChildren).slideUp();
        } else {
            $("." + containerBlankChildren).slideDown();

            $("#" + idAppend).append(
                "<option disabled selected value>Scegli</option>"
            );
            $.each(data.response, function (i, field) {
                $("#" + idAppend).append(
                    "<option id='" +
                    field.identifier +
                    "'>" +
                    field.description +
                    "</option>"
                );
            });
        }
    } else {
        $("#" + idAppend).html("");
        $("#" + idAppend).append("SERVIZIO NON DISPONIBILE");

    }
    // $.ajax({
    //     type: "POST",
    //     data: getChildren,
    //     headers: {
    //         "Authorization": "Basic " + btoa("nomeutente:-")
    //     },
    //     url: "https://sgichannel.xxxx/api/channels/getChildListById",
    //     success: function (data) {

    //     },
    //     error: function (data) {
    //     }
    // })

}

function getChildrenEdit(idAppend, idFields, containerBlankChildren) {
    var getChildren =
        'channelIdLang={"identifier":"' + idFields + '","language":"it"}';
    $("#" + idAppend).html("");

    var name = "sgichannel"
    var collection = "channels/getChildListById"
    var query = ""
    var environment
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("POST", url, getChildren);
    if (objData.success) {
        var data = objData.data;
        if (
            data.response == [] ||
            data.response == "" ||
            data.response == undefined ||
            data.response.length == 0
        ) {
            $("." + containerBlankChildren).slideUp();
        } else {
            $("." + containerBlankChildren).slideDown();

            $("#" + idAppend).append(
                "<option disabled selected value>Scegli</option>"
            );
            //                    var count = 0;
            $.each(data.response, function (i, field) {
                $("#" + idAppend).append(
                    "<option value='" +
                    field.description +
                    "' id='" +
                    field.identifier +
                    "'>" +
                    field.description +
                    "</option>"
                );
                //                        count++;
            });
        }


        popolateOtherFields();
        $("#" + idAppend).trigger("change")
    } else {

        $("#" + idAppend).html("");
        $("#" + idAppend).append("SERVIZIO NON DISPONIBILE");
    }

    // $.ajax({
    //         type: "POST",
    //         data: getChildren,
    //         headers: {
    //             "Authorization": "Basic " + btoa("nomeutente:-")
    //         },
    //         url: "https://sgichannel.xxxx/api/channels/getChildListById",
    //         success: function (data) {
    //             $("#wait").css("display", "block");
    //             // if (
    //             //   data.response == [] ||
    //             //   data.response == "" ||
    //             //   data.response == undefined ||
    //             //   data.response.length == 0
    //             // ) {
    //             //   $("." + containerBlankChildren).slideUp();
    //             // } else {
    //             //   $("." + containerBlankChildren).slideDown();

    //             //   $("#" + idAppend).append(
    //             //     "<option disabled selected value>Seleziona una scelta</option>"
    //             //   );
    //             //   //                    var count = 0;
    //             //   $.each(data.response, function(i, field) {
    //             //     $("#" + idAppend).append(
    //             //       "<option value='" +
    //             //         field.description +
    //             //         "' id='" +
    //             //         field.identifier +
    //             //         "'>" +
    //             //         field.description +
    //             //         "</option>"
    //             //     );
    //             //     //                        count++;
    //             //   });
    //             // }
    //             // $("#" + idAppend).trigger("change")
    //             // $("#" + idFields).trigger("change")

    //             // $("#" + idAppend).trigger("change")
    //             console.log(data);
    //         },
    //         error: function (data) {
    //             $("#wait").css("display", "block");

    //         }
    //     })
    //     .done(function (data) {


    //         $("#wait").css("display", "none");
    //     })
    //     .fail(function () {
    //         $("#wait").css("display", "none");
    //     });
}

function popolateAutocompleteOrganizz(insertWord, response) {
    //$("#wait").css("display", "block");
    startWait("modalOrganizz", "Ricerca organizzazioni...");

    var name = "sgiorganization"
    var collection = "organizations"
    var query = ""
    if ($("#selectChoiceQuery").val() == "codiceIpa") {
        query = '?filter={"where":{"organizationCode":{"like":"' +
            insertWord +
            '.*","options":"i"}},"limit":20}';

    } else if ($("#selectChoiceQuery").val() == "nomeOrganizzazione") {
        query = '?filter={"where":{"name":{"like":"' +
            insertWord +
            '.*","options":"i"}}}'
    }
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("GET", url);
    if (objData.success) {
        var data = objData.data
        var appName = [];

        $.each(data, function (i, field) {
            appName.push(field.name);
        });

        response(appName);
        stopWait("modalOrganizz")
    } else {
        stopWait("modalOrganizz")
    }


    //     $.ajax({
    //             dataType: "json",
    //             url: 'https://sgiorganization.xxxx/api/organizations?filter={"where":{"or":[{"name":{"like":"' +
    //                 insertWord +
    //                 '.*","options":"i"}},{"organizationCode":{"like":"' +
    //                 insertWord +
    //                 '.*","options":"i"}}]},"limit":20}',
    //             success: function (data) {
    //                 //$("#wait").css("display", "block");
    //                 var appName = [];

    //                 $.each(data, function (i, field) {
    //                     appName.push(field.name);
    //                 });

    //                 response(appName);
    //                 stopWait("modalOrganizz")
    //             },
    //             error: function (data) {
    //                 stopWait("modalOrganizz")
    //                 //$("#wait").css("display", "block");
    //             }
    //         })
    //         .done(function () {
    //             stopWait("modalOrganizz")
    //             //$("#wait").css("display", "none");
    //         })
    //         .fail(function () {
    //             stopWait("modalOrganizz");
    //             //$("#wait").css("display", "none");
    //         });
}

function popolateCanaliErogazione(numberFields) {
    var number = $("#divPopolateCanaliErogazione")
        .children()
        .attr("id");
    number++;
    var container = $("#divPopolateCanaliErogazione");
    var html = "";
    var numberInput = $("#containerAllInput :visible :input").length;
    var input = $("#containerAllInput :visible :input");
    var a = 0;
    // var tipoText = $("#tipoCanaleErog").children(":selected").val()==null ? "-" : $("#tipoCanaleErog").children(":selected").val()

    // var rowFormGroup = '<div class="form-group row" id="' + number + '">';
    var buttonAction =
        '<td><button type="button" onClick="editRowCanErog(' +
        number +
        ", " +
        numberFields +
        ' )" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button> <button type="button" onClick="deleteRowCanErog(' +
        number +
        ')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>';

    var tipo =
        '<tr id="' +
        number +
        '"><td id="nomeOutput_' +
        number +
        '"><span id="' +
        $(input[a]).attr("id") +
        "_" +
        number +
        '" identifier="' +
        $("#tipoCanaleErog")
        .children(":selected")
        .attr("id") +
        '" >' +
        $("#tipoCanaleErog")
        .children(":selected")
        .val() +
        "</span></td><td>";
    var closeInformazione = "</td>";
    a++;
    // html += rowFormGroup;
    // html += labelNome;
    //    html+=col
    html += tipo;
    // html += informazione;
    // numberInput++;
    for (a; a < numberInput; a++) {
        var value =
            $(input[a]).val() == "" || $(input[a]).val() == null ?
            " " :
            $(input[a]).val();
        if ($(input[a]).is("select")) {
            html +=
                "<div style='margin-left:0px' class='row'><span identifier= '" +
                $(input[a])
                .children(":selected")
                .attr("id") +
                "' id='" +
                $(input[a]).attr("id") +
                "_" +
                number +
                "'>" +
                value +
                "</span> </div>";
            value = "";
        } else {
            html +=
                "<div style='margin-left:0px' class='row'><span id='" +
                $(input[a]).attr("id") +
                "_" +
                number +
                "'>" +
                value +
                "</span> </div>";
            value = "";
        }
    }
    //    html+=closeDiv

    html += closeInformazione;
    html += buttonAction;

    container.prepend(html);
}

function editRowCanErog(number, numberFields) {
    $("#numberRow").val(number);

    var lengthInput = $("#divPopolateCanaliErogazione #" + number + " span")
        .length;
    var parent = $("#divPopolateCanaliErogazione #" + number + " span");
    var a = 2;
    $("#tipoCanaleErogEdit option:selected").removeAttr("selected");
    var test = false;
    $.map(parent, function (val, i) {
        if (i == 0) {
            var id = $("#" + val.id).attr("id");
            var idInput = id.substring(0, id.indexOf("_")) + "Edit";
            $("#" + idInput + ' option[value="' + $("#" + val.id).text() + '"]')
                .attr("selected", "selected")
                .trigger("change");
            //            var selected = $("#tipoCanaleErogEdit").children(":selected").attr("id");
            //            showFieldsInputEdit(selected);
        }
    });
    $("#modalCanaliErogazioneEdit").modal("show");
}

function deleteRowCanErog(number) {
    $("#numberRow").val(number);
    //tipoCanaleErog_1
    var parent = $("#divPopolateCanaliErogazione #" + number).remove();
    //    var lengthInput = $('#divPopolateCanaliErogazione #'+ number +' span').length;
    //    var parent = $('#divPopolateCanaliErogazione #'+ number +' span');
    //    var a = 2;
    //    $('#tipoCanaleErogEdit option:selected').removeAttr("selected")
    //    var test = false;
    //    $.map(parent , function(val, i ){
    //
    //        if(i == 2){
    //            var id=$("#"+val.id).attr("id");
    //            var idInput = id.substring(0, id.indexOf("_"))+"Edit";
    //            $('#' +idInput + ' option[value="'+ $("#"+val.id).text()+'"]').attr("selected", "selected").trigger("change");
    //            //            var selected = $("#tipoCanaleErogEdit").children(":selected").attr("id");
    //            //            showFieldsInputEdit(selected);
    //
    //        }
    //
    //
    //    })
    //    $('#modalCanaliErogazioneEdit').modal('show');
}

function popolateOtherFields() {
    var number = $("#numberRow").val();
    $("#numberOfRowErogCan").val(number);
    var lengthInput = $("#divPopolateCanaliErogazione #" + number + " span")
        .length;
    var parent = $("#divPopolateCanaliErogazione #" + number + " span");
    var a = 2;
    //    $('#tipoCanaleErogEdit option:selected').removeAttr("selected")
    $.map(parent, function (val, i) {
        if (i > 0) {
            if (val.id != "") {
                var id = $("#" + val.id).attr("id");
                var idInput = id.substring(0, id.indexOf("_")) + "Edit";
                if ($("#" + idInput).is("select")) {
                    $(
                        "#" + idInput + ' option[value="' + $("#" + val.id).text() + '"]'
                    ).attr("selected", "selected");
                } else {
                    var valueText =
                        $("#" + val.id).text() == " " ? "" : $("#" + val.id).text();
                    $("#" + idInput).val(valueText);
                }
            }
        }
    });
}

function salvaFile(data) {
    startWait("fine", "Salvataggio in corso...")
    if (sessionStorage.getItem("userId")) {
        $("#userId").val(sessionStorage.getItem("userId"));
    }

    if (sessionStorage.getItem("serviceId")) {
        $("#serviceId").val(sessionStorage.getItem("serviceId"));
    }

    if (sessionStorage.getItem("templateRef")) {
        $("#templateRef").val(sessionStorage.getItem("templateRef"));
    }

    if (sessionStorage.getItem("cpa")) {
        $("#codiceIpa").val(sessionStorage.getItem("cpa"));
    }

    console.log(data);
    $.map(data, function (value, id) {
        if (id == "input") {
            var length = $("#popolateInputDiv").children().attr("id");
            length++
            var a;
            data["input"] = [];
            for (a = 0; a < length; a++) {

                var tipoDoc = $("#popolateInputDiv #" + a + " #documInput_" + a).html() == null ? "-" : $("#popolateInputDiv #" + a + " #documInput_" + a).html()
                var nomeInput = $("#popolateInputDiv #" + a + " #nomeInput_" + a).html()
                var tipoInput = $("#popolateInputDiv #" + a + " #tipoInput_" + a).html() == null ? "-" : $("#popolateInputDiv #" + a + " #tipoInput_" + a).html();

                if (tipoDoc != undefined && tipoDoc != "") var tipoDocStr = tipoDoc.replace(/"/g, '\\"');
                if (nomeInput != undefined && nomeInput != "") var nomeInputStr = nomeInput.replace(/"/g, '\\"');

                if (tipoInput != undefined &&
                    tipoDoc != undefined &&
                    nomeInput != undefined) {
                    var inputArray =
                        '{"docRifInputRichiesti":' +
                        '"' +
                        tipoDocStr +
                        '",  "nomeInputRichiesti":"' +
                        nomeInputStr +
                        '","tipoInputRichiesti":{"identifier": "","rdfUri": "","label":"' +
                        tipoInput +
                        '", "language": "it"}}';
                    inputArray.toString();
                    var myObj = JSON.parse(inputArray);
                    data["input"].push(myObj);
                }
            }
        } else if (id == "output") {
            var length = $("#popolateOutputDiv").children().attr("id");
            length++
            var a;
            data["output"] = [];
            for (a = 0; a < length; a++) {
                var nomeOutput = $("#popolateOutputDiv #" + a + " #nomeOutput_" + a).html()
                var tipoOutput = $("#popolateOutputDiv #" + a + " #tipoOutput_" + a).html();
                if (nomeOutput != undefined && nomeOutput != "") nomeOutput.replace(/"/g, '\\"');
                if (nomeOutput != undefined &&
                    tipoOutput != undefined) {
                    var inputArray =
                        '{"nomeOutputProdotti":"' +
                        nomeOutput +
                        '","tipoOutputProdotti":{"identifier": "","rdfUri": "","label":"' +
                        tipoOutput +
                        '", "language": "it"}}';
                    inputArray.toString();
                    var myObj = JSON.parse(inputArray);
                    data["output"].push(myObj);
                }
            }
        } else if (id == "paroleChiaveClass") {
            data[id] = [];
            $.each($("#" + id).tagsinput("items"), function (i, val) {
                data[id].push(val);
            });
        } else if (id == "temporalCoverage") {
            var length = $("#popolateCopertTemporaleDiv tr").attr("id");
            length++
            for (var a = 0; a < length; a++) {
                var obj = {}
                var giorniDaCopert = ($("#giorniDaCopert_" + a).html() == null || $("#giorniDaCopert_" + a).html() == undefined) ? "" : $("#giorniDaCopert_" + a).html();
                var giorniDaCopertOra = ($("#giorniDaCopertOra_" + a).html() == null || $("#giorniDaCopertOra_" + a).html() == undefined) ? "" : $("#giorniDaCopertOra_" + a).html();
                var giorniACopert = ($("#giorniACopert_" + a).html() == null || $("#giorniACopert_" + a).html() == undefined) ? "" : $("#giorniACopert_" + a).html();
                var giorniACopertOra = ($("#giorniACopertOra_" + a).html() == null || $("#giorniACopertOra_" + a).html() == undefined) ? "" : $("#giorniACopertOra_" + a).html();
                obj.startInterval = giorniDaCopert + "-" + giorniDaCopertOra;
                obj.endInterval = giorniACopert + "-" + giorniACopertOra;

                if ($("#giorniCopert_" + a).html()) {
                    obj.weekDays = []
                    var days = $("#giorniCopert_" + a).html().split(",");
                    var daysToPost = []
                    for (var a = 0; a < days.length; a++) {
                        switch (days[a]) {
                            case "Lunedì":
                                daysToPost.push("Mon");
                                break;
                            case "Martedì":
                                daysToPost.push("Tue");
                                break;
                            case "Mercoledì":
                                daysToPost.push("Wed");
                                break;
                            case "Giovedì":
                                daysToPost.push("Thu");
                                break;
                            case "Venerdì":
                                daysToPost.push("Fri");
                                break;
                            case "Sabato":
                                daysToPost.push("Sat");
                                break;
                            case "Domenica":
                                daysToPost.push("Sun");
                                break;
                        }
                    }
                    daysToPost = daysToPost + ""
                    obj.weekDays.push(daysToPost);
                }
                data[id].push(obj)
            }
            // if (val == "giornoCheck") {
            //     data.temporalCoverage.giornoCheck = [];
            //     $.each($('input[name="giornoCheck[]"]:checked'), function (i, val) {
            //         data.temporalCoverage.giornoCheck.push($(val).val());
            //     });
            // } else {
            //     var date = $("#" + val).val();
            //     var ora = $("#" + val + "Ora").val();
            //     if (date != undefined)
            //         //data.temporalCoverage[val] = new Date(date.concat(" " + ora));
            //         data.temporalCoverage[val] = date.concat("-" + ora);
            // }
        } else if (id == "settoreservizio_1") {
            data[id] = [];
            data["settoreservizio_2"] = [];
            data["settoreservizio_3"] = [];
            data["settoreservizio_4"] = [];

            var a = id.substring(id.indexOf("_"), id.length);
            var lengthServizio = $("#popolateSettoreDiv")
                .children()
                .attr("id");
            lengthServizio++;
            var init = 0;
            var appArrayServ = [];
            for (init = 0; init < lengthServizio; init++) {
                if ($("#serviziotipo_" + init).attr("number") != undefined) {
                    var valueSett1 =
                        $("#serviziotipo_" + init).attr("number") == "undefined" ?
                        "-" :
                        $("#serviziotipo_" + init).attr("number");
                    var valueSett2 =
                        $("#serviziosottotipo2_" + init).attr("number") == "undefined" ?
                        "-" :
                        $("#serviziosottotipo2_" + init).attr("number");
                    var valueSett3 =
                        $("#serviziosottotipo3_" + init).attr("number") == "undefined" ?
                        "-" :
                        $("#serviziosottotipo3_" + init).attr("number");
                    var valueSett4 =
                        $("#serviziosottotipo4_" + init).attr("number") == "undefined" ?
                        "-" :
                        $("#serviziosottotipo4_" + init).attr("number");
                    data["settoreservizio_1"].push(valueSett1);
                    data["settoreservizio_2"].push(valueSett2);
                    data["settoreservizio_3"].push(valueSett3);
                    data["settoreservizio_4"].push(valueSett4);
                }
            }
        } else if (id == "organizations") {
            data[id] = [];
            var lengthTr = 0;
            var lengthTr = $("#bodyOrganizz").children().attr("id")
            console.log(lengthTr)
            lengthTr++;
            for (var a = 0; a < lengthTr; a++) {

                if ($("#" + a + "_organizz").html() != "" && $("#" + a + "_organizz").html() != undefined) var organizz = $("#" + a + "_organizz").html().replace(/"/g, '\\"');
                if ($("#" + a + "_dal").html() != "" && $("#" + a + "_dal").html() != undefined) var dal = $("#" + a + "_dal").html().replace(/"/g, '\\"');
                if ($("#" + a + "_al").html() != "" && $("#" + a + "_al").html() != undefined) var al = $("#" + a + "_al").html().replace(/"/g, '\\"');
                if ($("#" + a + "_ruolo").html() != "" && $("#" + a + "_ruolo").html() != undefined) var ruolo = $("#" + a + "_ruolo").html().replace(/\s/g, "")
                var orgStr = organizz == "" || organizz == " " ? "-" : organizz
                var dalStr = dal == "" || dal == " " ? "-" : dal
                var alStr = al == "" || al == " " ? "-" : al
                var ruoloStr = ruolo == "" || ruolo == " " ? "-" : ruolo
                if (orgStr != "-" || dalStr != "-" || alStr != "-" || ruoloStr != "-" ||
                    orgStr != undefined || dalStr != undefined || alStr != undefined || ruoloStr != undefined) {
                    var input =
                        '{"type": "","organizz": "' +
                        orgStr +
                        '", "name": "","ruolo": "' +
                        ruoloStr +
                        '","date": [{"dal": "' +
                        dalStr +
                        '","al": "' +
                        alStr +
                        '"}]}';
                    var myObj = JSON.parse(input);
                    data[id].push(myObj);
                }
            }
        } else if (id == "channels") {
            var lengthChannel = $("#divPopolateCanaliErogazione")
                .children()
                .attr("id");
            lengthChannel++;
            data["channels"]["offlineChannels"] = [];
            data["channels"]["webApplications"] = [];
            data["channels"]["phones"] = [];
            data["channels"]["emails"] = [];
            data["channels"]["otherElectronicChannels"] = [];
            for (var a = 1; a < lengthChannel; a++) {
                var appToSwitch = "tipoCanaleErog_" + a;
                appToSwitch = $("#" + appToSwitch).html();
                switch (appToSwitch) {
                    case "Non Telematico":
                        {
                            var fieldNonTelematico1 =
                                $("#tipoCanaleNonTelematico_" + a).attr("identifier") ==
                                "undefined" || $("#tipoCanaleNonTelematico_" + a).attr("identifier") ==
                                undefined ?
                                "-" : $("#tipoCanaleNonTelematico_" + a).attr("identifier");
                            var fieldNonTelematico2 =
                                $("#sottotipoCanaleNonTelematico_" + a).attr("identifier") ==
                                "undefined" || $("#sottotipoCanaleNonTelematico_" + a).attr("identifier") ==
                                undefined ?
                                "-" : $("#sottotipoCanaleNonTelematico_" + a).attr("identifier");

                            var inputOffline =
                                '{"type":"' +
                                fieldNonTelematico1 +
                                '","subType": "' +
                                fieldNonTelematico2 +
                                '","locationName": {"language": "it","description": "' +
                                $("#locationNameErogCan_" + a).html().replace(/"/g, '\\"') +
                                '"},"streetType":" ' +
                                $("#streetTypeErogCan_" + a).html().replace(/"/g, '\\"') +
                                '","streetName": "' +
                                $("#streetNameErogCan_" + a).html().replace(/"/g, '\\"') +
                                '","number": "' +
                                $("#numberErogCan_" + a).html().replace(/"/g, '\\"') +
                                '","city": "' +
                                $("#cityErgoCan_" + a).html().replace(/"/g, '\\"') +
                                '","postCode": "' +
                                $("#postCodeErogCan_" + a).html().replace(/"/g, '\\"') +
                                '","geometry": {"type": "' +
                                $("#typeGeometryErogCan_" + a).html().replace(/"/g, '\\"') +
                                '","latitude": "' +
                                $("#latitudeCanErog_" + a).html().replace(/"/g, '\\"') +
                                '","longitude":"' +
                                $("#longitudeCanErog_" + a).html().replace(/"/g, '\\"') +
                                '"}}';

                            inputOffline = JSON.parse(inputOffline);
                            data["channels"]["offlineChannels"].push(inputOffline);
                            break;
                        }
                    case "Sito Web":
                        {
                            var fieldWebSites1 =
                                $("#tipoCanaleSitoWeb_" + a).attr("identifier") == "undefined" ?
                                "-" : $("#tipoCanaleSitoWeb_" + a).attr("identifier");

                            var inputWebSites =
                                ' {"type": "' +
                                fieldWebSites1 +
                                '","url": "' +
                                $("#urlWebApplErogCan_" + a).html() +
                                '"}';
                            inputWebSites = JSON.parse(inputWebSites);
                            data["channels"]["webApplications"].push(inputWebSites);
                            break;
                        }
                    case "Telefono":
                        {
                            var fieldTelefono1 =
                                $("#tipoCanaleTelefonico_" + a).attr("identifier") == "undefined" ?
                                "-" : $("#tipoCanaleTelefonico_" + a).attr("identifier");

                            var inputPhone =
                                '{"type": "' +
                                fieldTelefono1 +
                                '","phoneNumber": "' +
                                $("#phoneNumberErogCan_" + a).html().replace(/"/g, '\\"') +
                                '"}';
                            inputPhone = JSON.parse(inputPhone);
                            data["channels"]["phones"].push(inputPhone);
                            break;
                        }
                    case "Email":
                        {
                            var fieldEmail1 =
                                $("#tipoCanaleEmail_" + a).attr("identifier") == "undefined" ?
                                "-" : $("#tipoCanaleEmail_" + a).attr("identifier");

                            var inputEmail =
                                '{"type": "' +
                                fieldEmail1 +
                                '","email":"' +
                                $("#emailErogCan_" + a).html().replace(/"/g, '\\"') +
                                '"}';
                            inputEmail = JSON.parse(inputEmail);
                            data["channels"]["emails"].push(inputEmail);
                            break;
                        }
                    case "Altro telematico":
                        {
                            var fieldAltro1 =
                                $("#tipoAltroCanale_" + a).attr("identifier") == "undefined" ?
                                "-" : $("#tipoAltroCanale_" + a).attr("identifier");
                            var fieldAltro2 =
                                $("#sottotipoAltroCanale_" + a).attr("identifier") == "undefined" ?
                                "-" : $("#sottotipoAltroCanale_" + a).attr("identifier");

                            var inputOtherElectronic =
                                ' {"type": "' +
                                fieldAltro1 +
                                '","subType": "' +
                                fieldAltro2 +
                                '","accessReference": {"language": "it","description": "' +
                                $("#accessReferenceCanErog_" + a).html().replace(/"/g, '\\"') +
                                '"}}';
                            inputOtherElectronic = JSON.parse(inputOtherElectronic);
                            data["channels"]["otherElectronicChannels"].push(
                                inputOtherElectronic
                            );
                            break;
                        }
                }
            }
        } else if (id == "contacts") {
            data[id] = [];
            var lengthTr = $("#bodyContatti")
                .children().attr("id")
            lengthTr++;
            for (var a = 0; a < lengthTr; a++) {

                var nome = $("#" + a + "_nomeContatto").html() == undefined || $("#" + a + "_nomeContatto").html() == " " ? "-" : $("#" + a + "_nomeContatto").html().replace(/"/g, '\\"')
                var telefono = $("#" + a + "_telefonoContatto").html() == undefined || $("#" + a + "_telefonoContatto").html() == " " ? "-" : $("#" + a + "_telefonoContatto").html().replace(/"/g, '\\"')
                var email = $("#" + a + "_emailContatto").html() == undefined || $("#" + a + "_emailContatto").html() == " " ? "-" : $("#" + a + "_emailContatto").html().replace(/"/g, '\\"')
                var url = $("#" + a + "_urlContatto").html() == undefined || $("#" + a + "_urlContatto").html() == " " ? "-" : $("#" + a + "_urlContatto").html().replace(/"/g, '\\"')
                if (nome != "-" ||
                    telefono != "-" ||
                    email != "-" ||
                    url != "-") {
                    var input =
                        ' {"office": {"language": "it","nomeContatto": "' +
                        nome +
                        '"},"telefonoContatto": "' +
                        telefono +
                        '","emailContatto": "' +
                        email +
                        '","urlContatto": "' +
                        url +
                        '"}';
                    var myObj = JSON.parse(input);
                    data[id].push(myObj);
                }
            }
        } else if ($('input[name="' + id + '[]"]:checkbox').length > 0) {
            data[id] = [];
            $.each($('input[name="' + id + '[]"]:checked'), function (i, val) {
                data[id].push(val.value);
            });
            //            data['"'+id+'"'].push(checkVar)
        } else if (id == "radioOptionLivIner") {
            data[id] = $('input[name="radioOption"]:checked').attr("id");

            //            data['"'+id+'"'].push(checkVar)
        } else if (id == "radioOptionStato") {
            data[id] = $('input[name="radioOptionStatus"]:checked').val();

            //            data['"'+id+'"'].push(checkVar)
        } else if (id == "tempoProcessamento") {
            data[id] = [];
            var tempoUnita = $("#tempoProcessamentoUnita").val() == undefined ? "-" : $("#tempoProcessamentoUnita").val();
            var tempoProcessamento = $("#tempoProcessamento").val() == undefined ? "-" : $("#tempoProcessamento").val();

            var insert =
                '{"unit":"' +
                tempoUnita +
                '","value":"' +
                tempoProcessamento +
                '"}';

            insert = JSON.parse(insert);
            data[id].push(insert);

            //            data['"'+id+'"'].push(checkVar)
        } else if (id == "inputCoperturaGeog") {
            data[id].regione = [];
            data[id].comune = [];
            data[id].provincia = [];
            var length = $("#popolateCopertDivDiv")
                .children()
                .attr("id");
            length++;
            var a = 0;
            for (a = 0; a < length; a++) {
                if ($("#regione_" + a).html() != undefined) {
                    var regione = $("#regione_" + a).attr("identifier") == " " ? "-" : $("#regione_" + a).attr("identifier");
                    var provincia = $("#provincia_" + a).attr("identifier") == " " ? "-" : $("#provincia_" + a).attr("identifier");
                    var citta = $("#citta_" + a).attr("identifier") == " " ? "-" : $("#citta_" + a).attr("identifier");
                    data[id].regione.push(regione);
                    data[id].provincia.push(provincia);
                    data[id].comune.push(citta);
                }
            }
        } else if (id == "checkAuth") {
            data[id] = [];
            $("#appendField :checkbox").each(function () {
                var $this = $(this);
                if ($this.is(":checked")) {
                    data[id].push($this.attr("id"));
                }
            });
        } else if (id == "costoEuro") {
            data[id].value = [];
            data[id].description = [];

            var length = $("#bodyPopolateCosto")
                .children().attr("id");
            length++;
            var a = 0;
            for (a = 0; a < length; a++) {
                if ($("#" + a + "_costoEuro").html() != undefined) {
                    var costoEuro = $("#" + a + "_costoEuro").html() == "" || $("#" + a + "_costoEuro").html() == " " ? "-" : $("#" + a + "_costoEuro").html()
                    var descrCosto = $("#" + a + "_descrCosto").html() == "" || $("#" + a + "_descrCosto").html() == " " ? "-" : $("#" + a + "_descrCosto").html()

                    data[id].value.push(costoEuro);
                    data[id].description.push(descrCosto);
                }
            }
        } else if (id == "serviceName") {
            value = $("#nomedelservizio").val();
            data[id] = value;
        } else if (id == "serviceType") {
            value = (sessionStorage.getItem("serviceFor")) ? sessionStorage.getItem("serviceFor") : ""
            data[id] = value;
        } else {
            if (data[id] == "" || data[id] == " ") {
                value = $("#" + id).val();
                data[id] = value;
            } else {}
        }
    });
    console.log(data);
    console.log("'serviceInputdata=" + JSON.stringify(data) + "'");
    //    var serviceInputData = data;
    //    'channelIdLang={"identifier":"' + idFields + '","language":"it"}';
    //    var saveData ='"serivceInputData":'+JSON.stringify(data);

    //   var testtest = "{"+JSON.parse(saveData)+"}";
    var inputService = "serviceInputData=" + btoa(JSON.stringify(data));
    // var inputFinal = encodeURI(inputService);
    var inputFinal = inputService;
    //appInsights.trackEvent("POST", inputFinal)


    // "https://sgiservice.xxxx/api/public-services/checkAndSaveService/",


    // var name = "sgiservice";
    // var collection = "public-services/checkAndSaveService/";
    // var query = "";
    // var environment = "";
    // var url = urlComposer(name, collection, query, environment);

    // var objData = callService("POST", url, inputFinal);
    // if (objData.success) {
    //     var data = objData.data
    //     stopWait("fine");
    //     $("#insertResultProvvisorio").append("<p>" + data.result + "</p>");
    //     window.location.href = "../../dashboard";
    // } else {
    //     $("#insertResultProvvisorio").append("<p>" + data.result + "</p>");
    //     stopWait("fine");
    // }
    // let url = "https://sgiservice.xxxx/api/public-services/checkAndSaveService/"
    //let url = "http://localhost:3500/api/public-services/checkAndSaveService"

    var name = "sgiservice"
    var collection = "public-services/checkAndSaveService"
    var query = ""
    var environment
    var url = urlComposer(name, collection, query, environment);
    var objData = callService("POST", url, inputFinal);
    if (objData.success) {
        stopWait("fine");
        success(objData.data.result)
        setTimeout(function () {
            sessionStorage.setItem("serviceFor", "");
            window.location.href = "../../dashboard";

        }, 2000)
    } else {

        stopWait("fine");
        swal("Errore durante il salvataggio. Riprovare tra qualche minuto  ", {
            icon: "error",
            buttons: false
        })
    }

    // $.ajax({
    //         type: "POST",
    //         data: inputFinal,
    //         crossDomain: true,
    //         processData: false,
    //         headers: {
    //             "Authorization": "Basic " + btoa("nomeutente:-")
    //         },
    //         url: url,
    //         success: function (data) {
    //         },
    //         error: function (data) {}
    //     })
    //     .done(function (data) {
    //         stopWait("fine");
    //     })
    //     .fail(function () {
    //     });
}

function popolateServiceStatus() {
    var container = $("#divStatoServ");
    var name = "sgistandardtipo";
    var collection = "statoservs";
    var query = '?filter={"where":{"language":"it"}}';
    var query2 = "?filter[where][language]='it'";
    var environment = "";
    var url = urlComposer(name, collection, query, environment);
    var verb = "GET";
    var obj = callService(verb, url);
    if (obj.success) {
        $.each(obj.data, function (index, value) {
            var disabled = ""
            if (sessionStorage.getItem('isArchived') == 'true') {
                disabled = "disabled = true"
            }

            var html = '<div class="app-radio primary"><label><input ' + disabled + ' type="radio" value="' + value.identifier + '" id="radioOptionStatus" name="radioOptionStatus"> ' + value.description + '</label></div>'
            container.prepend(html)
        })
    } else {
        container.html("")
        var errorHtml = 'SERVIZIO NON DISPONIBILE'
        container.append(errorHtml)

    }
}

function validateCopertGeogToAdd() {
    var bool = false
    var boolCheck = false
    if ($("#dataATemp").val() ||
        $("#dataDaTemp").val() ||
        $("#dataDaTempOra").val() ||
        $("#dataATempOra").val()
    )
        bool = true

    $.each($('input[name="giornoCheck[]"]:checked'), function (i, val) {
        boolCheck = true
    });
    return bool || boolCheck

}

function validateCopertGeogToAddEdit() {
    var bool = false;
    var boolCheck = false;
    if ($("#dataATempEdit").val() ||
        $("#dataDaTempEdit").val() ||
        $("#dataDaTempOraEdit").val() ||
        $("#dataATempOraEdit").val())
        bool = true
    $.each($('input[name="giornoCheckEdit[]"]:checked'), function (i, val) {
        boolCheck = true
    });
    return bool || boolCheck

}

function validateCost() {
    if ($("#costoEuro").val() ||
        $("#descrizioneCosti").val())
        return true
    else false
}

function validateCostEdit() {
    if ($("#costoEuroEdit").val() ||
        $("#descrizioneCostiEdit").val())
        return true;
    else false;

}