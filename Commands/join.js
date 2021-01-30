const Command = require('../Classes/Command.js');
const { guildID, joinChannel } = require('../helpers.js');

var command = new Command(["Join"], // aliases
	"Join an opt-in channel or TRPG campaign", // description
	"None", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot Join (channel ID)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Determine if user mentioned a topic or campaign, then provide appropriate permissions
	let channelID = state.messageArray[0]; // can't use mention because users can't mention channels that are invisible to them (even by constructing the mention manually)
	if (channelID) {
		receivedMessage.client.guilds.fetch(guildID).then(guild => {
			let channel = guild.channels.resolve(channelID);
			joinChannel(channel, receivedMessage.author);
		});
	} else {
		receivedMessage.author.send(`Please provide the ID of a channel to join.`)
			.catch(console.error);
	}
}

module.exports = command;
