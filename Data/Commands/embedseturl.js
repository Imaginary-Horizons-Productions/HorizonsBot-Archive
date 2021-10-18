const Command = require('../../Classes/Command.js');
const { customEmbeds, isModerator } = require('../../helpers.js');

module.exports = new Command("embed-set-url", "Assign a custom embed's title url");

module.exports.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true))
	.addStringOption(option => option.setName("url").setDescription("The url to go to when clicking the title field").setRequired(true));

module.exports.execute = (interaction) => {
	// Set the title url for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("messageid");
		if (customEmbeds[messageID]) {
			let url = interaction.options.getString("url");
			var validURL = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/, 'gi').test(url);
			if (validURL) {
				interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
					let embed = message.embeds[0].setURL(url).setTimestamp();
					message.edit({ embeds: [embed] });
					interaction.reply({ content: `The embed's url has been updated. Link: ${message.url}`, ephemeral: true });
				}).catch(console.error);
			} else {
				interaction.reply({ content: `Your input for url does not appear to be a url.`, ephemeral: true })
					.catch(console.error);
			}
		} else {
			interaction.reply({ content: `The embed you provided for a \`${interaction.commandName}\` command could not be found.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `You must be a Moderator to use the \`${interaction.commandName}\` command.`, ephemeral: true })
			.catch(console.error);
	}
}