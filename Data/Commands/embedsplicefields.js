const Command = require('../../Classes/Command.js');
const { customEmbeds, isModerator } = require('../../helpers.js');

module.exports = new Command("embed-splice-fields", "Remove fields from a custom embed (replace unsupported)");

module.exports.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true))
	.addIntegerOption(option => option.setName("index").setDescription("The field number to start removing fields from (count starts from 0)").setRequired(true))
	.addIntegerOption(option => option.setName("count").setDescription("The number of fields to remove").setRequired(true));

module.exports.execute = (interaction) => {
	// Splice fields from the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("messageid");
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
