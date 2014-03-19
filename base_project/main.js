var fpsElement = document.getElementById("fps");
var frameMs = document.getElementById("frameMs");
var then = Date.now() / 1000;
var gl = null;

function main() {
	var canvas = document.getElementById('webgl');
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element');
		return;
	}

	gl = getWebGLContext(canvas, true);
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;	
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	doFrame();
}

function doFrame() {
	// Compute time since last frame
	var now = Date.now() / 1000;
	var elapsedTime = now - then;
	then = now;
	frameMs.innerText = elapsedTime.toFixed(2);

	// Compute FPS
	var fps = 1 / elapsedTime;
    fpsElement.innerText = fps.toFixed(2);

    // Clear screen
    gl.clear(gl.COLOR_BUFFER_BIT);

    requestAnimationFrame(doFrame);
}