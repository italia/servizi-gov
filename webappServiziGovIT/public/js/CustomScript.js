
$(document).ready(function(){
    $.validator.setDefaults({
        debug: true
    });
    $("#infoAForm").validate({
        rules:{
            nomedelservizio: "required",
            descrizioneServizio:"required",
            urlservizio:"required"
        },
        messages:{
            nomedelservizio: "Campo obbligatorio",
            descrizioneServizio:"Campo obbligatorio",
            urlservizio:"Campo obbligatorio"
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

            'temaCheck[]': "required",
            settoreservizio: "required"
        },
        messages:{
            settoreservizio:"Campo obbligatorio"

        },
        errorPlacement: function(error, element) {

            return false;

        },
        errorClass: "errorText",
        highlight: function (element) {
            if(element.id != "settoreservizio"){
                $('.errorCheck').addClass('show');
                $('#divError').addClass('errorInput');
            }
            else{
                $('.errorSettore').addClass('show')
                $(element).addClass('errorInput')
            }
        },
        unhighlight: function (element) {
            if(element.id != "settoreservizio"){
                $('.errorCheck').removeClass('show');
                $('#divError').removeClass('errorInput');
            }
            else{
                $('.errorSettore').removeClass('show')
                $(element).removeClass('errorInput')
            }
        }

    });

    $("#accessoAForm").validate({
        rules:{
            modalitaautenticazione: "required",

            radioOption:{ required:true }


        },
        messages:{
            modalitaautenticazione: "Campo obbligatorio",


        },
        errorPlacement: function(error, element) {

            return false;

        },
        errorClass: "errorText",
        highlight: function (element) {
            if(element.id != "modalitaautenticazione"){
                $('.errorLivInterazione').addClass('show');

                $('.divErrorRadio').addClass('errorInput');
            }
            else{
                $('.errorModalitaAutenticazione').addClass('show');

                $(element).addClass('errorInput');
            }
        },
        unhighlight: function (element) {
            if(element.id != "modalitaautenticazione"){
                $('.errorLivInterazione').removeClass('show');

                $('.divErrorRadio').removeClass('errorInput');
            }
            else{
                $('.errorModalitaAutenticazione').removeClass('show');

                $(element).removeClass('errorInput');
            }


            $('.errorCheck').removeClass('show');
            $('#divError').removeClass('errorInput');
        }
    });
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
    
    // $('#btnAggiungiContatti').click(function(){
    //     if($("#formContatti").valid() == true){
    //         $('#modalContatti').modal('hide');
    //         blankFieldContatti();
    //     }
    // })


    
    
    
    






    $('a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
        if(e.target.tabIndex < e.relatedTarget.tabIndex){
            if(e.target.id != "fineA"){
                var formName = e.target.id;
                var form = 'Form';
                return $("#" + formName + form).valid();
            }
        }
    })

})
function blankFieldContatti(){
    $('#nomeUfficioContatti').val("");
    $('#emailContatti').val("");
    $('#telefonoContatti').val("");
    $('#sitoWebContatti').val("");
}