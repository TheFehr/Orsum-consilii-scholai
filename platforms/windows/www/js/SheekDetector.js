function initSheek() {
	var threshold = 30;
	var lastEventIssue = 0;
	var latency = 500;
	
	var watchID = navigator.accelerometer.watchAcceleration(function(acceleration) {
		if (Math.abs(acceleration.x) >= threshold) {
			if (Math.abs(acceleration.y) > 3) {
				if ((new Date).getTime() - latency >= lastEventIssue) {
					eventController.dispatch("schüddel");
				}
			}
		}
	}, function() {
		alert("Dein Device ist scheisse, es hat keinen Accelorometer. Kaufe doch ein neues iPhone.");
	}, { 
		frequency: 600 
	});
}