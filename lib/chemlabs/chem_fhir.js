// Requires

var uuid = require('./uuid').uuid;
var common = require('./common');
var refer = common.refer;
var referDisp = common.referDisp;
var Resource = common.Resource;
var ContainedResource = common.ContainedResource;
var statusMap = common.statusMap;
var vistaDate = common.vistaDate;

// Resources internally "contained" within overall Diagnostic Report resource

var observation = function(item) {
    var res = new ContainedResource('Observation');
    res.name = {};
    res.name.text = item.typeName;
    res.name.coding = [{}];
    res.name.coding[0].system = "urn:oid:2.16.840.1.113883.6.233";
    res.name.coding[0].code = ("vuid" in item ? item.vuid : item.typeName);
    res.name.coding[0].display = item.typeName;
    if ("typeCode" in item) {
        if (item.typeCode.substring(0,8) == "urn:lnc:") {
            res.name.coding[1] = {};
            res.name.coding[1].system = "http://loinc.org";
            res.name.coding[1].code = item.typeCode;
        }
    }
    if (isNaN(item.result)) {
        res.valueString = item.result;
    } else {
        res.valueQuantity = {};
        res.valueQuantity.value = item.result.toString();
        res.valueQuantity.units = item.units;
        res.referenceRange = [{}];
        res.referenceRange[0].low = {};
        res.referenceRange[0].low.value = item.low.toString();
        res.referenceRange[0].low.units = item.units;
        res.referenceRange[0].high = {};
        res.referenceRange[0].high.value = item.high.toString();
        res.referenceRange[0].high.units = item.units;
    }
    res.status = statusMap(item.statusName);
    return res;
};

var organization = function(item) {
    var res = new ContainedResource("Organization");
    // More code refering to how to parse the organization name from comment goes here.
    return res;
};

var specimen = function(item) {
    var res = new ContainedResource("Specimen");
    res.type = {};
    res.type.text = item.specimen;
    res.subject = {"reference": "Patient/" + item.uid.split(":")[3]};
    res.collection = {};
    res.collection.collectedDateTime = vistaDate(item.observed);
    return res;
};

exports.toFhir = function(vpr) {
    var fhir = new Resource("DiagnosticReport");
    var item = vpr.data.items[0];
    var obs = observation(item);
    var org = organization(item);
    var spec = specimen(item);
    fhir.contained = [obs, org, spec];
    fhir.status = statusMap(item.statusName);
    fhir.issued = vistaDate(item.resulted);
    fhir.subject = {"reference": "Patient/" + item.uid.split(":")[3]};
    fhir.performer = [referDisp(org, item.comment)];
    fhir.identifier = {};
    fhir.identifier.system = "urn:oid:2.16.840.1.113883.6.233";
    fhir.identifier.value = item.uid;
    fhir.result = [refer(obs)];
    fhir.diagnosticDateTime = vistaDate(item.observed);
    fhir.specimen = [refer(spec)];
    return fhir;
};