function getQueryStringParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function ismsie() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        console.log(ua);
        return true;
    }
    return false;
}

function sortObjectByKey(obj, key) {
    return obj.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != "undefined" ? args[number] : match;
    });
};

function startWait(elem, msg) {
    // console.log("Code invoked waitme on element %s", elem)
    $("#" + elem).waitMe({
        effect: 'win8',
        text: msg,
        bg: 'rgba(255, 255, 255, 0.7)',
        color: '#000',
        maxSize: '',
        textPos: 'vertical',
        fontSize: '',
        source: ''
    })
}

function startWait(elem, msg, callBack) {
    // console.log("Code invoked waitMe on element %s", elem)
    $("#" + elem).waitMe({
        effect: 'win8',
        text: msg,
        bg: 'rgba(255, 255, 255, 0.7)',
        color: '#000',
        maxSize: '',
        textPos: 'vertical',
        fontSize: '',
        source: '',
        onClose: callBack
    })
}

function stopWait(elem) {
    $("#" + elem).waitMe("hide");
}
//stops all waitmes
function stopWait() {
    $(".waitMe").css("display", "none")
}
$(function () {
    // $.datepicker.setDefaults(
    //     $.extend({
    //             'dateFormat': 'dd/mm/yy'
    //         },
    //         $.datepicker.regional['it'])
    // );
})

function urlComposer(name, collection, query, environment) {
    var url = {};
    url.name = name;
    url.collection = collection;
    url.query = query;
    // switch (environment) {
    //     // case value:
    //     //     break;
    //     default: url = "https://" + name + ".xxxx/api/" + collection + query;
    //     break;
    // }
    return url;
}

function callService(verb, url, data) {
    var objResult = {};
    var objToPost = url;
    objToPost.verb = verb;
    if (verb == "post" || verb == "POST")
        objToPost.data = data;
    objToPost = JSON.stringify(objToPost)
    $.ajax({
        type: "POST",
        data: objToPost,
        async: false,
        processData: false,
        url: '/serverApi',
        contentType: 'application/json',
        success: function (data) {
            var appData = JSON.parse(data)
            if (appData.result && appData.result != null && appData.result != undefined && appData.result.success!=undefined && !appData.result.success)
                error(appData.result.message)
            else {
                objResult.success = true;
                objResult.data = JSON.parse(data);
            }
        },
        error: function (data) {
            objResult.success = false;
            objResult.data = data;
            var message = ""
            if ($.isPlainObject(data) && data.message) {
                message = data.message
            } else
                message = data

            error(message)
        }
    })
    return objResult;
}

// function callService(verb, url, data) {
//     var objResult = {};
//     switch (verb) {
//         case "POST":
//             $.ajax({
//                 type: verb,
//                 data: data,
//                 headers: {
//                     "Authorization": "Basic " + btoa("nomeutente:-")
//                 },
//                 async: false,
//                 processData: false,
//                 url: url,
//                 success: function (data) {
//                     objResult.success = true;
//                     objResult.data = data;
//                 },
//                 error: function (data) {
//                     objResult.success = false;
//                     objResult.data = data;
//                     var message = ""
//                     if (data.message) {
//                         message = data.message
//                     } else
//                         message = data

//                     error(message)

//                 }
//             })
//             break;
//         case "GET":
//             $.ajax({
//                 dataType: "json",
//                 url: url,
//                 headers: {
//                     "Authorization": "Basic " + btoa("nomeutente:-")
//                 },
//                 async: false,
//                 success: function (data) {
//                     objResult.success = true;
//                     objResult.data = data;
//                 },
//                 error: function (data) {
//                     objResult.success = false;
//                     var message = ""
//                     if (data.message) {
//                         message = data.message
//                     } else
//                         message = data

//                     error(message)
//                 }
//             })
//             break;
//         case "DELETE":
//             $.ajax({
//                 url: url,
//                 async: false,
//                 headers: {
//                     "Authorization": "Basic " + btoa("nomeutente:-")
//                 },
//                 type: "DELETE",
//                 success: function (data) {
//                     objResult.success = true;
//                     objResult.data = data;
//                 },
//                 error: function (data) {
//                     objResult.success = false;
//                     var message = ""
//                     if (data.message) {
//                         message = data.message
//                     } else
//                         message = data

//                     error(message)
//                 }
//             })
//             break;
//     }
//     return objResult;
// }
(function (proxy) {
    window.alert = function (s) {
        swal(s);
    };
})(window.alert);

function confirmDelete(message, description, serviceName) {
    swal({
        title: message,
        text: description,
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: ["Annulla", "Conferma"]
    })
        .then((willDelete) => {
            if (willDelete) {
                swal("Rimozione effettuata!", {
                    icon: "success",
                });
                return true;
            } else {
                swal("Operazione annullata");
                return false;
            }
        });
}


function checkAdminIsUser(cf) {
    var name = "sgiabaccontroller"
    var collection = "users"
    var query = '?filter={"where":{"codicefiscale":"' + cf + '"}}'
    var environment = ""
    var url = urlComposer(name, collection, query, environment);
    var obj = callService("GET", url)
    if (obj.success) {
        return obj.data.isSuperAdmin
    } else {
        return "Error"
    }
}

function success(successMsg) {
    swal(successMsg, {
        icon: "success",
        buttons: false
    })
    return;
}

function error(errorMsg) {
    swal(errorMsg, {
        icon: "error",
        buttons: false
    })
    return false;
}

if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];

            for (var i = 0; i !== length; i++) {
                if (predicate.call(thisArg, this[i], i, list)) {
                    return this[i];
                }
            }
            return undefined;
        }
    });
}

function getService(serviceId) {
    var name = "sgiservice";
    var collection = "public-services/" + serviceId;
    var query = '';
    var environment = "";
    var url = urlComposer(name, collection, query, environment);
    var obj = callService("GET", url);
    if (obj.success) {
        return obj;
    } else {
        return "Error";
    }
}
//CODICE COMMENTATO IN ATTESA DI INTEGRAZIONE CON KONG
// function urlComposer(name, collection, query, environment) {
//     var url;
//     switch (environment) {
//         // case value:
//         //     break;
//         default: url = "/" + name + "/api/" + collection //+ query;
//             break;
//     }
//     return url;
// }
// function callService(verb, url, data) {
//     var objResult = {};
//     var objToService = {};
//     objToService.verb = verb;
//     objToService.url = url;
//     objToService.data = data;
//     $.ajax({
//         type: "POST",
//         data: objToService,
//         async: false,
//         processData: false,
//         url: url,
//         success: function (data) {
//             objResult.success = true;
//             objResult.data = data;
//         },
//         error: function (data) {
//             objResult.success = false;
//         }
//     })
//     return objResult;
// }