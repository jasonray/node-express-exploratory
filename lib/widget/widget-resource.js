module.exports = {
	bind: function(app) {
		app.get('/api/widgets', fetchWidgets);
	}
};

var logger = require('bunyan').createLogger({
	name: "widget-resource"
});

var widgetDao = require('./widgetDao');

function fetchWidgets(req, res, next) {
	logger.info('invoked fetch widgets');

	var maxNumberOfRecords = req.query.max;
	logger.info('max number of records: ' + maxNumberOfRecords);

	var results = widgetDao.retrieveList(maxNumberOfRecords);

	res.setHeader('Content-Type', 'application/json');
	res.send(results);
}
