$(document).ready(function(){

    var numberFields;


    $('#modalCanaliErogazioneEdit').on('show.bs.modal',function(){

        //        popolateOtherFields();
    })




    var loadInfo = false;
    var loadOrganizzazione = false;
    var loadAccesso = false;
    var loadTema = false;

    $( document ).ajaxStop(function() {
        $("#wait").css("display", "none");

    });

    $.validator.setDefaults({

        ignore: ":hidden"
    });

    $("#nomeOrganizz").autocomplete({
        source: function(request , resolve){
            popolateAutocompleteOrganizz(request.term , resolve);
        },
        minLenngth : 4
    });

    $("#nomeOrganizzEdit").autocomplete({
        source: function(request , resolve){
            popolateAutocompleteOrganizz(request.term , resolve);
        },
        minLenngth : 4
    });

    $("#nomeOrganizzSelectPA").autocomplete({
        source: function(request , resolve){
            popolateAutocompleteOrganizzSelectPA(request.term , resolve);
        },
        minLenngth : 4
    });

    //    $("#nomeOrganizz").attr("autocomplete" , "on")
    //
    //    $('#paroeChiaveClass').tagsinput({itemValue: 'id'})

    $("#infoAForm").validate({
        rules:{

            descrizioneServizio:"required",
            urlservizio:"required",
            descrizioneServizio:"required",
            altroIdentificativo:"required",
            urlservizio:"required",
            nomeInputRichiesti:"required",
            tipoInputRichiesti:"required",
            //            nomeOutputProdotti:"required",
            //            tipoOutputProdotti:"required",
            dataATemp:"required"
        },
        messages:{

            descrizioneServizio:"Campo obbligatorio",
            urlservizio:"Campo obbligatorio",
            descrizioneServizio:"Campo obbligatorio",
            altroIdentificativo:"Campo obbligatorio",
            urlservizio:"Campo obbligatorio",
            nomeInputRichiesti:"Campo obbligatorio",
            tipoInputRichiesti:"Campo obbligatorio",
            //            nomeOutputProdotti:"Campo obbligatorio",
            //            tipoOutputProdotti:"Campo obbligatorio",
            dataATemp:"required"
        },
        errorClass: "errorText",
        highlight: function (element) {
            $(element).addClass('errorInput')
        },
        unhighlight: function (element) {
            $(element).removeClass('errorInput')
        }
    });

    $("#temaAForm").validate({

        rules: {

            'temaCheck[]': "required"

        },
        messages:{


        },
        errorPlacement: function(error, element) {

            return false;

        },
        errorClass: "errorText",
        highlight: function (element) {
            if(element.id == "temaCheck"){
                $('.errorCheck').addClass('show');
                $('#divError').addClass('errorInput');
            }
            else{
                $('.errorSettore').addClass('show')
                $(element).addClass('errorInput')
            }
        },
        unhighlight: function (element) {
            if(element.id == "temaCheck"){
                $('.errorCheck').removeClass('show');
                $('#divError').removeClass('errorInput');
            }
            else{
                $('.errorSettore').removeClass('show')
                $(element).removeClass('errorInput')
            }
        }

    });

    //    $("#formKey").validate({
    //
    //        rules: {
    //
    //            testName:"required",
    //        },
    //        messages:{
    //            testName:"Campo obbligatorio"
    //
    //        },
    //        errorPlacement: function(error, element) {
    //
    //            return false;
    //
    //        },
    //        errorClass: "errorText",
    //        highlight: function (element) {
    //            if($('#testID').length>1){
    //                $(element).addClass('errorInput')
    //                return true
    //            }
    //
    //        },
    //        unhighlight: function (element) {
    //            $(element).removeClass('errorInput')
    //        }
    //
    //    });


    $("#accessoAForm").validate({

        rules:{
            modalitaautenticazione: "required",
            radioOption:"required",
            tipoCanaleErog:"required",
            costoEuro:"required"
        },
        messages:{
            modalitaautenticazione: "Campo obbligatorio",
            radioOption:"Campo obbligatorio",
            tipoCanaleErog:"Campo obbligatorio",
            costoEuro:"Campo obbligatorio"
        },
        errorClass: "errorText",
        errorPlacement: function(element , error){
            if(element[0].id=="radioOption-error"){
                $("#containerRadioLivInteraizone").after(element)
            }
            else 
                error.after(element)
        },
        highlight: function (element) {
            if(element.id =='radioOption'){
                $("#containerRadioLivInteraizone").addClass('errorInput')

            }
            else
                $(element).addClass('errorInput')
        },
        unhighlight: function (element) {
            $(element).removeClass('errorInput')
        }
    });

    $("#formOrganizz").validate({
        rules:{
            nomeOrganizz: "required",
            ruoloOrganizzModal:"required"
        },
        messages:{
            nomeOrganizz: "Campo obbligatorio",
            ruoloOrganizzModal:"Campo obbligatorio"
        },
        errorClass: "errorText",
        highlight: function (element) {
            $(element).addClass('errorInput')
        },
        unhighlight: function (element) {
            $(element).removeClass('errorInput')
        }
    }); 

    loadComponentTabInfo();

    $('#livInterazione').on('change', function() {
        $(this).valid();
    });

    $('#inputRichiesti').click(function(){
        if($(this).is(':checked')){
            $('.divOpenInput').show("slow");
        }
        else{
            $('#nomeInputRichiesti').removeClass("errorInput");
            $('#tipoInputRichiesti').removeClass("errorInput");
            $('.divOpenInput').hide("slow");
        }
    })

    $('#outputProdotti').click(function(){
        if($(this).is(':checked'))
            $('.divOpenOutput').show("slow")
        else{
            $('.divOpenOutput').hide("slow");
            //            $('#nomeOutputProdotti').removeClass("errorInput");
            //            $('#tipoOutputProdotti').removeClass("errorInput");
        }
    })

    $('#coperturaTemporale').click(function(){
        if($(this).is(':checked')){
            $('.divOpenTemp').show("slow");
            $("#dataDaTempOra").datepicker();
        }
        else{
            $('.divOpenTemp').hide("slow");
            $('#dataATemp').removeClass("dataATemp");
        }
    }) 

    $('#coperturaGeografica').click(function(){
        if($(this).is(':checked')){
            $('.divOpenGeog').show("slow");
        }
        else{
            $('.divOpenGeog').hide("slow");

        }
    })

    $('#canaliErogazione').click(function(){
        if($(this).is(':checked'))
            $('.divOpenCanErog').show("slow")
        else
            $('.divOpenCanErog').hide("slow")
    })

    $("#formContatti").validate({
        rules:{
            nomeUfficioContatti: "required",
            emailContatti:{
                required: true,
                email:true
            },
        },
        messages:{
            nomeUfficioContatti: "Campo obbligatorio",
            emailContatti:{
                required:"Campo obbligatorio",
                email:"Inserire email valida"
            },
        },
        errorClass: "errorText",
        highlight: function (element) {
            $(element).addClass('errorInput')
        },
        unhighlight: function (element) {
            $(element).removeClass('errorInput')
        }
    });

    $('#costo').click(function(){
        if($(this).is(':checked'))
            $('.divOpenCosti').show("slow")
        else
            $('.divOpenCosti').hide("slow")
    })

    $('a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
        if(e.target.tabIndex < e.relatedTarget.tabIndex){
            if(e.target.id != "fineA" && e.target.id != "temaA"){
                var formName = e.target.id;
                var form = 'Form';
                return $("#" + formName + form).valid();
            }
            else if(e.target.id == "temaA"){

                //                var isValidParoleChiave = $("#formKey").valid();

                //                var isValidTemaForm =  

                //                return isValidParoleChiave && isValidTemaForm;
                return $("#temaAForm").valid();;
            }
        }

    })

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if(e.target.id == "accessoA"){
            if(!loadAccesso){
                loadAccesso= true;
                loadComponentTabAccesso();
            }
            //            setTimeout($('#livInterazione').select2({"width": "100%" , placeholder: "Please select a country",allowClear: true}),2000);

        }
        else if(e.target.id == "organizzazioneA"){
            if (!loadOrganizzazione){
                loadOrganizzazione = true;
                loadComponentTabOrganizzazione();
            }
        }
        else if(e.target.id =="temaA"){
            if(!loadTema){
                loadComponentTabTema();
                loadTema=true
                $(".bootstrap-tagsinput").children().attr("name","bootstrapTags").attr("id" , "bootstrapTags");
            }
        }
        else
            return
    })


    $('#tipoCanaleErog').change(function(){
        var selected = $(this).children(":selected").attr("id");
        showFieldsInput(selected);
    })

    $('#tipoCanaleErogEdit').change(function(){
        var selected = $(this).children(":selected").attr("id");
        //        $('#containerInputEdit').html('')
        showFieldsInputEdit(selected);
    })

    $("#tipoCanaleNonTelematico").change(function(){
        var self = $(this);
        loadSubTypeNonTelematico(self);
    })

    $("#tipoCanaleSitoWeb").change(function(){
        var self = $(this);
        loadSubTypeSitoWeb(self);
    })

    $("#tipoCanaleTelefonico").change(function(){
        var self = $(this);
        loadSubTypePhone(self);
    })

    $("#tipoAltroCanale").change(function(){
        var self = $(this);
        loadSubTypeAltriCanali(self);
    })



    $("#tipoCanaleNonTelematicoEdit").change(function(){
        var self = $(this);
        loadSubTypeNonTelematicoEdit(self);
    })

    $("#tipoCanaleSitoWebEdit").change(function(){
        var self = $(this);
        loadSubTypeSitoWebEdit(self);
    })

    $("#tipoCanaleTelefonicoEdit").change(function(){
        var self = $(this);
        loadSubTypePhoneEdit(self);
    })

    $("#tipoAltroCanaleEdit").change(function(){
        var self = $(this);
        loadSubTypeAltriCanaliEdit(self);
    })


    $("#btnEditOrganizz").click(function(e){
        var nome = $("#nomeOrganizzEdit").val();
        var ruolo = $("#ruoloOrganizzModalEdit").val();
        var dal = $('#dalOrganizzEdit').val();
        var al = $('#alOrganizzEdit').val();
        var number = $("#numberOfRowOrganization").val();
        $("#"+number+"_organizz").html(nome)
        $("#"+number+"_ruolo").html(ruolo)
        $("#"+number+"_dal").html(dal)
        $("#"+number+"_al").html(al)
        $("#nomeOrganizzEdit").val("");
        //        $("#ruoloOrganizzModalEdit").val("");
        $('#dalOrganizzEdit').val("");
        $('#alOrganizzEdit').val("");
        $('#modalOrganizzEdit').modal('hide');
    })

    $("#btnEditContacts").click(function(e){
        var nomeContatto = $("#nomeUfficioContattiEdit").val();
        var emailContatto = $("#emailContattiEdit").val();
        var telefonoContatto = $('#telefonoContattiEdit').val();
        var urlContatto = $('#sitoWebContattiEdit').val();
        var number = $("#numberOfRowContacts").val();
        $("#"+number+"_nomeContatto").html(nomeContatto)
        $("#"+number+"_emailContatto").html(emailContatto)
        $("#"+number+"_telefonoContatto").html(telefonoContatto)
        $("#"+number+"_urlContatto").html(urlContatto)
        $("#nomeOrganizzEdit").val("");
        //        $("#ruoloOrganizzModalEdit").val("");
        $('#dalOrganizzEdit').val("");
        $('#alOrganizzEdit').val("");
        $('#modalContattiEdit').modal('hide');
    })

    $('#btnAggiungiOrganizz').click(function(){
        popolateOrganization();
    })

    $('#btnAggiungiContatti').click(function(){
        if($("#formContatti").valid() == true){
            //            $('#modalContatti').modal('hide');
            popolateContatti();

        }
    })

    $("#aggiungiInputRichiesti").click(function(e){
        blanckInputFields();
    })

    $("#settoreservizio").change(function(e){
        //        console.log($(this).children(":selected").attr("id"))
    });
    //    })


    $("#btnAggiungiInput").click(function(e){
        popolateInputFields();
    })
    $("#btnAggiungiOutput").click(function(e){
        popolateOutputFields();
    })

    $("#btnAggiungiInputEdit").click(function(e){
        var nome = $("#nomeInputRichiestiEdit").val();
        var tipo = $("#tipoInputRichiestiEdit").val();
        var doc = $("#docRifInputRichiestiEdit").val();
        var numberRow = $("#numberOfRowInputEdit").val();
        $("#nome_"+numberRow).html(nome);
        $("#tipo_"+numberRow).html(tipo);
        $("#docum_"+numberRow).html(doc);
        $("#nomeInputRichiestiEdit").val("");
        //        //        $("#ruoloOrganizzModalEdit").val("");
        $('#tipoInputRichiestiEdit').val("");
        $('#docRifInputRichiestiEdit').val("");
        $('#modalInputRichiestiEdit').modal('hide');



    })


    $("#btnAggiungiOutputEdit").click(function(e){
        var nome = $("#nomeOutputProdottiEdit").val();
        var tipo = $("#tipoOutputProdottiEdit").val();
        var numberRow = $("#numberOfRowOutputEdit").val();
        $("#outputNome_"+numberRow).html(nome);
        $("#outputTipo_"+numberRow).html(tipo);
        $("#nomeOutputProdottiEdit").val("");
        //        //        $("#ruoloOrganizzModalEdit").val("");
        $('#tipoOutputProdottiEdit').val("");
        $('#modalOutputProdottiEdit').modal('hide');
    })

    $("#btnAggiungiOutputEdit").click(function(e){
        var nome = $("#nomeOutputProdottiEdit").val();
        var tipo = $("#tipoOutputProdottiEdit").val();
        var numberRow = $("#numberOfRowOutputEdit").val();
        $("#outputNome_"+numberRow).html(nome);
        $("#outputTipo_"+numberRow).html(tipo);
        $("#nomeOutputProdottiEdit").val("");
        //        //        $("#ruoloOrganizzModalEdit").val("");
        $('#tipoOutputProdottiEdit').val("");
        $('#modalOutputProdottiEdit').modal('hide');
    })

    $("#btnCanaleErogazione").click(function(e){
        popolateCanaliErogazione();
        $('#modalCanaliErogazione').modal("hide")
    })

    $("#btnCanaleErogazioneEdit").click(function(e){

        var numberInput = $("#containerAllInputEdit :input:visible").length;
        var input = $("#containerAllInputEdit :input:visible");

        $.map(input , function(val, i ){

                var id=$("#"+val.id).attr("id");
                var idInput = id.substring(0, (id.length)-4);
                $('#' +idInput + '_'+$("#numberOfRowErogCan").val()).html(val.value)
                //            var selected = $("#tipoCanaleErogEdit").children(":selected").attr("id");
                //            showFieldsInputEdit(selected);

            })
        $('#modalCanaliErogazioneEdit').modal("hide")


    })

})

