var transform = require('./transform.js').transform;
var dao = require('./labdao');

function fetchLabs(req, res, next) {
	console.log('invoked fetch labs');

	var patientId = req.params.patientId;
	console.log('requested labs for patient ' + patientId);

	dao.fetchLabsFromSource(patientId, function(err, vprData) {
		if (err) {
			res.writeHead(500);
			res.end();
			console.log(err);
		} else {
			console.log('begin transform of lab data from vpr to fhir for patient ' + patientId);
			var fhirData = transform(vprData);
			console.log('complete transform of lab data from vpr to fhir for patient ' + patientId + ', now sending response');

			res.setHeader('Content-Type', 'application/json+fhir');
			res.end(fhirData);
		}
	});
}

exports.fetchLabs = fetchLabs;