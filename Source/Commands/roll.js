const Command = require('../../Classes/Command.js');
const { getRollString } = require('../../Helper Modules/RollEngine.js');

const options = [
	{ type: "String", name: "dice", description: "The dice to roll in #d# format", required: true, choices: {} },
	{
		type: "String", name: "display", description: "Choose output display option", required: false, choices: {
			"Result only": "simple",
			"Compare to max total roll": "max",
			"Result for each die": "individual",
			"Compare each die to max roll": "verbose"
		}
	},
	{ type: "String", name: "label", description: "Text after the roll", required: false, choices: {} },
];
const subcomands = [];
module.exports = new Command("roll", "Roll any number of dice with any number of sides", options, subcomands);

// internal imports here
module.exports.initialize = function (helpers) {
	({} = helpers);
}

module.exports.execute = (interaction) => {
	// Roll the specified dice
	var rollInput = interaction.options.getString('dice');
	var label = interaction.options.getString('label');
	if (label) {
		rollInput = rollInput.concat(` ${label}`);
	}
	switch (interaction.options.getString('display')) {
		case "max":
			var rollResult = getRollString(rollInput, true, true);
			break;
		case "individual":
			var rollResult = getRollString(rollInput, false, false);
			break;
		case "verbose":
			var rollResult = getRollString(rollInput, true, false);
			break;
		default:
			var rollResult = getRollString(rollInput, false, true);
			break;
	}
	interaction.reply(`Roll Result:\n\`${rollResult}\``);
}
