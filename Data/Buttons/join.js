const Button = require('../../Classes/Button.js');
const { guildId, joinChannel } = require('../../helpers.js');

module.exports = new Button("join");

module.exports.execute = (interaction, [channelId]) => {
	// Join the topic or club channel specified in args
	interaction.client.guilds.fetch(guildId).then(guild => {
		guild.channels.fetch(channelId).then(channel => {
			joinChannel(channel, interaction.user);
			interaction.message.edit({ components: [] });
			interaction.reply(`You have joined ${channel}!`);
		})
	})
}
