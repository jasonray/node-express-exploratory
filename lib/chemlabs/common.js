var uuid = require('./uuid').uuid;

exports.Resource = function(type) {
    this.resourceType = type;
};

exports.ContainedResource = function(type) {
    this.resourceType = type;
    this.id = uuid();
};

exports.refer = function(res) {
    return {"reference": "#" + res.id};
};

exports.referDisp = function(res, str) {
    var obj = exports.refer(res);
    obj.display = str;
    return obj;
};

exports.statusMap = function(status) {
    switch(status) {
        case "completed":
            return "final";
        default:
            return "UNKNOWN";
    };
};

exports.vistaDate = function(vDate) {
    var str = vDate.toString();
    return new Date(str.substring(0,4), 
                    str.substring(4,6), 
                    str.substring(6,8),
                    str.substring(8,10),
                    str.substring(10,12),0,0);
};

