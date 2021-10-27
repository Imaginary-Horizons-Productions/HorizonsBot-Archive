const Command = require('../../Classes/Command.js');
const { customEmbeds, isModerator, saveObject } = require('../../helpers.js');

module.exports = new Command("embed-abandon", "(moderator) Stop managing the given embed(s)");

module.exports.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true));

module.exports.execute = (interaction) => {
	// Stop managing the given embed(s)
	if (isModerator(interaction.user.id)) {
		var messageId = interaction.options.getString("messageid");
		if (customEmbeds[messageId]) {
			delete customEmbeds[messageId];
			saveObject(customEmbeds, "embedsList.json");
			interaction.reply({ content: `The provided embed has been abandoned.`, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `The embed you provided for a \`${interaction.commandName}\` command could not be found.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `You must be a Moderator to use the \`${interaction.commandName}\` command.`, ephemeral: true })
			.catch(console.error);
	}
}
