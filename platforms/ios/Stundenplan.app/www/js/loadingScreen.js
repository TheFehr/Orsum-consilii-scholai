let animationDuration = 200;

function displayLoadingOverlay() {
	let wrappi = document.getElementById("wrapper");
	wrappi.style.display = "block";
	setTimeout(function() {
		wrappi.style.opacity = 1;
	}, 0);
}

function hideLoadingOverlay() {
	let wrappi = document.getElementById("wrapper");
	wrappi.style.opacity = 0;
	
	setTimeout(function() {
		wrappi.style.display = "none";
	}, animationDuration);
}
