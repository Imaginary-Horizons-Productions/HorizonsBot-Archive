const Command = require('../../Classes/Command.js');
const { joinChannel, findTopicID } = require('../../helpers.js');

const options = [
	// can't use channel mention because users can't mention channels that are invisible to them (even by constructing the mention manually)
	{ type: "String", name: "channel", description: "The name/id of the topic or club to join", required: true, choices: [] },
];
const subcomands = [];
module.exports = new Command("join", "Join a topic or club", options, subcomands);

module.exports.execute = (interaction) => {
	// Determine if user mentioned a topic or club, then provide appropriate permissions
	var guild = interaction.guild;
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
}
