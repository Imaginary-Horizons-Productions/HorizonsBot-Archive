const Command = require('../Classes/Command.js');
const { getRollString } = require('../Helper Modules/RollEngine.js');

var command = new Command(["Roll"],
	"Roll dice",
	"N/A",
	["Example - replace ( ) with your settings"],
	["`@HorizonsBot Roll (dice in #d# format) [label]`"]);

command.data.addStringOption(option => option.setName("dice").setDescription("The number and type of dice, use #d# format").setRequired(true))
	.addStringOption(option => option.setName("display").setDescription("Choose output display options").setRequired(false)
		.addChoice("Result only", "simple")
		.addChoice("Compare to max total roll", "max")
		.addChoice("Result for each die", "individual")
		.addChoice("Compare each die to max roll", "verbose"))
		.addStringOption(option => option.setName("label").setDescription("Text label for the roll").setRequired(false));

command.execute = (receivedMessage, state) => {
	receivedMessage.author.send('Please use the slash command for rolling dice.')
		.catch(console.error);
};

command.executeInteraction = (interaction) => {
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

module.exports = command;