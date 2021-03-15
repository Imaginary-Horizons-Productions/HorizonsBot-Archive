const Command = require('../Classes/Command.js');
const { guildID, customEmbeds, isModerator } = require('../helpers.js');

var command = new Command(["EmbedSpliceFields"], // aliases
	"Splice custom embed's fields", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedSpliceFields (message ID) (index),, (delete count)`\nReplacing fields unsupported."]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Splice fields from the given embed
	if (isModerator(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (customEmbeds[messageID]) {
			let deleteCount = state.messageArray.join(' ');
			deleteCount = deleteCount.split(",, ");
			let index = parseInt(deleteCount.shift());
			if (!isNaN(index)) {
				deleteCount = parseInt(deleteCount[0]);
				if (!isNaN(deleteCount)) {
					receivedMessage.client.guilds.fetch(guildID).then(guild => {
						guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
							let embed = message.embeds[0].spliceFields(index, deleteCount).setTimestamp();
							message.edit("", embed);
						})
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
		receivedMessage.author.send(`You must be a Moderator to use the \`${state.command}\` command.`)
			.catch(console.error);
	}
}

module.exports = command;
