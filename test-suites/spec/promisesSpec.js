jasmine.getEnv().defaultTimeoutInterval = 10000; //ms

describe("A suite to explore JavaScript promises using Q", function () {
	//Function declarations
	function sleep(ms) {
		//Simulates long running process (event loop blocking)
		return function (callback) {
			setTimeout(callback, ms);
		};
	};

	function square(num) {
		//Simple math square function using promise deferreds
		var deferred = Q.defer();
		if (typeof num === "string") {
			deferred.reject(num);
		} else {
			//Call long running process (e.g. function with asynchronous callback)
			sleep(100).call(this, function () {
				deferred.resolve(num * num);
			});
		}
		return deferred.promise;
	};

	function getSquareFunction() {
		var deferred = Q.defer();
		deferred.resolve(function (num) {
			return num * num;
		});
		return deferred.promise;
	};

	//PROMISE CREATION & BASIC USAGE
	describe("A suite for promise creation and basic usage", function () {

		//Core promise methods: then, catch, progress, finally, done

		it("demonstrates simple promise creation", function (done) {
			var promise = Q();
			promise.then(function (result) {
				expect(promise.isFulfilled()).toBeTruthy();
				expect(result).toBeUndefined();
				done();
			});
		});

		it("demonstrates multiple handler registration and then() promise return", function () {
			var promise = Q(9999);

			expect(Q.isPromise(promise)).toBeTruthy();
			expect(promise.isFulfilled()).toBeTruthy();

			promise.then(function (result) {
				expect(result).toEqual(9999);
			});
		});

		it("demonstrates multiple handler registration and then() promise return", function () {
			var promise = Q(9999);

			expect(Q.isPromise(promise)).toBeTruthy();
			expect(promise.isFulfilled()).toBeTruthy();

			var newPromise = promise.then(function (result) {
				expect(result).toEqual(9999);
				// Note: Haven't returned anything (i.e., value, exception, or promise)
			});

			// Call then a second time
			promise.then(function(result) {
				expect(result).toBeDefined();
			});

			expect(Q.isPromise(newPromise)).toBeTruthy();
			expect(newPromise.isPending()).toBeTruthy();

			newPromise.then(function(result){
				expect(result).toBeUndefined();
			});
		});

		it("demonstrates promise creation and rejection", function (done) {
			// Note: Not the same as throwing exception
			Q(new Error("This is my custom error, yay!")).then(function (result) {
				expect(result.name).toEqual("Error");
				expect(result.message).toEqual("This is my custom error, yay!");
				done();
			});
		});

		it("demonstrates promise creation and rejection using Q.reject", function (done) {
			Q.reject("This is my custom error, yay!").then(null, function (error) {
				expect("This is my custom error, yay!").toEqual("This is my custom error, yay!");
				done();
			});
		});

		it("demonstrates promise creation and error handling", function (done) {
			//Demonstrates error handling improvement over callbacks
			Q().then(function (result) {
				throw new Error("This is my custom error, yay!");
			})
			.catch(function (error) {
				expect(error.name).toEqual("Error");
				expect(error.message).toEqual("This is my custom error, yay!");
				done();
			});
		});

		it("demonstrates using 'when' with promise", function (done) {
			//Equivalent to square(10).then(onFulfilled)
			Q.when(square(10), function (total) {
				expect(total).toEqual(100);
				done();
			});
		});

		it("demonstrates using 'when' with non-promise (value in this case)", function (done) {
			//Equivalent to Q(100).then(onFulfilled)
			Q.when(100, function (total) {
				expect(total).toEqual(100);
				done();
			});
		});

	});

	//ADVANCED PROMISE USAGE
	describe("A suite for advanced promise usage", function() {

		it("demonstrates function call returning a promise and success (onFulfilled)", function(done) {
			square(10).then(function(total) {
				expect(total).toEqual(100);
				done();
			});
		});

		it("demonstrates rejection using deferreds", function(done) {
			//Call to square will cause deferred rejection since passing a string
			//Error handling via catch method on promise object
			square("This will fail").then(function(result) {
				console.log("We won't reach this code!");
			})
			.catch(function(error) {
				expect(error).toEqual("This will fail");
				done();
			});
		});

		it("demonstrates rejection using onFulfilled and onRejected", function(done) {
			//Call to square will cause deferred rejection since passing a string
			//Error handling via onRejected
			square("This will fail").then(function(result) {
				console.log("We won't reach this code!");
			}, function(error) {
				expect(error).toEqual("This will fail");
				done();
			});
		});

		it("demonstrates promise chaining", function(done) {
			square(10).then(square)
			.then(square)
			.then(function(total) {
				expect(total).toEqual(100000000);
				done();
			});
		});

		it("demonstrates transformation and chaining", function (done) {
			square(10).then(function(result) {
					//Transform result data and continue chaining
					var transformedData = result / 2;
					return Q(transformedData);
				})
			.then(square)
			.then(function (total) {
				expect(total).toEqual(2500);
				done();
			});
		});

		it("demonstrates promise-for-function methods", function(done) {
			getSquareFunction().fcall(10).then(function(result) {
				expect(result).toEqual(100);
				done();
			});
		});

		it("demonstrates promise-for-function methods", function(done) {
			getSquareFunction().fapply([10]).then(function(result) {
				expect(result).toEqual(100);
				done();
			});
		});

		it("demonstrates concurrent function calls with fulfillment", function(done) {
			//Processing of results will not proceed until all concurrent operations are fulfilled or rejected
			//Results will be either array of fulfilled values, or rejection reason for first promise to be rejected
			Q.all([
				square(10),
				square(20)
				]).then(function (results) {
					expect(results[0]).toEqual(100);
					expect(results[1]).toEqual(400);

					done();
				});
			});

		it("demonstrates concurrent function calls with rejection", function (done) {
			//Same as above but with rejections
			Q.all([
				square("This will fail first"),
				square("This will fail second")
				]).then(null, function (error) {
					expect(error).toEqual("This will fail first");
				//expect(error).toEqual("This will fail second"); //This will fail

				done();
			});
			});

		it("demonstrates concurrent function calls, chaining, and rejection", function (done) {
			//Processing of results will not proceed until all concurrent operations are fulfilled or rejected
			Q.allSettled([
				square(10),
				square(20),
				square(30),
				square("This will fail")
				]).then(function (results) {
					expect(results[0].value).toEqual(100);
					expect(results[0].state).toEqual("fulfilled");

					expect(results[1].value).toEqual(400);
					expect(results[1].state).toEqual("fulfilled");

					expect(results[2].value).toEqual(900);
					expect(results[2].state).toEqual("fulfilled");

					expect(results[3].reason).toEqual("This will fail");
					expect(results[3].state).toEqual("rejected");

					done();
				});
			});

	});

});