const Command = require('../Classes/Command.js');
const { getRollString } = require('../Helper Modules/RollEngine.js');

var command = new Command(["RollDetailed"],
	"Roll dice, get results for each die",
	"N/A",
	["Example - replace ( ) with your settings"],
	["`@HorizonsBot RollDetailed (dice in #d# format) [label]`"]);

command.execute = (receivedMessage, state) => {
	if (state.messageArray.length > 0) {
		var rollResult = getRollString(state.messageArray.join(' '), false, false);
		receivedMessage.channel.send(`Roll Result:\n\`${rollResult}\``);
	} else {
		receivedMessage.author.send('Please provide the number/type of dice you want to role in #d# format.')
			.catch(console.error);
	}

};

module.exports = command;