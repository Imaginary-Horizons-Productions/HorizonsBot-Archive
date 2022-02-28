const Command = require('../../Classes/Command.js');

// can't use channel mention because users can't mention channels that are invisible to them (even by constructing the mention manually)
let options = [
	{ type: "String", name: "channel", description: "The name (or id) of the topic or club to join", required: true, choices: {} },
];
module.exports = new Command("join", "Join a topic or club", options);

let joinChannel, findTopicID;
module.exports.initialize = function (helpers) {
	({ joinChannel, findTopicID } = helpers);
}

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
