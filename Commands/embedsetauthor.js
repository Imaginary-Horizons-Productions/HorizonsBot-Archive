const Command = require('../Classes/Command.js');
const { getGuildID, embedsList, moderatorIDs } = require('../helpers.js');

var command = new Command(["EmbedSetAuthor"], // aliases
	"Assigns an author to an custom embed created by HorizonsBot", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetAuthor (message ID) (name),, [iconURL],, [url]`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title for the given embed
	if (moderatorIDs.includes(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (embedsList[messageID]) {
			let url = state.messageArray.join(' ');
			url = url.split(",, ");
			let name = url.shift();
			if (name) {
				let iconURL = url.shift();
				url = url.toString();
				let guild = receivedMessage.guild;
				if (!guild) {
					guild = receivedMessage.client.guilds.resolve(getGuildID(receivedMessage.client.user.id));
				}
				guild.channels.resolve(embedsList[messageID]).messages.fetch(messageID).then(message => {
					let embed = message.embeds[0].setAuthor(name, iconURL, url).setTimestamp();
					message.edit("", embed);
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
