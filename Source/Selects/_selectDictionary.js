var selectWhitelist = [
	"clubList.js",
	"petitionList.js",
	"topicList.js"
];

const selectDictionary = {};

for (const file of selectWhitelist) {
	const select = require(`./${file}`);
	selectDictionary[select.name] = select;
}

exports.getSelect = (selectName) => {
	return selectDictionary[selectName];
}
