const Command = require('../Classes/Command.js');
const { addChannel, isModerator } = require('../helpers.js');

var command = new Command("topic-add", "Set up a topic");

command.data.addStringOption(option => option.setName("topicname").setDescription("The new topic").setRequired(true))

command.execute = (interaction) => {
	// Creates a new opt-in text channel for the given topic, adds it to list of topic channels
	if (isModerator(interaction.user.id)) {
		let channelName = interaction.options.getString('topicname');
		addChannel(interaction.guild, channelName).then(channel => {
			interaction.reply(`A new topic channel has been created: ${channel}`)
				.catch(console.error);
		});
	} else {
		interaction.reply(`The \`${state.command}\` command is restricted to moderators.`)
			.catch(console.error);
	}
}

module.exports = command;
