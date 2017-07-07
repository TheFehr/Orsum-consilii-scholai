(function() {
	"use strict";
	
	var currentTabIndex = 0;
	
	window.navbar = {
		_ELEMENT_BINDINGS: ["#timetable", "#settings"],
		elements: null,
		
		init: function init() {
			navbar.elements = document.getElementsByClassName("navItem");
			for (var i = 0; i < navbar.elements.length; ++i) {
				var el = navbar.elements.item(i);
				
				var ev = (navigator.userAgent == "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36" || navigator.userAgent == "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14" || navigator.userAgent == "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36") ? "click" : "touchstart";
				
				el.addEventListener(ev, (function(i) {
					return function(e) {
						e = e || window.event;
						
						if (!navbar.switchToTab(i)) {
							e.preventDefault();
						}
					};
				})(i), false);
			}
			
			if (cordova.platformId == "android") {
				document.querySelector("#navbar-statusbar").style.display = "none";
				document.querySelector("#navbar").style.top = "0";
				document.querySelector(".full-page").style.paddingTop = "50px";
			}
		},
		
		switchToTab: function(i) {
			if (i < 0 || i >= navbar.elements.length || currentTabIndex == i)
				return false;
				
			var newTab = navbar.elements.item(i);
			newTab.classList.add("active");
			navbar.elements.item(currentTabIndex).classList.remove("active");
			
			document.querySelector(navbar._ELEMENT_BINDINGS[currentTabIndex]).classList.remove("active");
			document.querySelector(navbar._ELEMENT_BINDINGS[currentTabIndex]).style.opacity = "0";
			document.querySelector(navbar._ELEMENT_BINDINGS[i]).classList.add("active");
			document.querySelector(navbar._ELEMENT_BINDINGS[i]).classList.add(i < currentTabIndex ? "right" : "left");
			
			setTimeout((function(ind) {
				return function() {
					document.querySelector(navbar._ELEMENT_BINDINGS[ind]).style.opacity = "1";
				};
			})(currentTabIndex), 250);
			
			currentTabIndex = i;
			return true;
		},
		
		deinit: function() {
			for (var i = 0; i < navbar.elements.length; ++i) {
				var el = navbar.elements.item(i);
				el.removeEventListener("touchstart");
			}
		}
	};
})();