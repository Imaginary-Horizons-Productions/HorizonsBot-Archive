var selectWhitelist = [
];

exports.selectDictionary = {};

for (const file of selectWhitelist) {
	const select = require(`./${file}`);
	exports.selectDictionary[select.name] = select;
}
