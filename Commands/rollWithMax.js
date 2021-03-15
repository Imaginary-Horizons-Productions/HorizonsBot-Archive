const Command = require('../Classes/Command.js');
const { getRollString } = require('../Helper Modules/RollEngine.js');

var command = new Command(["rollWithMax"],
	"Roll some dice and get the result with a comparison to the maximum!",
	"None",
	["Example - replace ( ) with your settings"],
	[`@HorizonsBot rollWithMax (numbers and dice rolls formatted as #d#) (text to put after the roll [optional])`]);

command.execute = (receivedMessage, state) => {
	var rollResult = getRollString(state.messageArray.join(' '), true, true);
	receivedMessage.channel.send(`Roll Result:\n\`${rollResult}\``);
};

module.exports = command;