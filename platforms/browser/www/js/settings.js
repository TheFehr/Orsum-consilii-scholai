(function(w) {
	"use strict";
	
	var defaultValues = {
		"school": "kbw",
		"class" : "3i"
	};
	
	var Settings = function() {
		var loaded = false;
		var values = {};
				
		var get = function(name) {
			return loaded == (!1) ? (localStorage.getItem(name) || defaultValues[name]) : values[name];
		};
				
		for (var i in defaultValues) {
			this.__defineGetter__(i, (function(i) {
				return function() {
					return get(i);
				};
			})(i));
			
			(function(i, t) {
				t.__defineSetter__(i, function(newV) {
					values[i] = newV;
					w.localStorage.setItem(i, newV);
					if (loaded) w.eventController.dispatch("settings");
				});
			})(i, this);
			
			this[i] = get(i);
		}
		
		loaded = true;
	};
	
	w.settings = new Settings;
})(window);
