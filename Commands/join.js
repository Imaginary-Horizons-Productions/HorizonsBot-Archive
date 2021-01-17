const Command = require('../Classes/Command.js');
const { guildID, topicList, campaignList } = require('../helpers.js');

var command = new Command(["Join"], // aliases
	"Join an opt-in channel or TRPG campaign", // description
	"None", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot Join (channel ID)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Determine if user mentioned a topic or campaign, then provide appropriate permissions
	let channelID = state.messageArray[0]; // can't use mention because users can't mention channels that are invisible to them (even by constructing the mention manually)
	if (channelID) {
		let guild = receivedMessage.client.guilds.resolve(guildID);
		let channel = guild.channels.resolve(channelID);
		let permissionOverwrite = channel.permissionOverwrites.get(receivedMessage.author.id);
		if (!permissionOverwrite || !permissionOverwrite.deny.has("VIEW_CHANNEL", false)) {
			if (topicList.includes(channelID)) {
				channel.createOverwrite(receivedMessage.author, {
					"VIEW_CHANNEL": true
				}).then(() => {
					channel.send(`Welcome to ${channel.name}, ${receivedMessage.author}!`);
				}).catch(console.log);
			} else if (Object.keys(campaignList).includes(channelID)) {
				//TODO implement with campaign tracking
			} else {
				receivedMessage.author.send(`The ID you provided does not seem to be associated with a topic or campaign channel.`)
					.catch(console.error);
			}
		} else {
			receivedMessage.author.send(`You are currently banned from ${channel.name}. Speak to a Moderator if you believe this is in error.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Please provide the ID of a channel to join.`)
			.catch(console.error);
	}
}

module.exports = command;
