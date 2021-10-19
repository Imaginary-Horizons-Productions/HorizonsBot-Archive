var buttonWhitelist = [
	"countdown.js",
	"delete.js",
	"join.js"
];

const buttonDictionary = {};

for (const file of buttonWhitelist) {
	const button = require(`./${file}`);
	buttonDictionary[button.name] = button;
}

exports.getButton = (buttonId) => {
	return buttonDictionary[buttonId];
}
