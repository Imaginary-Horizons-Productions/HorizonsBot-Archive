const Command = require('../Classes/Command.js');
const { getGuildID, topicList, campaignList } = require('../helpers.js');

var command = new Command(["Join"], // aliases
	"Join an opt-in channel or TRPG campaign", // description
	"None", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot Join (channel ID)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Determine if user mentioned a topic or campaign, then provide appropriate permissions
	let channelID = state.messageArray[0]; // can't use mention because users can't mention channels that are invisible to them (even by constructing the mention manually)
	if (channelID) {
		if (topicList.includes(channelID)) {
			let guild = receivedMessage.client.guilds.resolve(getGuildID(receivedMessage.client.user.id));
			let channel = guild.channels.resolve(channelID);
			channel.createOverwrite(receivedMessage.author, {
				"VIEW_CHANNEL": true
			}).then(() => {
				channel.send(`Welcome to ${channel.name}, ${receivedMessage.author}!`)
					.catch(console.log);
			})
		} else if (Object.keys(campaignList).includes(channelID)) {
			//TODO implement with campaign tracking
		} else {
			receivedMessage.author.send(`The ID you provided does not seem to be associated with a topic or campaign channel.`)
		}
	} else {
		receivedMessage.author.send(`Please mention the ID of a channel to join.`)
			.catch(console.error);
	}
}

module.exports = command;
