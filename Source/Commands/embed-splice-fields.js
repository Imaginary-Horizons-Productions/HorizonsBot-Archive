const Command = require('../../Classes/Command.js');

const options = [
	{ type: "String", name: "message-id", description: "The id of the embed's message", required: true, choices: {} },
	{ type: "Integer", name: "index", description: "The field number to start removing from (count starts from 0)", required: true, choices: {} },
	{ type: "String", name: "count", description: "The number of fields to remove", required: true, choices: {} }
];
const subcomands = [];
module.exports = new Command("embed-splice-fields", "(moderator) Remove fields from a custom embed (replace unsupported)", options, subcomands);

let customEmbeds, isModerator;
module.exports.initialize = function (helpers) {
	({ customEmbeds, isModerator } = helpers);
}

module.exports.execute = (interaction) => {
	// Splice fields from the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("message-id");
		if (customEmbeds[messageID]) {
			let deleteCount = interaction.options.getInteger("count");
			let index = interaction.options.getInteger("index");
			interaction.guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
				let embed = message.embeds[0].spliceFields(index, deleteCount).setTimestamp();
				message.edit({ embeds: [embed] });
				interaction.reply({ content: `The fields have been removed. Link: ${message.url}`, ephemeral: true })
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
