const Command = require('../../Classes/Command.js');

let options = [
	{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
	{ type: "String", name: "color", description: "Use hexcode format", required: true, choices: {} }
];
module.exports = new Command("embed-set-color", "(moderator) Assign a custom embed's color", options);

let customEmbeds, isModerator;
module.exports.initialize = function (helpers) {
	({ customEmbeds, isModerator } = helpers);
}

module.exports.execute = (interaction) => {
	// Set the color for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("message-id");
		if (customEmbeds[messageID]) {
			let colorCode = interaction.options.getString("color");
			if (colorCode.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)) {
				interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
					let embed = message.embeds[0].setColor(colorCode).setTimestamp();
					message.edit({ embeds: [embed] });
					interaction.reply({ content: `The embed's color has been updated. Link: ${message.url}`, ephemeral: true });
				})
			} else {
				interaction.reply({ content: `Please provide color in hex code format (#000000).`, ephemeral: true })
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
