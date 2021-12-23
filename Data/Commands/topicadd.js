const Command = require('../../Classes/Command.js');
const { isModerator, addTopicChannel } = require('../../helpers.js');

module.exports = new Command("topic-add", "(moderator) Set up a topic");

module.exports.data.addStringOption(option => option.setName("topic-name").setDescription("The new topic").setRequired(true))

module.exports.execute = (interaction) => {
	// Creates a new opt-in text channel for the given topic, adds it to list of topic channels
	if (isModerator(interaction.user.id)) {
		let channelName = interaction.options.getString('topic-name');
		addTopicChannel(interaction.guild, channelName).then(channel => {
			interaction.reply(`A new topic channel has been created: ${channel}`)
				.catch(console.error);
		});
	} else {
		interaction.reply(`The \`${state.command}\` command is restricted to moderators.`)
			.catch(console.error);
	}
}
