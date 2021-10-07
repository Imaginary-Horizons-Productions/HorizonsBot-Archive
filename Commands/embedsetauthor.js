const Command = require('../Classes/Command.js');
const { customEmbeds, isModerator } = require('../helpers.js');

module.exports = new Command("embed-set-author", "Assign a custom embed's author");

module.exports.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true))
	.addStringOption(option => option.setName("text").setDescription("The text to put in the author field").setRequired(true))
	.addStringOption(option => option.setName("iconurl").setDescription("The url to the image in the author field").setRequired(false))
	.addStringOption(option => option.setName("url").setDescription("The url to open when the author field is clicked").setRequired(false))

module.exports.execute = (interaction) => {
	// Set the author for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("messageid");
		if (customEmbeds[messageID]) {
			let name = interaction.options.getString("text");
			var urlRegex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/, 'gi');
			let iconURL = interaction.options.getString("iconurl");
			var validIcon = urlRegex.test(iconURL);
			let url = interaction.options.getString("url");
			var validURL = urlRegex.test(url);
			interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
				let embed = message.embeds[0].setAuthor(name, validIcon ? iconURL : "", validURL ? url : "").setTimestamp();
				message.edit({ embeds: [embed] });
				interaction.reply({ content: `The author field has been updated. Link: ${message.url}`, ephemeral: true });
				interaction.followUp({ content: `${validIcon ? "" : "Your input for iconurl does not appear to be a url."}\n${validURL ? "" : "Your input for url does not appear to be a url."}`, ephemeral: true });
			}).catch(console.error);
		} else {
			interaction.reply({ content: `The embed you provided for a \`${interaction.commandName}\` command could not be found.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `You must be a Moderator to use the \`${interaction.commandName}\` command.`, ephemeral: true })
			.catch(console.error);
	}
}
