$(document).ready(function () {
    var orgs = {{user.organizzazioni}}
    if (orgs) {
    orgs.forEach(element => {
        $("#paAutorizzate").append('<option value="' + element.codiceIpa + '">' + element.description + '</option>"')
    })
}
})
