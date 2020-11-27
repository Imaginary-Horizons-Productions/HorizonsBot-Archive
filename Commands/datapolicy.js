const Command = require('../Classes/Command.js');

var command = new Command(["DataPolicy"], // aliases
	"Shows types of user data HorizonsBot collects and how it's used", // description
	"None", // requirements
	["Usage"], // headings
	["`@HorizonsBot DataPolicy`"]); // texts (must match number of headings)

command.help = (avatarURL) => {
	return dataPolicyBuilder();
}

command.execute = (receivedMessage, state) => {
	// Command specifications go here
	receivedMessage.author.send(dataPolicyBuilder())
		.catch(console.error);
}

module.exports = command;

function dataPolicyBuilder() {
	return `As of version 1.0.0, this bot collects the following user data:\n\t- **User Discord IDs** for managing channel visibility per user\n\n\
	As of version 1.0.0, Imaginary Horizons Productions does not use the above user data for anything.`
}