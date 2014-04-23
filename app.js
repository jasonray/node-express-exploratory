var express = require('express');
var app = express();

app.use(function(req, res, next) {
	console.log('sample filter');
});

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);