function showFieldsInput(inputSelected){
    switch (inputSelected){
        case "01":
            var container =  $('#containerInput');
            $("#containerInputWebApplication").hide("slow");

            $("#containerInputPhones").hide("slow");

            $("#containerInputEmails").hide("slow");

            $("#containerInputOfflineChannels").hide("slow");

            $("#containerInputOfflineChannels").show("slow");

            //            $.get('templateLoadChannels/offlineChannels.html',function(result){
            //                container.hide("slow")
            //                container.html('');
            //                container.append(result).show("slow");
            //            })
            getChildren("tipoCanaleNonTelematico" , inputSelected)
            break;
        case "02":
            var container =  $('#containerInput');
            $("#containerInputOfflineChannels").hide("slow");

            $("#containerInputPhones").hide("slow");

            $("#containerInputEmails").hide("slow");

            $("#containerInputOfflineChannels").hide("slow");

            $("#containerInputWebApplication").show("slow");
            //            $.get('templateLoadChannels/webApplications.html',function(result){
            //                container.hide("slow")
            //                container.html('');
            //                container.append(result).show("slow");
            //            })
            getChildren("tipoCanaleSitoWeb" , inputSelected)

            break;
        case "03":
            var container =  $('#containerInput');
            $("#containerInputOfflineChannels").hide("slow");

            $("#containerInputWebApplication").hide("slow");

            $("#containerInputEmails").hide("slow");

            $("#containerInputOfflineChannels").hide("slow");

            $("#containerInputPhones").show("slow");
            //            $.get('templateLoadChannels/phones.html',function(result){
            //                container.hide("slow")
            //                container.html('');
            //                container.append(result).show("slow");
            //            })
            getChildren("tipoCanaleTelefonico" , inputSelected)

            break;
        case "04":
            var container =  $('#containerInput');
            $("#containerInputOfflineChannels").hide("slow");

            $("#containerInputWebApplication").hide("slow");

            $("#containerInputPhones").hide("slow");

            $("#containerInputOfflineChannels").hide("slow");

            $("#containerInputEmails").show("slow");
            //            $.get('templateLoadChannels/emails.html',function(result){
            //                container.hide("slow")
            //                container.html('');
            //                container.append(result).show("slow");
            //            })
            getChildren("tipoCanaleEmail" , inputSelected)

            break;
        case "05":
            var container =  $('#containerInput');
            $("#containerInputOfflineChannels").hide("slow");

            $("#containerInputWebApplication").hide("slow");

            $("#containerInputPhones").hide("slow");

            $("#containerInputEmails").hide("slow");

            $("#containerInputOtherElectronicChannels").show("slow");
            //            $.get('templateLoadChannels/otherElectronicChannels.html',function(result){
            //                container.hide("slow")
            //                container.html('');
            //                container.append(result).show("slow");
            //            })
            getChildren("tipoAltroCanale" , inputSelected)

            break;
                         }

}


