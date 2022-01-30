const Command = require('../../Classes/Command.js');

let options = [
	{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
	{ type: "String", name: "title", description: "The text to set in the title field", required: true, choices: {} }
];
module.exports = new Command("embed-set-title", "(moderator) Assign a custom embed's title", options);

let customEmbeds, isModerator;
module.exports.initialize = function (helpers) {
	({ customEmbeds, isModerator } = helpers);
}

module.exports.execute = (interaction) => {
	// Set the title for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("message-id");
		if (customEmbeds[messageID]) {
			let title = interaction.options.getString("title");
			interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
				let embed = message.embeds[0].setTitle(title).setTimestamp();
				message.edit({ embeds: [embed] });
				interaction.reply({ content: `The embed's title has been updated. Link: ${message.url}`, ephemeral: true })
			})
		} else {
			interaction.reply({ content: `The embed you provided for a \`${interaction.commandName}\` command could not be found.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `You must be a Moderator to use the \`${interaction.commandName}\` command.`, ephemeral: true })
			.catch(console.error);
	}
}
