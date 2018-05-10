

var unwrapChannel = function unwrapChannel(channel, idChannel) {

    var retVal = []
    var level = (idChannel).split(".").length

    switch (level) {
        case 1:
            if (channel.lv1child) { retVal = unwrapLv1Child(channel.lv1child) }
            break;
        case 2:
            var child = getLv1ChildById(channel, idChannel)
            if (child.lv2child) { retVal = unwrapLv2Child(child.lv2child) }
            break;
        case 3:
            break;
        default:
    }
    return retVal;
}

module.exports.unwrapChannel = unwrapChannel;

function unwrapLv1Child(lv1Child) {
    childArray = []

    for (var i = 0; i < lv1Child.length; i++) {
        var res = {
            "identifier": lv1Child[i].lv1id,
            "description": lv1Child[i].lv1description,
            "hasChild": lv1Child[i].lv2child ? true : false
        }
        childArray.push(res)
    }
    return childArray
}

function unwrapLv2Child(lv2Child) {
    childArray = []

    for (var i = 0; i < lv2Child.length; i++) {
        var res = {
            "identifier": lv2Child[i].lv2id,
            "description": lv2Child[i].lv2description,
            "hasChild": false
        }
        childArray.push(res)
    }
    return childArray
}

function getLv1ChildById(channel, idChannel) {
    var lv1child = channel.lv1child
    for (var j = 0; j < lv1child.length; j++) {
        if (lv1child[j].lv1id == idChannel) {
            return lv1child[j]
        }
    }
}