function showFieldsInputEdit(inputSelected){
    switch (inputSelected){
        case "01":
            var container =  $('#containerInputEdit');
            $("#containerInputWebApplicationEdit").hide("slow");

            $("#containerInputPhonesEdit").hide("slow");

            $("#containerInputEmailsEdit").hide("slow");

            $("#containerInputOtherElectronicChannelsEdit").hide("slow");

            $("#containerInputOfflineChannelsEdit").show("slow");

            //            $.get('templateLoadChannels/offlineChannelsEdit.html',function(result){
            //                container.hide("slow")
            //                container.append(result).show("slow");
            //            })
            getChildrenEdit("tipoCanaleNonTelematicoEdit" , inputSelected)
            break;
        case "02":
            var container =  $('#containerInputEdit');
            $("#containerInputOfflineChannelsEdit").hide("slow");

            $("#containerInputPhonesEdit").hide("slow");

            $("#containerInputEmailsEdit").hide("slow");

            $("#containerInputOtherElectronicChannelsEdit").hide("slow");

            $("#containerInputWebApplicationEdit").show("slow");
            //            $.get('templateLoadChannels/webApplicationsEdit.html',function(result){
            //                container.hide("slow")
            //                container.append(result).show("slow");
            //            })
            getChildrenEdit("tipoCanaleSitoWebEdit" , inputSelected)

            break;
        case "03":
            var container =  $('#containerInputEdit');
            $("#containerInputOfflineChannelsEdit").hide("slow");

            $("#containerInputWebApplicationEdit").hide("slow");

            $("#containerInputEmailsEdit").hide("slow");

            $("#containerInputOtherElectronicChannelsEdit").hide("slow");

            $("#containerInputPhonesEdit").show("slow");
            //            $.get('templateLoadChannels/phonesEdit.html',function(result){
            //                container.hide("slow")
            //                container.append(result).show("slow");
            //            })
            getChildrenEdit("tipoCanaleTelefonicoEdit" , inputSelected)

            break;
        case "04":
            var container =  $('#containerInputEdit');
            //            $.get('templateLoadChannels/emailsEdit.html',function(result){
            //                container.hide("slow")
            //                container.append(result).show("slow");
            //            })
            $("#containerInputOfflineChannelsEdit").hide("slow");

            $("#containerInputWebApplicationEdit").hide("slow");

            $("#containerInputPhonesEdit").hide("slow");

            $("#containerInputOtherElectronicChannelsEdit").hide("slow");

            $("#containerInputEmailsEdit").show("slow");
            getChildrenEdit("tipoCanaleEmailEdit" , inputSelected)

            break;
        case "05":
            var container =  $('#containerInputEdit');
            //            $.get('templateLoadChannels/otherElectronicChannelsEdit.html',function(result){
            //                container.hide("slow")
            //                container.append(result).show("slow");
            //            })
            $("#containerInputOfflineChannelsEdit").hide("slow");

            $("#containerInputWebApplicationEdit").hide("slow");

            $("#containerInputPhonesEdit").hide("slow");

            $("#containerInputEmailsEdit").hide("slow");

            $("#containerInputOtherElectronicChannelsEdit").show("slow");
            getChildren("tipoAltroCanaleEdit" , inputSelected)
            break;
                         }
}



