const Command = require('../Classes/Command.js');
const { guildID, customEmbeds, isModerator } = require('../helpers.js');

var command = new Command("embed-set-image", "Assign an custom embed's image");

command.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true))
	.addStringOption(option => option.setName("url").setDescription("The url to a picture for the image field").setRequired(true));

command.execute = (interaction) => {
	// Set the image for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("messageid");
		if (customEmbeds[messageID]) {
			let url = interaction.options.getString("url");
			if (url.startsWith("https://") || url.startsWith("http://")) {
				interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
					let embed = message.embeds[0].setImage(url).setTimestamp();
					message.edit({ embeds: [embed] });
					interaction.reply({ content: `The embed's image has been updated. Link: ${message.url}`, ephemeral: true });
				}).catch(console.error);
			} else {
				interaction.reply({ content: `The image url must begin with "http".`, ephemeral: true })
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

module.exports = command;
