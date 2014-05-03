var transform = require('./transform.js').transform;
var join = require('path').join;
var root = __dirname;
var fs = require('fs');

function fetchLabs(req, res, next) {
	console.log('invoked fetch labs');

	var path = join(root, './chemistry.json');
	fs.readFile(path, 'utf8', function(err, vprData) {
		if (err) {
			res.writeHead(500);
			res.end();
			console.log(err);
		} else {
			console.log('complete reading file');
			var fhirData = vprData.toString();

			res.setHeader('Content-Type', 'application/json+fhir');
			res.end(transform(fhirData));
		}
	});
}

exports.fetchLabs = fetchLabs;