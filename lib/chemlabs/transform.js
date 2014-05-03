var parse = function(json) {
    return JSON.parse(json);
};

var emit = function(object) {
    return JSON.stringify(object, null, 2);
};

var toFhir = require('./chem_fhir').toFhir;

exports.transform = function(vpr) {
    return 'Transformed result:\n' + emit(toFhir(parse(vpr)));
};
