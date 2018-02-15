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
$(function(){
    $.datepicker.setDefaults(
        $.extend({
            'dateFormat': 'dd/mm/yy'
        })
    );
})