function blankFieldContacts(){
    $('#nomeUfficioContatti').val("");
    $('#emailContatti').val("");
    $('#telefonoContatti').val("");
    $('#sitoWebContatti').val("");
}

function blankFieldOrganizz(){
    $('#nomeOrganizz').val("");
    $('#ruoloOrganizzModal').val("");
    $('#dalOrganizz').val("");
    $('#alOrganizz').val("");
}

function loadSubTypeNonTelematico(self){
    var id = self.find('option:selected').attr('id')
    getChildren('sottotipoCanaleNonTelematico' ,id);
}
function loadSubTypeNonTelematicoEdit(self){
    var id = self.find('option:selected').attr('id')
    getChildrenEdit('sottotipoCanaleNonTelematicoEdit' ,id);
}

function loadSubTypeSitoWeb(self){

    var id = self.find('option:selected').attr('id')
    //PAGOPA E PAGAM BANCARI

    getChildren('sottotipoCanaleSitoWeb' , id , 'containerSubTypeSitoWeb')
}

function loadSubTypeSitoWebEdit(self){

    var id = self.find('option:selected').attr('id')
    //PAGOPA E PAGAM BANCARI

    getChildrenEdit('sottotipoCanaleSitoWebEdit' , id , 'containerSubTypeSitoWebEdit')
}


function loadSubTypeAltriCanali(self){

    var id = self.find('option:selected').attr('id');
    //    containerSubTypeAltriCanali
    //    sottotipoAltroCanale
    getChildren('sottotipoAltroCanale' , id , 'containerSubTypeAltriCanali')


}
function loadSubTypeAltriCanaliEdit(self){

    var id = self.find('option:selected').attr('id');
    //    containerSubTypeAltriCanali
    //    sottotipoAltroCanale
    getChildrenEdit('sottotipoAltroCanaleEdit' , id , 'containerSubTypeAltriCanaliEdit')


}

function loadSubTypePhone(self){

    var id = self.find('option:selected').attr('id');
    //    containerSubTypeAltriCanali
    //    sottotipoAltroCanale
    getChildren('subtypePhonesErogCan' , id)


}
function loadSubTypePhoneEdit(self){

    var id = self.find('option:selected').attr('id');
    //    containerSubTypeAltriCanali
    //    sottotipoAltroCanale
    getChildrenEdit('subtypePhonesErogCanEdit' , id)


}

function loadComponentTabOrganizzazione(){

    $("#wait").css("display", "block");

    $.ajax({
        dataType: "json",
        url: 'http://' + sgiroletype.ip + '/' + sgiroletype.serviceName +'/api/roles/',
        success: function(data) {
            $("#wait").css("display", "block");

            popolateRoles(data);
        },
        error:function(data){
            $("#wait").css("display", "block");

            //            $("#ruoloOrganizzazioni").html("");
            $("#ruoloOrganizzModal").html("");
            $("#ruoloOrganizzModalEdit").html("");
            //            $("#ruoloOrganizzazioni").append('<option value selected disabled>SERVIZIO NON DISPONIBILE</option>');
            $("#ruoloOrganizzModal").append('<option value selected disabled>SERVIZIO NON DISPONIBILE</option>');
            $("#ruoloOrganizzModalEdit").append('<option value selected disabled>SERVIZIO NON DISPONIBILE</option>');

        }
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })
}

function popolateRoles(result){
    //    $("#ruoloOrganizzazioni").html("");
    $("#ruoloOrganizzModal").html("");
    $("#ruoloOrganizzModalEdit").html("");
    //    $("#ruoloOrganizzazioni").append('<option value selected disabled>Seleziona un campo</option>');
    $("#ruoloOrganizzModal").append('<option value selected disabled>Seleziona un campo</option>');
    $("#ruoloOrganizzModalEdit").append('<option value selected disabled>Seleziona un campo</option>');
    $.each(result, function(i, field){
        var z = result;
        var option ='<option value="' + field.value + '">'+ field.value + '</option>';
        $("#ruoloOrganizzazioni").append(option);
        $("#ruoloOrganizzModal").append(option);
        $("#ruoloOrganizzModalEdit").append(option);
    });
}

function loadComponentTabInfo(){

    $.ajax({
        dataType: "json",
        url: 'http://' + sgiserviceinputoutput.ip + '/' + sgiserviceinputoutput.serviceName +'/api/serviceinputoutputs?filter[where][language]=it',
        success: function(data) {
            $("#wait").css("display", "block");
            popolateInputOutput(data);

        },
        error:function(data){
            $("#wait").css("display", "block");
            $("#tipoInputRichiesti").html("");
            $("#tipoOutputProdotti").html("");
            $("#tipoInputRichiestiEdit").html("");
            $("#tipoInputRichiesti").append("<option value selected disabled>SERVIZIO NON DISPONIBILE</option>");
            $("#tipoOutputProdotti").append("<option value selected disabled>SERVIZIO NON DISPONIBILE</option>");
            $("#tipoInputRichiestiEdit").append("<option value selected disabled>SERVIZIO NON DISPONIBILE</option>");


        }
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })
}

function popolateInputOutput(result){
    $("#tipoInputRichiesti").html("");
    $("#tipoOutputProdotti").html("");
    $("#tipoInputRichiesti").append('<option value selected disabled>Seleziona un campo</option>');
    $("#tipoInputRichiestiEdit").append('<option value selected disabled>Seleziona un campo</option>');
    $("#tipoOutputProdottiEdit").append('<option value selected disabled>Seleziona un campo</option>');

    $("#tipoOutputProdotti").append('<option value selected disabled>Seleziona un campo</option>');

    $.each(result, function(i, field){
        var option ='<option value="'+ field.label + '">'+ field.label + '</option>';

        $("#tipoInputRichiesti").append(option);
        $("#tipoInputRichiestiEdit").append(option);

        $("#tipoOutputProdotti").append(option);
        $("#tipoOutputProdottiEdit").append(option);

    });
}

