ShaderType = Object.freeze({
	VERTEX : "vertex",
	FRAGMENT : "fragment"
});

Renderer = function(params) {
	console.log('Initializing a renderer');

	var params = params || {};
	var _this = this;
	var _canvas = document.createElement('canvas');
	var _gl = null;
	var _shaders = [];

	this.canvasDOM = _canvas;	
	initGL();
	this.gl = _gl;
	
	// ******************************************************************************

	this.setSize = function(width, height) {
		_canvas.width = width;
		_canvas.height = height;
		_canvas.style.width = width + 'px';
		_canvas.style.height = height + 'px';
		_gl.viewport(0, 0, _canvas.width, _canvas.height);
	};

	this.setClearColor = function(red, green, blue, alpha) {
		alpha = alpha !== undefined ? alpha : 1;
		_gl.clearColor(red, green, blue, alpha);
	};

	this.clear = function(color, depth) {
		var bits = 0;

		if (color === undefined || color) bits |= _gl.COLOR_BUFFER_BIT;
		if (depth === undefined || depth) bits |= _gl.DEPTH_BUFFER_BIT;

		_gl.clear(bits);
	};

	this.createShader = function(shaderInfo) {
		var shader = new Shader();
		var shaderType = null;
		var type = shaderInfo.type;

		shader.name = shaderInfo.name;
		shader.code = shaderInfo.code;

		if (type === ShaderType.VERTEX) {
			shaderType = _gl.VERTEX_SHADER;
		} else if (type === ShaderType.FRAGMENT) {
			shaderType = _gl.FRAGMENT_SHADER;
		} else {
			console.log('Trying to create a shader of unknown type: ' + type);
			shader.compilationError = 'Trying to create a shader of unknown type: ' + type;
			shader.compiled = false;
			shader.id = -1;
			return shader;
		}

		shader.type = type;
		shader.id = _gl.createShader(shaderType);
		_gl.shaderSource(shader.id, shader.code);
		_gl.compileShader(shader.id);

		if (!_gl.getShaderParameter(shader.id, _gl.COMPILE_STATUS)) {
			var errorMsg = _gl.getShaderInfoLog(shader.id);
			console.log('Failed to compile shader: ' + errorMsg + '\n' + shader.code);
			shader.compilationError = 'Failed to compile shader: ' + errorMsg + '\n' + shader.code;
			shader.compiled = false;
			shader.id = -1;			
			return shader;
		}	

		shader.compilationError = "";
		shader.compiled = true;
		return shader;
	}

	this.createGpuProgram = function(vertShader, fragShader) {
		var gpuProgram = new GpuProgram();
		gpuProgram.name = vertShader.name + '_' + fragShader.name;

		if (vertShader === null || fragShader === null) {
			console.log('Trying to create a program without vertex and/or fragment-shader');
			gpuProgram.linkingError = 'Trying to create a program without vertex and/or fragment-shader';
			return gpuProgram;
		}

		if (vertShader.id === -1 || vertShader.compiled === false) {
			console.log('Trying to create a program with an invalid or non-compiled vertex-shader');
			gpuProgram.linkingError = 'Trying to create a program with an invalid or non-compiled vertex-shader';
			return gpuProgram;
		}

		if (fragShader.id === -1 || fragShader.compiled === false) {
			console.log('Trying to create a program with an invalid or non-compiled fragment-shader');
			gpuProgram.linkingError = 'Trying to create a program with an invalid or non-compiled fragment-shader';
			return gpuProgram;
		}

		gpuProgram.id = _gl.createProgram();
		_gl.attachShader(gpuProgram.id, vertShader.id);
		_gl.attachShader(gpuProgram.id, fragShader.id);
		_gl.linkProgram(gpuProgram.id);

		if (!_gl.getProgramParameter(gpuProgram.id, _gl.LINK_STATUS)) {
			var errorMsg = _gl.getShaderInfoLog(shader.id);
			console.log('Failed to link program: ' + errorMsg);
			gpuProgram.linkingError = 'Failed to link program: ' + errorMsg;
			gpuProgram.linked = false;
			gpuProgram.id = -1;			
			return gpuProgram;	
		}

		_gl.useProgram(gpuProgram.id);

		// TODO: Don't use hard-coded locations, use "enum" instead {location: 0, name: "inVertexPosition"}
		_gl.bindAttribLocation(gpuProgram.id, 0, 'inVertexPosition');
		_gl.bindAttribLocation(gpuProgram.id, 1, 'inVertexColor');
		_gl.bindAttribLocation(gpuProgram.id, 2, 'inVertexNormal');
		_gl.bindAttribLocation(gpuProgram.id, 3, 'inVertexTexCoord0');
		_gl.bindAttribLocation(gpuProgram.id, 4, 'inVertexTexCoord1');
		_gl.bindAttribLocation(gpuProgram.id, 5, 'inVertexTangent');
		_gl.bindAttribLocation(gpuProgram.id, 6, 'inVertexBitangent');

		gpuProgram.linkingError = "";
		gpuProgram.linked = true;
		
		return gpuProgram;
	}

	// ******************************************************************************

	function initGL() {
		try {
			var attributes = {
				//alpha: _alpha,
				//premultipliedAlpha: _premultipliedAlpha,
				//antialias: true,
				//stencil: _stencil,
				//preserveDrawingBuffer: _preserveDrawingBuffer
			};

			_gl = _canvas.getContext('webgl', attributes) || _canvas.getContext('experimental-webgl', attributes);

			if (_gl === null) {
				throw 'Error creating WeblGL context.';
			}
		} catch (error) {
			console.log(error);
		}
	};
}