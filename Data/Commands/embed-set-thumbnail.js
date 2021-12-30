const Command = require('../../Classes/Command.js');
const { customEmbeds, isModerator } = require('../../helpers.js');

let options = [
	{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
	{ type: "String", name: "url", description: "The url to a picture for the thumbnail field", required: true, choices: {} },
];
module.exports = new Command("embed-set-thumbnail", "(moderator) Assign a custom embed's thumbnail", options);

module.exports.execute = (interaction) => {
	// Set the thumbnail for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("message-id");
		if (customEmbeds[messageID]) {
			let url = interaction.options.getString("url");
			var validURL = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/, 'gi').test(url);
			if (validURL) {
				interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
					let embed = message.embeds[0].setThumbnail(url).setTimestamp();
					message.edit({ embeds: [embed] });
					interaction.reply({ content: `The embed's thumbnail has been updated. Link: ${message.url}`, ephemeral: true })
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
