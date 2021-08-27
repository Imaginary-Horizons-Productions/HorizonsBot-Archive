const Command = require('../Classes/Command.js');
const { guildID, joinChannel, findTopicID } = require('../helpers.js');

var command = new Command("join", "Join one or many opt-in channels or club");

command.data.addStringOption(option => option.setName("channel").setDescription("The name (or ID) of the topic or club to join").setRequired(true));
// can't use channel mention because users can't mention channels that are invisible to them (even by constructing the mention manually)

command.execute = (interaction) => {
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
