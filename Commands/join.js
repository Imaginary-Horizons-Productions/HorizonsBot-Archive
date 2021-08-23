const Command = require('../Classes/Command.js');
const { guildID, joinChannel, findTopicID } = require('../helpers.js');

var command = new Command(["Join"], // aliases
	"Join one or many opt-in channels or club", // description
	"N/A", // requirements
	["Example - replace ( ) with your settings"], // headings
	[`@HorizonsBot Join (channel names or IDs)`]); // texts (must match number of headings)

command.data.addStringOption(option => option.setName("channel").setDescription("The name (or ID) of the topic or club to join").setRequired(true));
// can't use channel mention because users can't mention channels that are invisible to them (even by constructing the mention manually)

command.execute = (receivedMessage, state) => {
	// Determine if user mentioned a topic or club, then provide appropriate permissions
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

command.executeInteraction = (interaction) => {
	// Determine if user mentioned a topic or club, then provide appropriate permissions
	interaction.client.guilds.fetch(guildID).then(guild => {
		var channelName = interaction.options.getString("channel");
		if (isNaN(parseInt(channelName))) {
			let channelID = findTopicID(channelName.toLowerCase());
			if (channelID) {
				let channel = guild.channels.resolve(channelID);
				joinChannel(channel, interaction.user);
				interaction.reply({ content: "Channel joined!", ephemeral: true });
			}
		} else {
			let channel = guild.channels.resolve(channelName);
			joinChannel(channel, interaction.user);
			interaction.reply({ content: "Channel joined!", ephemeral: true });
		}
	});
}

module.exports = command;
