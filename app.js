var express = require('express');
var app = express();
var httpPort = 8888;
var adminHttpPort = 8889;

var logger = require('bunyan').createLogger({
	name: "server"
});

// log the request to stdout
var morgan = require('morgan')('dev');
app.use(morgan);

// apply the PEP for all calls under /api
var pep = require('./lib/pep');
app.use('/api', pep.enforce);

// collect usage metrics for everything under /api and /public
var metrics = require('statman');
app.use('/api', metrics.httpFilters.metricCollectionFilter);
app.use('/public', metrics.httpFilters.metricCollectionFilter);

// this would represent an expensive resource with 2000ms latency
app.get('/api/fetch/expensive', function(req, res, next) {
	// logger.info('begin resource processing, fetch data which will take 1s');
	setTimeout(function() {
		// logger.info('end fetch data');
		res.end('retrieved data \n');
	}, 2000);
});

// this would represent an expensive resource with 500ms latency
app.get('/api/fetch/light', function(req, res, next) {
	// logger.info('begin resource processing, fetch data which will take 1s');
	setTimeout(function() {
		// logger.info('end fetch data');
		res.end('retrieved data \n');
	}, 500);
});

require('./lib/widget/widget-resource').bind(app);


var labFhirResource = require('./lib/chemlabs/fhir-resource');
app.get('/api/patient/:patientId/labs', labFhirResource.fetchLabs);

var labFhirResourceAlt = require('./lib/chemlabs/fhir-resource-alt');
labFhirResourceAlt.bind(app);

// this would represent a very light resource with no latency
app.get('/public/hello', function(req, res, next) {
	res.end('hello world\n');
});

app.listen(httpPort, function() {
	logger.info("application now listening on %s", httpPort);
});

var adminapp = express();
adminapp.get('/admin/stats', metrics.httpFilters.metricOutputResource);
adminapp.listen(adminHttpPort, function() {
	logger.info("admin services now listening on %s", adminHttpPort);
});