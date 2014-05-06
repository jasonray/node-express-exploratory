module.exports = {
	bind: function(app) {
		app.get('/api/widgets-streaming', fetchWidgets);
	}
};

var logger = require('bunyan').createLogger({
	name: "widget-resource"
});

function fetchWidgets(req, res, next) {
	logger.info('invoked fetch widgets using streaming');

	var widgetDao = require('../widget/widgetDao');
	var results = widgetDao.retrieveList(10);
	logger.info('retrieved results ' + results.length);

	res.setHeader('Content-Type', 'application/json');

	res.write('[');

	for (var i = 0; i < results.length; i++) {
		logger.info('queue up processing widget #' + i);
		var widget = results[i];
		var isFirst = (i === 0);
		var delay = (i * 500);


		processWidget(res, widget, isFirst, delay);
	}

	setTimeout(function() {
		logger.info('complete');
		res.end(']');
	}, (results.length * 550));
}

function processWidget(res, widget, isFirst, delay) {
	setTimeout(function() {
		logger.info('processing widget ' + widget.name);

		if (!isFirst) res.write(",");

		res.write(JSON.stringify(widget));
	}, delay);
}