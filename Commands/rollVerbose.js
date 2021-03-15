const Command = require('../Classes/Command.js');
const { getRollString } = require('../Helper Modules/RollEngine.js');

var command = new Command(["RollVerbose"],
	"Roll dice, get results compared to max for each dice",
	"N/A",
	["Example - replace ( ) with your settings"],
	["`@HorizonsBot RollVerbose (dice in #d# format) [label]`"]);

command.execute = (receivedMessage, state) => {
	if (state.messageArray.length > 0) {
		var rollResult = getRollString(state.messageArray.join(' '), true, false);
		receivedMessage.channel.send(`Roll Result:\n\`${rollResult}\``);
	} else {
		receivedMessage.author.send('Please provide the number/type of dice you want to role in #d# format.')
			.catch(console.error);
	}
};

module.exports = command;