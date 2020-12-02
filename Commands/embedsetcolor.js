const Command = require('../Classes/Command.js');
const { Permissions } = require('discord.js');
var helpers = require('../helpers.js');

var command = new Command(["EmbedSetColor", "EmbedSetColour"], // aliases
	"Assigns the color of an custom embed created by HorizonsBot", // description
	"Permission to Manage Webhooks, must be used from a server channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetColor (message ID) (color hexcode)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title for the given embed
	if (receivedMessage.guild) {
		if (receivedMessage.member.hasPermission(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
			let messageID = state.messageArray.shift();
			if (helpers.embedsList[messageID]) {
				let colorCode = state.messageArray[0];
				if (colorCode.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)) {
					receivedMessage.guild.channels.resolve(helpers.embedsList[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setColor(colorCode).setTimestamp();
						message.edit("", embed);
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
			receivedMessage.author.send(`You need permission to manage webhooks to use the \`${state.command}\` command.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`The \`${state.command}\` command must be used from a server channel.`)
			.catch(console.error);
	}
}

module.exports = command;
