const Command = require('../Classes/Command.js');
const { guildID, customEmbeds, isModerator } = require('../helpers.js');

var command = new Command(["EmbedSetURL"], // aliases
	"Assigns a title url to a custom embed", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetURL (message ID) (url)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title url for the given embed
	if (isModerator(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (customEmbeds[messageID]) {
			let url = state.messageArray[0];
			if (url) {
				receivedMessage.client.guilds.fetch(guildID).then(guild => {
					guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setURL(url).setTimestamp();
						message.edit("", embed);
					})
				})
			} else {
				receivedMessage.author.send(`Your url for a \`${state.command}\` command could not be parsed.`)
					.catch(console.error);
			}
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
