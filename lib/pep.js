var logger = require('bunyan').createLogger({
	name: "pep"
});


// demonstrate that we could create a policy enforcement point (PEP)
// which would likely call out to a policy decision point (PDP)
// assume that this would have latency of 500ms
var enforceWithForcedDelay = function(req, res, next) {
	logger.info('checking PEP');
	setTimeout(function() {
		// logger.info('end PEP');
		next();
	}, 500);
};

exports.enforce = enforceWithForcedDelay;