var express = require('express');
var app = express();

app.use('/', function(req, res, next) {
	console.log('this would represent some cross cutting concern');
	next();
});


app.get("/apple", function(req, res, next) {
	console.log('received request, sending response');
	res.send('banana');
});

app.get("/cookie", function(req, res, next) {
	console.log('received request, sending response');
	res.send('danish');
});


app.listen(8888, function() {
	console.log("application now listening on %s", 8888);
});