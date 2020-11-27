String.prototype.addVariables = function (variables) {
	var buffer = this;
	Object.keys(variables).forEach(key => {
		buffer = buffer.split(`\${${key}}`).join(variables[key]);
	})

	return buffer;
}
