module.exports = {
	bind: function(app) {
		app.get('/api/widgets', fetchWidgets);
		app.get('/api/widgets/id/:id', fetchWidget);
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

function fetchWidget(req, res, next) {
	var widgetId = req.params.id;
	logger.info('retrive widget by id: ' + widgetId);

	var result = widgetDao.retrieveById(widgetId);

	if (!result) {
		res.send(404);
	} else {
		res.setHeader('Content-Type', 'application/json');
		res.send(result);
	}
}