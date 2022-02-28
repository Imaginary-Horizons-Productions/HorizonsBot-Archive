const Command = require('../../Classes/Command.js');

let options = [
	{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
	{ type: "String", name: "header", description: "The header text", required: true, choices: {} },
	{ type: "String", name: "text", description: "The body text", required: true, choices: {} },
	{ type: "Boolean", name: "inline", description: "Whether to show the field in-line with previous embed fields", required: false, choices: {} }
];
module.exports = new Command("embed-add-field", "(moderator) Add a custom embed field", options);

let customEmbeds, isModerator;
module.exports.initialize = function (helpers) {
	({ customEmbeds, isModerator } = helpers);
}

module.exports.execute = (interaction) => {
	// Add a field to the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("message-id");
		if (customEmbeds[messageID]) {
			let inline = interaction.options.getBoolean("inline");
			let header = interaction.options.getString("header");
			let text = interaction.options.getString("text");
			interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
				let embed = message.embeds[0].addField(header, text, inline).setTimestamp();
				message.edit({ embeds: [embed] });
				interaction.reply({ content: `A field has been added to the embed. Link: ${message.url}`, ephemeral: true })
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
