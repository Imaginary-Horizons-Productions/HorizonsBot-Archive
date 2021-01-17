const Command = require('../Classes/Command.js');
const { moderatorIDs, topicList, campaignList } = require('../helpers.js');

var command = new Command(["Ban"], // aliases
	"Bans the mentioned users from an opt-in channel or TRPG campaign", // description
	"Moderator, must be used from an opt-in channel or campaign channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot Ban (users)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Remove visibility of receiving channel from mentioned user
	if (moderatorIDs.includes(receivedMessage.author.id)) {
		let leavableChannelIDs = topicList.concat(Object.keys(campaignList));
		if (leavableChannelIDs.includes(receivedMessage.channel.id)) {
			receivedMessage.mentions.users.keyArray().filter(id => id != receivedMessage.client.user.id).forEach(id => {
				receivedMessage.channel.createOverwrite(id, { VIEW_CHANNEL: false }, `Banned by ${receivedMessage.author.tag}`);
			})
		} else {
			receivedMessage.author.send(`Please use the \`ban\` command from a topic or campaign channel.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Banning users from text channels is restricted to Moderators.`)
			.catch(console.error);
	}
}

module.exports = command;
