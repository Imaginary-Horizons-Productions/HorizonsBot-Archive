const Command = require('../Classes/Command.js');
const { customEmbeds, isModerator } = require('../helpers.js');

var command = new Command("embed-set-title", "Assign a custom embed's title");

command.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true))
	.addStringOption(option => option.setName("title").setDescription("The text to set in the title field").setRequired(true));

command.execute = (interaction) => {
	// Set the title for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("messageid");
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

module.exports = command;
