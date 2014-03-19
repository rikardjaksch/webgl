var renderer;
var shaderParser;
var basicVertShader;
var basicFragShader;
var gpuProgram;
var triangle;

function main() {
	init();
	doFrame();
}

function init() {
	renderer = new Renderer();
	renderer.setSize(800, 600);
	renderer.setClearColor(0, 0, 0);

	shaderParser = new ShaderParser();
	shaderParser.parse(getSourceSynch('resources/shaders/shaders.json'));
	basicVertShader = renderer.createShader(shaderParser.getShaderInfo("basic", ShaderType.VERTEX));
	basicFragShader = renderer.createShader(shaderParser.getShaderInfo("basic", ShaderType.FRAGMENT));

	gpuProgram = renderer.createGpuProgram(basicVertShader, basicFragShader);

	var verts = [
		0.0, 0.5, 0.0,
		-0.5, -0.5, 0.0,
		0.5, -0.5, 0.0
	];

	triangle = renderer.gl.createBuffer();
	renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, triangle);
	renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(verts), renderer.gl.STATIC_DRAW);

	var container = document.getElementById('container');
	if (!container) {
		console.log('Failed to retrieve the container element');
		return;
	}

	container.appendChild(renderer.canvasDOM);
}

function doFrame() {
	renderer.clear();

	renderer.gl.useProgram(gpuProgram.id);
	renderer.gl.enableVertexAttribArray(0);

	renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, triangle);
	renderer.gl.vertexAttribPointer(0, 3, renderer.gl.FLOAT, false, 0, 0);
	renderer.gl.drawArrays(renderer.gl.TRIANGLES, 0, 3);

	requestAnimationFrame(doFrame);
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function getSourceSynch(url) {
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.send(null);
	return (req.status === 200) ? req.responseText : null;
}