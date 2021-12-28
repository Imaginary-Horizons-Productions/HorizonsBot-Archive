const Command = require('../../Classes/Command.js');
const { isModerator, addTopicChannel } = require('../../helpers.js');

let options = [
	{ type: "String", name: "topic-name", description: "The new topic", required: true, choices: {} },
];
module.exports = new Command("topic-add", "(moderator) Set up a topic", options);

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
