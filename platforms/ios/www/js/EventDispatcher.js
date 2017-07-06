(function() {
	var EventController = function() {
		var registry = [];
		this.register = function(ev, func) {
			if (typeof ev !== "string" || typeof func !== "function")
				throw new Error("no good type");
				
			registry.push([ev, func]);
		};
		
		this.dispatch = function(ev, userinfo) {
			userinfo = userinfo || {};
			userinfo["event"] = ev;
			
			for (var i of registry) {
				if (i[0] == ev)
					i[1](userinfo);
			}
		};
	};
	
	window.eventController = new EventController();
})();
