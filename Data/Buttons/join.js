const Button = require('../../Classes/Button.js');
const { guildID, joinChannel } = require('../../helpers.js');

module.exports = new Button("join");

module.exports.execute = (interaction, args) => {
	// Join the topic or club channel specified in args
	interaction.client.guilds.fetch(guildID).then(guild => {
		guild.channels.fetch(args[0]).then(channel => {
			joinChannel(channel, interaction.user);
			interaction.message.edit({ components: [] });
			interaction.reply(`You have joined ${channel}!`);
		})
	})
}
