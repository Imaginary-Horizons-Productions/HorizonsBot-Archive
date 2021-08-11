const Command = require('../Classes/Command.js');
const { Permissions } = require('discord.js');
const { addChannel } = require('../helpers.js');

var command = new Command(["TopicAdd"], // aliases
	"Set up a topic", // description
	"Permission to Manage Channels, use the command from a server channel", // requirements
	["Example - replace ( ) with your settings"], // headers
	[`@HorizonsBot TopicAdd (topic name)`]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Creates a new opt-in text channel for the given topic, adds it to list of topic channels
	if (receivedMessage.member) {
		if (receivedMessage.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			let channelName = state.messageArray.join('-');
			if (channelName === "") {
				channelName = "new-channel";
			}
			addChannel(receivedMessage.guild, channelName);
		} else {
			receivedMessage.author.send(`You need the MANAGE_CHANNELS permission to use the \`${state.command}\` command.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send("Please use `topicadd` from a server channel.")
			.catch(console.error);
	}
}

module.exports = command;
