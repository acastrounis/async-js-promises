var ajaxOptions = {
	url: 'api/delay/ok',
	// url: 'api/delay/err',
	type: 'GET'
};

console.log('Calling AJAX get request.');

ajaxPromise = Q($.ajax(ajaxOptions));

console.log('AJAX get request sent.');

console.log('Registering first AJAX promise handler.');

ajaxPromise.then(function(data){
	console.log('First promise success handler called.');
}, function(error){
	console.log('First promise error handler called.');
})

console.log('Registering second AJAX promise handlers.');

ajaxPromise.then(function(data){
	console.log('Second promise success handler called.');
	setTimeout(function(){
		console.log('Registering third AJAX promise handler.');
		ajaxPromise.then(function(data){
			console.log('Third promise success handler called, after timeout.');
		})
	}, 1000)
}, function(error){
	console.log('Second promise error handler called.');
})

ajaxPromise.then(function(data){
	var msg = 'Fourth promise success handler called';
	console.log(msg);
	return msg;
}).then(function(data){
	console.log(data + ', again.')
})

setTimeout(function(){
	console.log("Whoa, I've been timed out!");
}, 2000)

console.log('Done!');