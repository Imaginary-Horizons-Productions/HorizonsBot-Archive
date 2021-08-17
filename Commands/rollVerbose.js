const Command = require('../Classes/Command.js');
const { getRollString } = require('../Helper Modules/RollEngine.js');

var command = new Command(["RollVerbose"],
	"Roll dice, get results compared to max for each dice",
	"N/A",
	["Example - replace ( ) with your settings"],
	["`@HorizonsBot RollVerbose (dice in #d# format) [label]`"]);

command.data.addStringOption(option => option.setName("dice").setDescription("The number and type of dice, use #d# format").setRequired(true))
	.addStringOption(option => option.setName("label").setDescription("Text label for the roll").setRequired(false));

command.execute = (receivedMessage, state) => {
	if (state.messageArray.length > 0) {
		var rollResult = getRollString(state.messageArray.join(' '), true, false);
		receivedMessage.channel.send(`Roll Result:\n\`${rollResult}\``);
	} else {
		receivedMessage.author.send('Please provide the number/type of dice you want to role in #d# format.')
			.catch(console.error);
	}
};

command.executeInteraction = (interaction) => {
	// Roll dice, and report results for each dice compared to their max
	var rollInput = interaction.options.getString('dice');
	var label = interaction.options.getString('label');
	if (label) {
		rollInput = rollInput.concat(` ${label}`);
	}
	var rollResult = getRollString(rollInput, true, false);
	interaction.reply(`Roll Result:\n\`${rollResult}\``);
};

module.exports = command;