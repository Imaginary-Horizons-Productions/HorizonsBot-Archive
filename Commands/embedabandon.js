const Command = require('../Classes/Command.js');
const { customEmbeds, isModerator, saveObject } = require('../helpers.js');

var command = new Command(["EmbedAbandon"], // aliases
	"Stop managing the given embed(s)", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedAbandon (message ID)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Stop managing the given embed(s)
	if (isModerator(receivedMessage.author.id)) {
		state.messageArray.forEach(messageID => {
			if (customEmbeds[messageID]) {
				delete customEmbeds[messageID];
				saveObject(customEmbeds, "embedsList.json");
				receivedMessage.author.send(`The provided embed has been abandoned.`)
					.catch(console.error);
			} else {
				receivedMessage.author.send(`The embed you provided for a \`${state.command}\` command could not be found.`)
					.catch(console.error);
			}
		})
	} else {
		receivedMessage.author.send(`You must be a Moderator to use the \`${state.command}\` command.`)
			.catch(console.error);
	}
}

module.exports = command;
