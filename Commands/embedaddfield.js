const Command = require('../Classes/Command.js');
const { getGuildID, embedsList, moderatorIDs } = require('../helpers.js');

var command = new Command(["EmbedAddField"], // aliases
	"Adds a field to an custom embed created by HorizonsBot", // description
	"Moderator", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot EmbedAddField (message ID) (header),, (text),, [inline (default: false)]`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Set the title for the given embed
	if (moderatorIDs.includes(receivedMessage.author.id)) {
		let messageID = state.messageArray.shift();
		if (embedsList[messageID]) {
			let inline = state.messageArray.join(' ');
			inline = inline.split(",, ");
			let header = inline.shift();
			if (header) {
				let text = inline.shift();
				if (text) {
					if (inline.length > 0 && inline[0].toLowerCase() == "true") {
						inline = true;
					} else {
						inline = false;
					}
					let guild = receivedMessage.guild;
					if (!guild) {
						guild = receivedMessage.client.guilds.resolve(getGuildID(receivedMessage.client.user.id));
					}
					guild.channels.resolve(embedsList[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].addField(header, text, inline).setTimestamp();
						message.edit("", embed);
					})
				} else {
					receivedMessage.author.send(`Your field value for a \`${state.command}\` command could not be parsed.`)
						.catch(console.error);
				}
			} else {
				receivedMessage.author.send(`Your field name for a \`${state.command}\` command could not be parsed.`)
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
