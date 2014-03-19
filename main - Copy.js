var fpsElement = document.getElementById("fps");
var frameMs = document.getElementById("frameMs");
var then = Date.now() / 1000;
var gl = null;
var shaderProgram;
var triangleBuffer;

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

	createTriangleObject();
	initShaders();

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

    // Draw triangle
    gl.useProgram(shaderProgram);
    var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(doFrame);
}

function createTriangleObject() {
	triangleBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

	var vertices = [
		 0.0,  0.5, 0.0,
		 0.5, -0.5, 0.0,
		-0.5, -0.5, 0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleBuffer.itemSize = 3;
	triangleBuffer.numItems = 3;
}

function getSourceSynch(url) {
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.send(null);
	return (req.status === 200) ? req.responseText : null;
}

function initShaders() {
	var vert = gl.createShader(gl.VERTEX_SHADER);
	var frag = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vert, getSourceSynch('resources/shaders/basic.vert'));
	gl.shaderSource(frag, getSourceSynch('resources/shaders/basic.frag'));

	gl.compileShader(vert);
	
	if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vert));
        return null;
    }

    gl.compileShader(frag);

    if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(frag));
        return null;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vert);
    gl.attachShader(shaderProgram, frag);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);
}