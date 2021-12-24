const Command = require('../../Classes/Command.js');
const { getRollString } = require('../../Helper Modules/RollEngine.js');

let options = [
	{ type: "String", name: "dice", description: "The number and type of dice, user #d# format", required: true, choices: {} },
	{
		type: "String", name: "display", description: "Choose output display options", required: false, choices: {
			"Result only": "simple",
			"Compare to max total roll": "max",
			"Result for each die": "individual",
			"Compare each die to max roll": "verbose"
		}
	},
	{ type: "String", name: "label", description: "Text label for the roll", required: false, choices: {} },
];
module.exports = new Command("roll", "Roll dice", options);

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
