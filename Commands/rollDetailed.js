const Command = require('../Classes/Command.js');
const { getRollString } = require('../Helper Modules/RollEngine.js');

var command = new Command(["rollDetailed"],
	"Roll some dice and get the results from each die!",
	"None",
	["Example - replace ( ) with your settings"],
	[`@HorizonsBot rollDetailed (numbers and dice rolls formatted as #d#) (text to put after the roll [optional])`]);

command.execute = (receivedMessage, state) => {
	var rollResult = getRollString(state.messageArray.join(' '), false, false);
	receivedMessage.channel.send(`Roll Result:\n\`${rollResult}\``);
};

module.exports = command;