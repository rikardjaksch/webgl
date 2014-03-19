ShaderParser = function() {

	var vertexShaders = {};
	var fragmentShaders = {};

	// ******************************************************************************

	this.parse = function(data) {
		if (data === null || data === undefined) {
			return;
		}
				
		var parsedData = JSON.parse(data);

		if (parsedData.vertex_shaders === undefined) {
			console.log('Could not find "vertex_shaders" key in shaders definition');
			return;
		}

		if (parsedData.fragment_shaders === undefined) {
			console.log('Could not find "fragment_shaders" key in shaders definition');
			return;
		}

		storeShaders(parsedData.vertex_shaders, vertexShaders);
		storeShaders(parsedData.fragment_shaders, fragmentShaders);
	};

	this.getShaderInfo = function(shaderName, shaderType) {
		if (shaderType !== undefined) {
			if (shaderType === ShaderType.VERTEX) {
				if (vertexShaders.hasOwnProperty(shaderName)) {
					return {name : shaderName, code : vertexShaders[shaderName], type : shaderType};
				} else {
					console.log('Did not find vertex-shader with name ' + shaderName);
					return null;
				}
			} else if (shaderType === ShaderType.FRAGMENT) {
				if (fragmentShaders.hasOwnProperty(shaderName)) {
					return {name : shaderName, code : fragmentShaders[shaderName], type : shaderType};			
				} else {
					console.log('Did not find vertex-shader with name ' + shaderName);
					return null;
				}
			} else {
				console.log('Unknown type of shader');
				return null;
			}
		}
	}

	// ******************************************************************************

	function storeShaders(shaderList, targetList) {
		var numShaders = shaderList.length;
		for (var i = 0; i < numShaders; ++i) {
			var shaderObj = shaderList[i];
			Object.getOwnPropertyNames(shaderObj).forEach(function(val, index, array) {
				var name = val;
				var codeArray = shaderObj[val];
				var codeArrayLength = codeArray.length;
				var concatCode = "";

				for (var j = 0; j < codeArrayLength; ++j) {
					concatCode += codeArray[j] + '\n';
				}

				targetList[name] = concatCode;
			});
		}		
	}
}