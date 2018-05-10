function loadComponentTabAccesso(){
    $.getJSON('http://52.142.209.88/sgiinteractivitylevel/api/interactivitylevels',function(result){
        $("#divContainerLivInterazione").html("");

        $.each(result, function(i, field){
            var check = '<div class="app-radio primary"><label><input type="radio" value="0" name="radioOption">' + field.definition + '<span></span><span></span></label></div>';

            $("#divContainerLivInterazione").append(check);

        });

    })

    $.getJSON('http://52.142.209.88/sgiauth/api/authentications',function(result){
        var figlio = [];
        $.each(result, function(i, field){
            $("#modalitaautenticazione").html("");

            var padre ='<optgroup label="'+ field.description + '">';
            var padreClose = '</optgroup>';
            $("#modalitaautenticazione").append(padre);
            for (var a = 0 ; a < field.lv1child.length ; a++){
                figlio.push('<option>' + field.lv1child[a].description + '</option>')
                $("#modalitaautenticazione").append(figlio[a]);
            }
            figlio = []
            $("#modalitaautenticazione").append(padreClose);
        });
        $("#modalitaautenticazione").append('<option value="3276" class="sg-option-depth-0">Nessuna - accesso libero</option>');
    })
}
function loadComponentTabInfo(){
    $.getJSON('http://52.142.209.88/sgiserviceinputoutput/api/serviceinputoutputs',function(result){
        $("#tipoInputRichiesti").html("");
        $("#tipoOutputRichiesti").html("");
        $.each(result, function(i, field){
            var option ='<option>'+ field.definition + '</option>';
            $("#tipoInputRichiesti").append(option);
            $("#tipoOutputRichiesti").append(option);

        });

    })
}
function loadComponentTabOrganizzazione(){
    $.getJSON('http://52.142.209.88/sgiroletype/api/roles',function(result){
        $("#ruoloOrganizzazioni").html("");
        $.each(result, function(i, field){

            var option ='<option>'+ field.definition + '</option>';
            $("#ruoloOrganizzazioni").append(option);

        });

    })
}
$(document).ready(function(){
    
    
    
    

    $('a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
        if(e.relatedTarget.id == "accessoA"){
            loadComponentTabAccesso();
        }

        if(e.relatedTarget.id == "infoA"){
            loadComponentTabInfo();
        }
        
        if(e.relatedTarget.id == "ruoloA"){
            loadComponentTabOrganizzazione();
        }

    })




})