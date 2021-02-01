const Command = require('../Classes/Command.js');
const { embedsList, isModerator, saveObject } = require('../helpers.js');

var command = new Command(["EmbedAbandon"], // aliases
	"Sets the bot to stop managing the given embed", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedAbandon (message ID)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title for the given embed
	if (isModerator(receivedMessage.author.id)) {
		let messageID = state.messageArray[0];
		if (embedsList[messageID]) {
			delete embedsList[messageID];
			saveObject(embedsList, "embedsList.json");
			receivedMessage.author.send(`The provided embed has been abandoned.`)
				.catch(console.error);
		} else {
			receivedMessage.author.send(`The embed you provided for a \`${state.command}\` command could not be found.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`You must be a Moderator to use the \`${state.command}\` command.`)
			.catch(console.error);
	}
}

module.exports = command;
