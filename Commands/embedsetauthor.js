const Command = require('../Classes/Command.js');
const { Permissions } = require('discord.js');
var helpers = require('../helpers.js');

var command = new Command(["EmbedSetAuthor"], // aliases
	"Assigns an author to an custom embed created by HorizonsBot", // description
	"Permission to Manage Webhooks, must be used from a server channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSetAuthor (message ID) (name),, [iconURL],, [url]`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title for the given embed
	if (receivedMessage.guild) {
		if (receivedMessage.member.hasPermission(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
			let messageID = state.messageArray.shift();
			if (helpers.embedsList[messageID]) {
				let url = state.messageArray.join(' ');
				url = url.split(",, ");
				let name = url.shift();
				if (name) {
					let iconURL = url.shift();
					url = url.toString();
					receivedMessage.guild.channels.resolve(helpers.embedsList[messageID]).messages.fetch(messageID).then(message => {
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
			receivedMessage.author.send(`You need permission to manage webhooks to use the \`${state.command}\` command.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`The \`${state.command}\` command must be used from a server channel.`)
			.catch(console.error);
	}
}

module.exports = command;
