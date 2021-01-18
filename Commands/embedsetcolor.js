const Command = require('../Classes/Command.js');
const { guildID, embedsList, isModerator } = require('../helpers.js');

var command = new Command(["EmbedSetColor", "EmbedSetColour"], // aliases
	"Assigns the color of an custom embed created by HorizonsBot", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetColor (message ID) (color hexcode)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title for the given embed
	if (isModerator(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (embedsList[messageID]) {
			let colorCode = state.messageArray[0];
			if (colorCode.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)) {
				receivedMessage.client.guilds.fetch(guild => {
					guild.channels.resolve(embedsList[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setColor(colorCode).setTimestamp();
						message.edit("", embed);
					})
				})
			} else {
				receivedMessage.author.send(`Please provide color in hex code format (#000000).`)
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
