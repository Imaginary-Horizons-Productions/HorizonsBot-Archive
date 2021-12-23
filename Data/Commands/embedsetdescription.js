const Command = require('../../Classes/Command.js');
const { customEmbeds, isModerator } = require('../../helpers.js');

let options = [
	{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
	{ type: "String", name: "text", description: "The text to put in the description field", required: true, choices: {} }
];
module.exports = new Command("embed-set-description", "(moderator) Assign a custom embed's description", options);

module.exports.execute = (interaction) => {
	// Set the description for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("message-id");
		if (customEmbeds[messageID]) {
			let description = interaction.options.getString("text");
			interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
				let embed = message.embeds[0].setDescription(description).setTimestamp();
				message.edit({ embeds: [embed] });
				interaction.reply({ content: `The embed's description has been updated. Link: ${message.url}`, ephemeral: true })
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
