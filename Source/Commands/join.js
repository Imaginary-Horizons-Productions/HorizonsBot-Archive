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
	const { options, guild, user } = interaction;
	let channelCredential = options.getString("channel");
	if (isNaN(parseInt(channelCredential))) {
		channelCredential = findTopicID(channelCredential.toLowerCase());
	}
	if (channelCredential) {
		guild.channels.fetch(channelCredential).then(channel => {
			joinChannel(channel, user);
		})
		interaction.reply({ content: "Channel joined!", ephemeral: true });
	} else {
		interaction.reply({ content: `Could not find a topic with an id or name of **${channelCredential}**.`, ephemeral: true });
	}
}