function loadComponentTabAccesso(){
    $("#wait").css("display", "block");

    //liv interazione
    $.ajax({
        dataType: "json",
        url: 'http://' + sgiinteractivitylevel.ip + '/' + sgiinteractivitylevel.serviceName +'/api/interactivitylevels?filter[where][language]=it',
        success:function(data) {
            $("#wait").css("display", "block");

            popolateLivInterazione(data);

        },
        error:function(data){
            $("#wait").css("display", "block");

            $("#containerRadioLivInteraizone").html("");
            $("#containerRadioLivInteraizone").append("SERVIZIO NON DISPONIBILE");

        },
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })
    //modalita auth
    $.ajax({
        dataType: "json",
        url: 'http://' + sgiauth.ip + '/' + sgiauth.serviceName +'/api/authentications?filter[where][language]=it',
        success: function(data) {
            $("#wait").css("display", "block");

            popolateModAuth(data);

        },
        error:function(data){
            $("#wait").css("display", "block");

            $("#modalitaautenticazione").append("<option value selected disabled>SERVIZIO NON DISPONIBILE</option>");
        }
    }).done( function() {
        $("#wait").css("display", "none");

    }).fail( function() {
        $("#wait").css("display", "none");

    })



    $.ajax({
        dataType: "json",
        url: 'http://' + sgichannel.ip + '/' + sgichannel.serviceName +'/api/channels?filter[where][language]=it&filter[order]=lv0id',
        success:function(data) {
            $("#wait").css("display", "block");
            console.log(data);
            popolateChannels(data);

        },
        error:function(data){
            $("#wait").css("display", "block");

            $("#tipoCanaleErog").html("");
            $("#tipoCanaleErog").append("SERVIZIO NON DISPONIBILE");

        },
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })



}

function popolateLivInterazione(result){
    $("#containerRadioLivInteraizone").html("");
    var html="";
    var row ='<div class="form-group row">';
    var divCol='<div class="col-md-9 ">';
    var closeDiv='</div>'
    $.each(result, function(i, field){
        var label ='<label class="col-md-3 control-label" for="modalitaautenticazione">'+ field.label +'</label>';
        //        var check = '<option>' + field.definition + '</option>';
        var check = '<label><input type="radio" id="radioOption" name="radioOption">'+ field.definition+' </label>';

        html+=row;
        html+=label;
        html+=divCol;
        html+=check;
        html+=closeDiv;
        html+=closeDiv;
        html+=closeDiv;



    });
    $("#containerRadioLivInteraizone").append(html);
}

function popolateModAuth(result){
    var figlio = [];
    $("#modalitaautenticazione").html('');
    $("#modalitaautenticazione").append('<fieldset class="ancestor"><legend class="ancestor stepform mb-4">Autenticazione</legend><p class="help-block">Indicare, se previste, le modalità di autenticazione necessarie per accedere al servizio</p><div id="appendField"></div></fieldset>');
    $.each(result, function(i, field){
        var descriptionPadre = field.description;
        var idPadre = field.lv0id;
        //        var padreTest ="<optgroup id='"+ idPadre + "' label='"+ descriptionPadre + "'>";
        var padreTest ='<fieldset id="'+ idPadre + '" class="child"><legend class="child">'+descriptionPadre+'</legend></fieldset';
        var close = '</optgroup>';

        if(field.lv0id=="NONE"){
            //            $("#fildsetPadre").append('<option value="3276" id="' + field.lv0id +'" class="sg-option-depth-0">' + field.description +'</option>');

            $("#appendField").prepend('<div class="fieldset-like"><div class="row"><div class="col-9">			<div class="app-checkbox"> <label><input type="checkbox"  name="noneCheck" class="checkBoxValidate" checked value="0">' + field.description +'</label></div></div></div<div class="row"><div id="'+ field.lv0id+'" class="col-9 offset-md-3">');

        }
        else
        {
            $("#appendField").append(padreTest);

            for (var a = 0 ; a < field.lv1child.length ; a++){
                //                $("#" + idPadre).append('<option id="' + field.lv1child[a].lv1id + '">' + field.lv1child[a].description + '</option>');
                if(field.lv1child[a].description == "Credenziale SPID Livello 1" || field.lv1child[a].description == "SPID Livello 2" || field.lv1child[a].description == "SPID Livello 3" ){
                    $("#" + idPadre).append('<div class="app-checkbox"><label><input type="checkbox" id="" name="" class="checkBoxValidate"  value="0"> ' + field.lv1child[a].description + ' <img src="img/componenti/spid.png" alt="" width="30px"></label></div>');
                }
                else
                    $("#" + idPadre).append('<div class="app-checkbox"><label><input type="checkbox" id="" name="" class="checkBoxValidate"  value="0"> ' + field.lv1child[a].description + '</label></div>');

            }

        }


    });
    appendFreeAccess();
}

function appendFreeAccess(){
    var fieldFreeAccess = $("#modalitaautenticazione option[id='NONE']")
    $("#modalitaautenticazione option[id='NONE']").remove();
    $("#modalitaautenticazione").append(fieldFreeAccess);
}

function popolateChannels(results){
    $("#tipoCanaleErog").append("<option disabled selected value>Seleziona una scelta</option>");
    $("#tipoCanaleErogEdit").append("<option disabled selected value>Seleziona una scelta</option>");
    $.each(results, function(i,field){

        $("#tipoCanaleErog").append('<option id="' + field.lv0id + '">'+ field.lv0description+ '</option>')
        $("#tipoCanaleErogEdit").append('<option value="' + field.lv0description +'" id="' + field.lv0id + '">'+ field.lv0description+ '</option>')



    })
}

function popolateOrganization(){
    var a = $("#bodyOrganizz").children().attr("id");
    a++;
    if($("#formOrganizz").valid() == true){
        $('#modalOrganizz').modal('hide');

        var name = $("#nomeOrganizz").val();
        var role = $("#ruoloOrganizzModal").val();
        var dateDa = $("#dalOrganizz").val();
        var dateA=  $("#alOrganizz").val();
        var appRows="";
        appRows +='<tr id="' + a + '"><td id="'+a+'_organizz">'
        appRows +=name
        appRows +='</td><td id="'+a+'_ruolo">'
        appRows +=role
        appRows +='</td><td id="'+a+'_dal">'
        appRows +=dateDa
        appRows +='</td><td id="'+a+'_al">'
        appRows +=dateA
        appRows +='</td><td><button type="button" onClick="editRowOrganiz('+ a +')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button><button class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>'

        $('#bodyOrganizz').prepend(appRows);
        blankFieldOrganizz();
        a++;
    }
}

function editRowOrganiz(numberRow){




    var nome = $("#"+numberRow+"_organizz").html().replace(/\s/g, "");
    var ruolo = $("#"+numberRow+"_ruolo").text();
    var dal =new Date($("#"+numberRow+"_dal").html().replace(/\s/g, "")).setHours(15);
    var al = new Date($("#"+numberRow+"_al").html().replace(/\s/g, "")).setHours(15);
    //alert(ruolo)
    $("#numberOfRowOrganization").val(numberRow);


    $("#nomeOrganizzEdit").val(nome)
    $("#ruoloOrganizzModalEdit").val(ruolo)
    //        $('#dalOrganizz').attr("value" , "05-05-2005")
    var dalControl = document.getElementById('dalOrganizzEdit').valueAsDate=new Date(dal)
    //        dalControl.value = "2017/01/01"
    //        $("#dalOrganizz").trigger("change")
    var dalControl = document.getElementById('alOrganizzEdit').valueAsDate=new Date(al)




    $('#modalOrganizzEdit').modal('show');

}

