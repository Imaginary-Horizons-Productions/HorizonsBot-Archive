const Command = require('../Classes/Command.js');
const { joinChannel, getTopicNames, findTopicID, checkPetition } = require('../helpers.js');

var command = new Command("petition", "Petition for a topic");

command.data.addStringOption(option => option.setName("topicname").setDescription("The topic channel to petition for").setRequired(true));

command.execute = (interaction) => {
	// Record a user's petition for a text channel, create channel if sufficient number of petitions
	let topicName = interaction.options.getString("topicname").toLowerCase();
	if (getTopicNames().includes(topicName)) {
		let channelID = findTopicID(topicName);
		joinChannel(interaction.guild.channels.resolve(channelID), interaction.user);
		interaction.reply({ content: `A channel for ${topicName} already exists, you've been added to that channel.`, ephemeral: true })
			.catch(console.error);
	} else {
		checkPetition(interaction.guild, topicName, interaction.user);
		interaction.reply({ content: "Petition recorded!", ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
