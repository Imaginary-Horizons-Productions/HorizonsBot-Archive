const Command = require('../Classes/Command.js');
const { guildID, customEmbeds, isModerator } = require('../helpers.js');

var command = new Command(["EmbedSetAuthor"], // aliases
	"Assign a custom embed's author", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetAuthor (message ID) (name),, [iconURL],, [url]`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the author for the given embed
	if (isModerator(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (customEmbeds[messageID]) {
			let url = state.messageArray.join(' ');
			url = url.split(",, ");
			let name = url.shift();
			if (name) {
				let iconURL = url.shift();
				url = url.toString();
				receivedMessage.client.guilds.fetch(guildID).then(guild => {
					guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setAuthor(name, iconURL, url).setTimestamp();
						message.edit("", embed);
					})
				})
			} else {
				receivedMessage.author.send(`Your author name for a \`${state.command}\` command could not be parsed.`)
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
