const Command = require('../Classes/Command.js');
const { topicList, campaignList } = require('../helpers.js');

var command = new Command(["Leave"], // aliases
	"Leave an opt-in channel or TRPG campaign", // description
	"Must be used from an opt-in channel or campaign channel", // requirements
	["Example"], // headings
	["`@HorizonsBot Leave`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Remove visibility of receiving channel from author
	let leavableChannelIDs = topicList.concat(Object.keys(campaignList));
	if (leavableChannelIDs.includes(receivedMessage.channel.id)) {
		receivedMessage.channel.permissionOverwrites.get(receivedMessage.author.id).delete("HorizonsBot leave used")
			.catch(console.error);
	} else {
		receivedMessage.author.send(`Please use the \`leave\` command from a topic or campaign channel.`)
			.catch(console.error);
	}
}

module.exports = command;
