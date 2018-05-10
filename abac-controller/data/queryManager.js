
function checkUserCanCreate(usr) {
    if (usr.isSuperAdmin || (usr.attributes.findIndex((item) => item.name === "admin") > -1) || (usr.attributes.findIndex((item) => item.name === "superAdmin") > -1))
        return true
    else
        return false
}

module.exports.checkUserCanCreate = checkUserCanCreate;

function checkHierarchy(writerAttr, userAttr, isSuperAdmin) {
    if (userAttr.findIndex((item) => item.name === "superAdmin") > -1) return false
    else if ((writerAttr.findIndex((item) => item.name === "admin") > -1) && (isSuperAdmin || (userAttr.length > 0 && userAttr.findIndex((item) => item.name === "admin") > -1))) return false
    else return true
}

module.exports.checkHierarchy = checkHierarchy;



function checkExistAdmin(User, codiceIpaArr) {
    var exist = false;

    for (var i = 0; i < userData.organizzazioni.length; i++) {

        var whereFilter = {}
        var utente = User.find(whereFilter, function (err, result) {
            try {
                if (err) console.log(err)
                else {
                    if (result.length > 0) {
                        exist = true;
                    }
                    return exist

                }
            } catch (error) {

            }
        });
    }
}
