var join = require('path').join;
var root = __dirname;
var fs = require('fs');

exports.fetchLabsFromSource = function(patientId, callback) {
	var path = join(root, './chemistry.json');
	console.log('begin reading file to get raw data for patient ' + patientId);
	fs.readFile(path, 'utf8', function(err, data) {
		if (err) {
			console.log('failed to read data from file for patient ' + patientId);
			callback(err);
		} else {
			console.log('complete reading data from file for patient ' + patientId);
			callback(null, data.toString());
		}
	});
};