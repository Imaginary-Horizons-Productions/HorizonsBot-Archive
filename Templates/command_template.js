const Command = require('../Classes/Command.js');

var command = new Command([], // aliases
	"", // description
	"", // requirements
	[], // headings
	[]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Command specifications go here
}

module.exports = command;
