var express = require('express'),
	router = express.Router();

router.get('/', function(req, res) {
	res.render('index', { title: 'Basic Node/Express App' });
});

module.exports = router;
