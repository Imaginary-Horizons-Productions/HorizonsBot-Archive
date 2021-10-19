const Command = require('../../Classes/Command.js');
const { joinChannel, getTopicNames, findTopicID, checkPetition } = require('../../helpers.js');

module.exports = new Command("petition", "Petition for a topic");

module.exports.data.addStringOption(option => option.setName("topicname").setDescription("The topic channel to petition for").setRequired(true));

module.exports.execute = (interaction) => {
	// Record a user's petition for a text channel, create channel if sufficient number of petitions
	let topicName = interaction.options.getString("topicname").toLowerCase();
	if (getTopicNames().includes(topicName)) {
		let channelID = findTopicID(topicName);
		joinChannel(interaction.guild.channels.resolve(channelID), interaction.user);
		interaction.reply({ content: `A channel for ${topicName} already exists, you've been added to that channel.`, ephemeral: true })
			.catch(console.error);
	} else {
		checkPetition(interaction.guild, topicName, interaction.user);
		interaction.reply(`Your petition for **${topicName}** has been recorded!`)
			.catch(console.error);
	}
}
