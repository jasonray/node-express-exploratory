var logger = require('bunyan').createLogger({
	name: "widget-dao"
});

var _data;

function initializeWidgetDao() {
	logger.info('initializing the widget data');
	//initialize the data
	var uuid = require('../uuid').uuid;

	data = [];

	//here is one way to initialize the array
	data.push(createWidget('alpha', 'red', 'medium'));
	data.push(createWidget('bravo', 'blue', 'small'));
	data.push(createWidget('charlie', 'green', 'large'));

	//but this is the same using javascript object directly
	data.push({
		id: uuid(),
		name: 'delta',
		color: 'brown',
		size: 'large'
	});
	data.push({
		id: uuid(),
		name: 'echo',
		color: 'black',
		size: 'small'
	});
	data.push({
		id: uuid(),
		name: 'foxttrot',
		color: 'red',
		size: 'medium'
	});

	logger.info('initialized data with size of ' + data.length);

	return data;

	function createWidget(name, color, size) {
		var widget = {};
		widget.id = uuid();
		widget.name = name;
		widget.color = color;
		widget.size = size;
		return widget;
	}
}

var retrieveList = exports.retrieveList = function(max) {
	if (!_data) _data = initializeWidgetDao();

	var result = _data.slice(0, max);
	return result;
};