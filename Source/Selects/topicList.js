const Select = require('../../Classes/Select.js');
const { joinChannel } = require('../../helpers.js');

module.exports = new Select("topicList");

module.exports.execute = (interaction, args) => {
	// Join the user to the selected topic channels
	interaction.values.forEach(channelId => {
		interaction.guild.channels.fetch(channelId).then(channel => {
			joinChannel(channel, interaction.user);
		})
	})
	interaction.reply({ content: `You have joined the following topics: <#${interaction.values.join(">, <#")}>`, ephemeral: true })
		.catch(console.error);
}
