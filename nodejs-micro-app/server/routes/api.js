var express = require('express'),
	router = express.Router(),
	data = {},
	timeout = 3000;

//req.params.modelName, model = req.body, date = req.params.date

router.get('/', function(req, res) {
	data = {
		message: 'Here is your data!'
	}
	res.json({'Result': 'OK', 'Data': data.message});
});

router.get('/delay/ok', function(req, res) {
	data = {
		message: 'Here is your data! Yay!'
	}
	setTimeout(function(){
		res.json({'Result': 'OK', 'Data': data});
	}, timeout);
});

router.get('/delay/err', function(req, res) {
	setTimeout(function(){
		res.send(500, { error: "Yikes! I've got a bad feeling about this." });
	}, timeout);
});

module.exports = router;