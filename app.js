var express = require('express');
var app = express();
var httpPort = 8888;

var logger = require('bunyan').createLogger({
	name: "server"
});

var morgan = require('morgan');
var morganLogger = morgan('dev');

// log the request to stdout
app.use(morganLogger);

// keep track of stats
var activeCallFilterModule = require('./lib/request-filters/active-call-counter');
app.use('/api', activeCallFilterModule.activeCallFilter());
app.use('/public', activeCallFilterModule.activeCallFilter());

// demonstrate that we could create a policy enforcement point (PEP)
// which would likely call out to a policy decision point (PDP)
// assume that this would have latency of 500ms
app.use('/api', function(req, res, next) {
	logger.info('checking PEP');
	setTimeout(function() {
		// logger.info('end PEP');
		next();
	}, 500);
});

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

// this would represent a very light resource with no latency
app.get('/public/hello', function(req, res, next) {
	res.end('hello world\n');
});

app.get('/admin/stats', activeCallFilterModule.activeCallResource());

app.listen(httpPort, function() {
	logger.info("now listening on %s", httpPort);
});
