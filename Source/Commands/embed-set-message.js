const Command = require('../../Classes/Command.js');

let options = [
	{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
	{ type: "String", name: "text", description: "The text to put in the message (above the embed)", required: true, choices: {} }
];
module.exports = new Command("embed-set-message", "(moderator) Set a custom embed's message content", options);

let customEmbeds, isModerator;
module.exports.initialize = function (helpers) {
	({ customEmbeds, isModerator } = helpers);
}

module.exports.execute = (interaction) => {
	// Set the message for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("message-id");
		if (customEmbeds[messageID]) {
			interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
				message.edit({ content: interaction.options.getString("text") });
				interaction.reply({ content: `The embed's message has been updated. Link: ${message.url}`, ephemeral: true })
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