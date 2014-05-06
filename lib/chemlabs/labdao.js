var join = require('path').join;
var root = __dirname;
var fs = require('fs');

var logger = require('bunyan').createLogger({
	name: "labdao"
});

exports.fetchLabsFromSource = function(patientId, callback) {
	var path = join(root, '../../data/chemistry.json');
	logger.info('begin reading file [' + path + '] to get raw data for patient ' + patientId);
	fs.readFile(path, 'utf8', function(err, data) {
		logger.info('this will process second');

		if (err) {
			logger.info('failed to read data from file for patient ' + patientId);
			return callback(err);
		} else {
			logger.info('complete reading data from file for patient ' + patientId);
			return callback(null, data.toString());
		}
	});

	logger.info('this will process first');
};