const Command = require('../Classes/Command.js');
const { isModerator, getManagedChannels } = require('../helpers.js');

var command = new Command(["Ban"], // aliases
	"Ban mentioned users from a topic or club channel", // description
	"Moderator, must be used from an opt-in channel or club channel", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot Ban (users)`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Remove visibility of receiving channel from mentioned user
	if (isModerator(receivedMessage.author.id)) {
		if (getManagedChannels().includes(receivedMessage.channel.id)) {
			receivedMessage.mentions.users.map(user => user.id).filter(id => id != receivedMessage.client.user.id).forEach(id => {
				receivedMessage.channel.permissionOverwrites.create(id, { VIEW_CHANNEL: false }, `Banned by ${receivedMessage.author.tag}`);
			})
		} else {
			receivedMessage.author.send(`Please use the \`ban\` command from a topic or club channel.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`Banning users from text channels is restricted to Moderators.`)
			.catch(console.error);
	}
}

module.exports = command;
