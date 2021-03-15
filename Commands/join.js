const Command = require('../Classes/Command.js');
const { guildID, joinChannel, findTopicID } = require('../helpers.js');

var command = new Command(["Join"], // aliases
	"Join one or many opt-in channels or TRPG campaigns", // description
	"N/A", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot Join (channel names or IDs)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Determine if user mentioned a topic or campaign, then provide appropriate permissions
	if (state.messageArray.length > 0) {
		state.messageArray.forEach(argument => { // can't use mention because users can't mention channels that are invisible to them (even by constructing the mention manually)
			receivedMessage.client.guilds.fetch(guildID).then(guild => {
				if (isNaN(parseInt(argument))) {
					let channelID = findTopicID(argument.toLowerCase());
					if (channelID) {
						let channel = guild.channels.resolve(channelID);
						joinChannel(channel, receivedMessage.author);
					}
				} else {
					let channel = guild.channels.resolve(argument);
					joinChannel(channel, receivedMessage.author);
				}
			});
		})
	} else {
		receivedMessage.author.send(`Please provide the name or ID of a channel to join.`)
			.catch(console.error);
	}
}

module.exports = command;