function popolateContatti(){
    var a = $("#bodyContatti").children().attr("id");
    a++;
    //    if($("#formOrganizz").valid() == true){

    //}
    $('#modalContatti').modal('hide');
    var nameOffice = $("#nomeUfficioContatti").val();
    var emailOffice = $("#emailContatti").val();
    var phoneOffice = $("#telefonoContatti").val();
    var urlOffice=  $("#sitoWebContatti").val();
    var appRows="";
    appRows +='<tr id="' + a + '"><td id="'+a+'_nomeContatto">'
    appRows +=nameOffice
    appRows +='</td><td id="'+a+'_emailContatto">'
    appRows +=emailOffice
    appRows +='</td><td id="'+a+'_telefonoContatto">'
    appRows +=phoneOffice
    appRows +='</td><td id="'+a+'_urlContatto">'
    appRows +=urlOffice
    appRows +='</td><td><button type="button" onClick="editRowContacts('+ a +')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button><button class="btn btn-default btn-icon"><span class="fa fa-times"></span></button></td></tr>'

    $('#bodyContatti').prepend(appRows);
    blankFieldContacts();
    a++;

}

function editRowContacts(numberRow){


    var nameOffice = $("#"+numberRow+"_nomeContatto").html().replace(/\s/g, "");
    var emailOffice = $("#"+numberRow+"_emailContatto").html().replace(/\s/g, "");
    var phoneOffice = $("#"+numberRow+"_telefonoContatto").html().replace(/\s/g, "");
    var urlOffice = $("#"+numberRow+"_urlContatto").html().replace(/\s/g, "");
    //alert(ruolo)
    $("#numberOfRowContacts").val(numberRow);

    $("#nomeUfficioContattiEdit").val(nameOffice)
    $("#emailContattiEdit").val(emailOffice)
    $("#telefonoContattiEdit").val(phoneOffice)
    $("#sitoWebContattiEdit").val(urlOffice)


    $('#modalContattiEdit').modal('show');

}

function loadComponentTabTema(){
    $.ajax({
        dataType: "json",
        url: 'http://sginace.xxxx/api/naces',
        success:function(data) {
            $("#wait").css("display", "block");

            popolateSettoreSelect(data);

        },
        error:function(data){
            $("#wait").css("display", "block");

            $("#settoreservizio").html("");
            $("#settoreservizio").append("<option disabled selected value>SERVIZIO NON DISPONIBILE</option>");

        },
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })

    $.ajax({
        dataType: "json",
        url: 'http://sgithemes.xxxx/api/themes?filter[where][language]=it',
        success:function(data) {
            $("#wait").css("display", "block");

            popolateCheckTema(data);

        },
        error:function(data){
            $("#wait").css("display", "block");

            $("#settoreservizio").html("");
            $("#settoreservizio").append("<option disabled selected value>SERVIZIO NON DISPONIBILE</option>");

        },
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })


}

function popolateSettoreSelect(data){
    //console.log(data)
    $("#settoreservizio").html("")
    //    $("#settoreservizio").append('<option disabled selected value>Seleziona un elemento</option> ')

    $.each(data, function(i,results){
        if(results.idParent==""||results.idParent==undefined){
            $("#settoreservizio").append('<option value="'+ results.description + '" id="' + results.identifier +'">'+ results.description +'</option>');

        }
    })
    $("#settoreservizio").chosen({"width":"100%"})
        .change(function(e){
        console.log(e);
        $("#settoreservizio option").removeAttr("selected");
        $("#settoreservizio_1").html("");
        $.each($("#settoreservizio").val(), function(i,value){

            var idLiv0 = $("#settoreservizio option[value='" + value + "']").attr("id");
            loadLiv1(idLiv0);
        })
    })

}

function loadLiv1(id){
    $.ajax({
        dataType: "json",
        url: 'http://sginace.xxxx/api/naces',
        success:function(data) {
            $("#wait").css("display", "block");
            popolateLv1(data ,[id]);

        },
        error:function(data){
            $("#wait").css("display", "block");

            $("#settoreservizio").html("");
            $("#settoreservizio").append("<option disabled selected value>SERVIZIO NON DISPONIBILE</option>");

        },
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })
}

function popolateLv1(data ,id){
    $("#settoreservizio_1").attr("multiple" , true)
    $.each(data, function(i,results){
        if(results.idParent == id){
            $("#settoreservizio_1").append('<option value="'+ results.description + '" id="' + results.identifier +'">'+ results.description +'</option>');

        }
    });
    $("#settoreservizio_1").chosen("destroy")
    $("#settoreservizio_1").chosen({"width":"100%"})
        .change(function(e){
        $("#settoreservizio_1 option").removeAttr("selected")
        $.each($("#settoreservizio_1").val(), function(i,value){

            var idLiv1 = $("#settoreservizio_1 option[value='" + value + "']").attr("id");
            loadLiv2(idLiv1);

        })
    })
}

function loadLiv2(id){
    $.ajax({
        dataType: "json",
        url: 'http://sginace.xxxx/api/naces',
        success:function(data) {
            $("#wait").css("display", "block");
            popolateLv2(data ,[id]);

        },
        error:function(data){
            $("#wait").css("display", "block");

            $("#settoreservizio").html("");
            $("#settoreservizio").append("<option disabled selected value>SERVIZIO NON DISPONIBILE</option>");

        },
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })
}

function popolateLv2(data ,id){
    $("#settoreservizio_2").attr("multiple" , true);
    $.each(data, function(i,results){
        if(results.idParent == id){
            $("#settoreservizio_2").append('<option value="'+ results.description + '" id="' + results.identifier +'">'+ results.description +'</option>');

        }
    });
    $("#settoreservizio_2").chosen("destroy")
    $("#settoreservizio_2").chosen({"width":"100%"})
        .change(function(e){
        $("#settoreservizio_2 option").removeAttr("selected")
        $.each($("#settoreservizio_2").val(), function(i,value){

            var idLiv0 = $("#settoreservizio_2 option[value='" + value + "']").attr("id");
            loadLiv3(idLiv0);

        })
    })
}

function loadLiv3(id){
    $.ajax({
        dataType: "json",
        url: 'http://sginace.xxxx/api/naces',
        success:function(data) {
            $("#wait").css("display", "block");
            popolateLv3(data ,[id]);

        },
        error:function(data){
            $("#wait").css("display", "block");

            $("#settoreservizio").html("");
            $("#settoreservizio").append("<option disabled selected value>SERVIZIO NON DISPONIBILE</option>");

        },
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })
}

function popolateLv3(data ,id){
    $("#settoreservizio_3").attr("multiple" , true);
    $.each(data, function(i,results){
        if(results.idParent == id){
            $("#settoreservizio_3").append('<option value="'+ results.description + '" id="' + results.identifier +'">'+ results.description +'</option>');

        }
    });
    $("#settoreservizio_3").chosen("destroy")
    $("#settoreservizio_3").chosen({"width":"100%"})
        .change(function(e){
        $("#settoreservizio_3 option").removeAttr("selected")
        $.each($("#settoreservizio_3").val(), function(i,value){

            var idLiv0 = $("#settoreservizio_3 option[value='" + value + "']").attr("id");
            //            loadLiv3(idLiv0);

        })
    })
}

