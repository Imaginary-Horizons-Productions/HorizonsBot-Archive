const Command = require('../Classes/Command.js');
const { Permissions } = require('discord.js');
var helpers = require('../helpers.js');

var command = new Command(["EmbedSpliceFields"], // aliases
	"Splices the fields of an custom embed created by HorizonsBot", // description
	"Permission to Manage Webhooks", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSpliceFields (message ID) (index),, (delete count)`\nReplacing fields unsupported."]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title for the given embed
	if (receivedMessage.member.hasPermission(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
		let messageID = state.messageArray.shift();
		if (helpers.embedsList[messageID]) {
			let deleteCount = state.messageArray.join(' ');
			deleteCount = deleteCount.split(",, ");
			let index = parseInt(deleteCount.shift());
			if (!isNaN(index)) {
				deleteCount = parseInt(deleteCount[0]);
				if (!isNaN(deleteCount)) {
					receivedMessage.guild.channels.resolve(helpers.embedsList[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].spliceFields(index, deleteCount).setTimestamp();
						message.edit("", embed);
					})
				} else {
					receivedMessage.author.send(`Please provide an interger for your \`${state.command}\` command delete count.`)
						.catch(console.error);
				}
			} else {
				receivedMessage.author.send(`Please provide an interger for your \`${state.command}\` command index.`)
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
}

module.exports = command;
