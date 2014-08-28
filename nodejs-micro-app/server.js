#!/usr/bin/env node
var errorhandler = require('errorhandler'),
app = require('./app');

app.set('port', process.env.PORT || 3000);

app.use(errorhandler({server: server}));

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