function popolateInputFields(){
    var number = $("#popolateInputDiv").children().attr("id");
    number++;

    //    if (number == "" || number == undefined)
    //        number=0;
    var container = $("#popolateInputDiv");
    container.removeAttr("hidden");
    var html="";
    var rowFormGroup = '<div class="form-group row" id="'+number+'">';
    var labelNome = '<div class="col-md-3 control-label"><button type="button" onClick="editRowInput('+ number +')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button><button type="button" onClick="deleteRowInput('+ number +')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button><span id="nome_'+ number+'">'+ $('#nomeInputRichiesti').val()+'</span></div>';
    var col = '<div class="col-9">';
    var row='<div class="row">';
    var tipo = "<p class='col-md-5'><strong> Tipo input </strong><span id='tipo_" + number +"'>"+ $('#tipoInputRichiesti').val()+"</span></p>";
    var documentazione= "<p class='col-md-5'><strong>Documentazione </strong><span id='docum_"+ number +"'> "+ $('#docRifInputRichiesti').val()+"</span></p>";
    var closeDiv = "</div>" //per 3

    html+=rowFormGroup;
    html+=labelNome;
    html+=col;
    html+=row;
    html+=tipo;
    html+=documentazione;
    html+=closeDiv;
    html+=closeDiv;
    html+=closeDiv;


    container.prepend(html)
    $("#modalInputRichiesti").modal("hide")
}

function popolateOutputFields(){


    var number = $("#popolateOutputDiv").children().attr("id");
    number++;

    //    if (number == "" || number == undefined)
    //        number=0;
    var container = $("#popolateOutputDiv");
    container.removeAttr("hidden");
    var html="";
    var rowFormGroup = '<div class="form-group row" id="'+number+'">';
    var labelNome = '<div class="col-md-3 control-label"><button type="button" onClick="editRowOutput('+ number +')" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button><button type="button" onClick="deleteRowOutput('+ number +')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button><span id="outputNome_'+ number+'">'+ $('#nomeOutputProdotti').val()+'</span></div>';
    var col = '<div class="col-9">';
    var row='<div class="row">';
    var tipo = "<p class='col-md-6'><strong> Tipo Output </strong><span id='outputTipo_" + number +"'>"+ $('#tipoOutputProdotti').val()+"</span></p>";
    var closeDiv = "</div>" //per 3

    html+=rowFormGroup;
    html+=labelNome;
    html+=col;
    html+=row;
    html+=tipo;
    html+=closeDiv;
    html+=closeDiv;
    html+=closeDiv;


    container.prepend(html)
    $("#modalOutputProdotti").modal("hide")
}

function popolateCheckTema(results){

    var container1 = $("#appendCheck1");
    var container2 = $("#appendCheck2");

    var html=""
    $.each(results , function(i , data){
        var appCheckbox = '<div class="app-checkbox">';
        var inputCheck = '<label><input type="checkbox" id="temaCheck" name="temaCheck[]" class="checkBoxValidate" value="0" aria-required="true" identifier="' +data.identifier + '" aria-invalid="false"> ' + data.label + '</label>'
        var closeDiv="</div>"
        html+=appCheckbox;
        html+=inputCheck;
        html+=closeDiv;
        if(i>6)
            container2.append(html);
        else
            container1.append(html);

        html="";
    })









}

function editRowInput(numberRow){

    var nome = $("#nome_"+numberRow).html().replace(/\s/g, "");
    var ruolo = $("#tipo_"+numberRow).html();
    var doc = $("#docum_"+numberRow).html().replace(/\s/g, "");
    //alert(ruolo)
    $("#numberOfRowInputEdit").val(numberRow);


    $("#nomeInputRichiestiEdit").val(nome)
    //    $("#tipoInputRichiestiEdit option[value='" + ruolo+ "' ]").attr("selected" , "selected");
    $("#tipoInputRichiestiEdit").val(ruolo)

    $("#docRifInputRichiestiEdit").val(doc)

    $('#modalInputRichiestiEdit').modal('show');

}


function deleteRowInput(numberRow){
    
    var input = $("#nome_"+numberRow);
    input.parent().parent().remove();
}

function blanckInputFields(){
    $("#nomeInputRichiesti").val("");
    $("#tipoInputRichiesti").val("");
    $("#docRifInputRichiesti").val("");
}

function editRowOutput(numberRow){

    var nome = $("#outputNome_"+numberRow).html().replace(/\s/g, "");
    var ruolo = $("#outputTipo_"+numberRow).html();
    //alert(ruolo)
    $("#numberOfRowOutputEdit").val(numberRow);


    $("#nomeOutputProdottiEdit").val(nome)
    //    $("#tipoInputRichiestiEdit option[value='" + ruolo+ "' ]").attr("selected" , "selected");
    $("#tipoOutputProdottiEdit").val(ruolo)


    $('#modalOutputProdottiEdit').modal('show');

}

function deleteRowOutput(numberRow){
    
    var input = $("#outputNome_"+numberRow);
    input.parent().parent().remove();
}


function getChildren(idAppend , idFields ,containerBlankChildren){
    var getChildren = 'channelIdLang={"identifier":"' + idFields + '","language":"it"}';
    $("#" +idAppend).html("");
    $.ajax({
        type: "POST",
        data: getChildren,

        url: 'http://sgichannel.xxxx/api/channels/getChildListById',
        success:function(data) {
            $("#wait").css("display", "block");
            if(data.response == [] || data.response == "" || data.response == undefined || data.response.length == 0){
                $("." +containerBlankChildren).hide('slow');
            }else{
                $("." +containerBlankChildren).show('slow');

                $("#" +idAppend).append("<option disabled selected value>Seleziona una scelta</option>")
                //                    var count = 0;
                $.each(data.response , function(i,field){
                    $("#" +idAppend).append("<option id='"+ field.identifier +"'>" + field.description + "</option>")  
                    //                        count++;
                })
            }


            console.log(data)

        },
        error:function(data){
            $("#wait").css("display", "block");

            $("#" +idAppend).html("");
            $("#" +idAppend).append("SERVIZIO NON DISPONIBILE");

        },
    }).done( function(data) {
        //        $("#" +idAppend).append("<option disabled selected value>Seleziona una scelta</option>")
        //        //                    var count = 0;
        //        $.each(data.response , function(i,field){
        //            $("#" +idAppend).append("<option id='"+ field.identifier +"'>" + field.description + "</option>")  
        //            //                        count++;
        //        })
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })
}


