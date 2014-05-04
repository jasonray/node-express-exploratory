var transformer = require('./transformer.js');
var dao = require('./labdao');

var logger = require('bunyan').createLogger({
	name: "labresource"
});

function fetchLabs(req, res, next) {
	logger.info('invoked fetch labs');

	var patientId = req.params.patientId;
	logger.info('requested labs for patient ' + patientId);

	dao.fetchLabsFromSource(patientId, function(err, vprData) {
		if (err) {
			res.writeHead(500);
			res.end();
			console.log(err);
		} else {
			logger.info('begin transform of lab data from vpr to fhir for patient ' + patientId);
			var fhirData = transformer.transformFromVprToFhir(vprData);
			logger.info('complete transform of lab data from vpr to fhir for patient ' + patientId + ', now sending response');

			res.setHeader('Content-Type', 'application/json+fhir');
			res.end(fhirData);
		}
	});
}

exports.fetchLabs = fetchLabs;