function getChildrenEdit(idAppend , idFields ,containerBlankChildren){
    var getChildren = 'channelIdLang={"identifier":"' + idFields + '","language":"it"}';
    $("#" +idAppend).html("");
    $.ajax({
        type: "POST",
        data: getChildren,

        url: 'http://sgichannel.xxxx/api/channels/getChildListById',
        success:function(data) {
            $("#wait").css("display", "block");
            if(data.response == [] || data.response == "" || data.response == undefined || data.response.length == 0){
                $("." +containerBlankChildren).hide('slow');
            }else{
                $("." +containerBlankChildren).show('slow');

                $("#" +idAppend).append("<option disabled selected value>Seleziona una scelta</option>")
                //                    var count = 0;
                $.each(data.response , function(i,field){
                    $("#" +idAppend).append("<option value='"+ field.description+ "' id='"+ field.identifier +"'>" + field.description + "</option>")  
                    //                        count++;
                })
            }


            console.log(data)

        },
        error:function(data){
            $("#wait").css("display", "block");

            $("#" +idAppend).html("");
            $("#" +idAppend).append("SERVIZIO NON DISPONIBILE");

        },
    }).done( function(data) {
        popolateOtherFields();
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })
}

function popolateAutocompleteOrganizz(insertWord , response){
    $("#wait").css("display", "block");

    //liv interazione
    $.ajax({
        dataType: "json",
        url: 'http://sgiorganization.xxxx/api/organizations?filter={"where":{"or":[{"name":{"like":"' + insertWord + '.*","options":"i"}},{"organizationCode":{"like":"' + insertWord + '.*","options":"i"}}]},"limit":20}',
        success:function(data) {
            $("#wait").css("display", "block");
            var appName = [];

            $.each(data , function(i,field){
                appName.push(field.name);
            })

            response(appName);

        },
        error:function(data){
            $("#wait").css("display", "block");



        },
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })
}

function popolateAutocompleteOrganizzSelectPA(insertWord , response){
    $("#wait").css("display", "block");

    //liv interazione
    $.ajax({
        dataType: "json",
        url: 'http://sgiorganization.xxxx/api/organizations?filter={"where":{"or":[{"name":{"like":"' + insertWord + '.*","options":"i"}},{"organizationCode":{"like":"' + insertWord + '.*","options":"i"}}]},"limit":20}',
        success:function(data) {
            $("#wait").css("display", "block");
            var appName = [];

            $.each(data , function(i,field){
                appName.push(field.organizationCode + ' # ' + field.name);
            })

            response(appName);

        },
        error:function(data){
            $("#wait").css("display", "block");



        },
    }).done( function() {
        $("#wait").css("display", "none");
    }).fail( function() {
        $("#wait").css("display", "none");
    })
}

function popolateCanaliErogazione(numberFields){
    var number = $("#divPopolateCanaliErogazione").children().attr("id");
    number++;
    var container = $("#divPopolateCanaliErogazione");
    var html="";
    var numberInput = $("#containerAllInput :input:visible").length;
    var input = $("#containerAllInput :input:visible");
    var a = 0;

    var rowFormGroup = '<div class="form-group row" id="'+number+'">';
    var labelNome = '<div class="col-md-3 control-label"><button type="button" onClick="editRowCanErog('+ number +', ' + numberFields +' )" class="btn btn-default btn-icon"><span class="fa fa-pencil"></span></button><button type="button" onClick="deleteRowCanErog('+ number +')" class="btn btn-default btn-icon"><span class="fa fa-times"></span></button><span id="' +$(input[a]).attr("id") + '_'+number+'">'+ $(input[a]).val()+'</span></div>';
    var col = '<div class="col-9">';
    var row='<div class="row">';
    var closeDiv = "</div>" //per 3
    a++
    html+=rowFormGroup
    html+=labelNome
    //    html+=col

    for(a ; a< numberInput ;a++){

        html += "<p class='col-md-3'><strong> Tipo input </strong><span id='" + $(input[a]).attr('id') +"_" + number +"'>"+ $(input[a]).val()+"</span></p>";
    }
    //    html+=closeDiv
    html+=closeDiv
    html+=closeDiv
    container.prepend(html);

}
//
//function editRowCanErog(number){
//    $('#modalCanaliErogazioneEdit').modal('show');
//    var lengthInput = $('#divPopolateCanaliErogazione #'+ number +' span').length;
//    var parent = $('#divPopolateCanaliErogazione #'+ number +' span');
//    var a = 2;
//    $.map(parent , function(val, i ){
//        if(i>1){
//            var id=$("#"+val.id).attr("id");
//            var idInput = id.substring(0, id.indexOf("_"))+"Edit";
//
//            if($('#' +idInput).is("select")){
//                $('#' +idInput + ' option[value='+ $("#"+val.id).text().replace(/\s/g, "")+']').attr("selected", "selected");
//
//                //                $('#' +idInput).trigger("change");
//                if(i == 2){
//                    var selected = $("#tipoCanaleErogEdit").children(":selected").attr("id");
//                    showFieldsInputEdit(selected);
//                }
//            }
//            else
//                $('#' +idInput).val($("#"+val.id).text().replace(/\s/g, ""))
//
//            //            console.log($("#"+val.id).text().replace(/\s/g, ""));
//        }
//        else
//            return
//    })
//    //    for(a=2;a<lengthInput;a++){
//    //        
//    //    }
//}


function editRowCanErog(number, numberFields){

    $('#numberRow').val(number)

    var lengthInput = $('#divPopolateCanaliErogazione #'+ number +' span').length;
    var parent = $('#divPopolateCanaliErogazione #'+ number +' span');
    var a = 2;
    $('#tipoCanaleErogEdit option:selected').removeAttr("selected")
    var test = false;
    $.map(parent , function(val, i ){

        if(i == 2){
            var id=$("#"+val.id).attr("id");
            var idInput = id.substring(0, id.indexOf("_"))+"Edit";
            $('#' +idInput + ' option[value="'+ $("#"+val.id).text()+'"]').attr("selected", "selected").trigger("change");
            //            var selected = $("#tipoCanaleErogEdit").children(":selected").attr("id");
            //            showFieldsInputEdit(selected);

        }


    })
    $('#modalCanaliErogazioneEdit').modal('show');

}
function deleteRowCanErog(number){

    $('#numberRow').val(number)
//tipoCanaleErog_1
var parent = $('#divPopolateCanaliErogazione #'+ number).remove();
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
function popolateOtherFields(){
    var number = $('#numberRow').val()
    $('#numberOfRowErogCan').val(number);
    var lengthInput = $('#divPopolateCanaliErogazione #'+ number +' span').length;
    var parent = $('#divPopolateCanaliErogazione #'+ number +' span');
    var a = 2;
    //    $('#tipoCanaleErogEdit option:selected').removeAttr("selected")
    $.map(parent , function(val, i ){
        if(i>2){
            var id=$("#"+val.id).attr("id");
            var idInput = id.substring(0, id.indexOf("_"))+"Edit";
            if($('#' +idInput).is("select"))
                $('#' +idInput + ' option[value="'+ $("#"+val.id).text()+'"]').attr("selected", "selected");
            else
                $('#' +idInput).val($("#"+val.id).text().replace(/\s/g, ""))
        }
    })
}