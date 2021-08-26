const Command = require('../Classes/Command.js');
const { guildID, customEmbeds, isModerator } = require('../helpers.js');

var command = new Command("embed-set-color", "Assign a custom embed's color");

command.data.addStringOption(option => option.setName("messageid").setDescription("The ID of the embed's message").setRequired(true))
	.addStringOption(option => option.setName("color").setDescription("The hexcode of the color").setRequired(true));

command.execute = (interaction) => {
	// Set the color for the given embed
	if (isModerator(interaction.user.id)) {
		let messageID = interaction.options.getString("messageid");
		if (customEmbeds[messageID]) {
			let colorCode = interaction.options.getString("color");
			if (colorCode.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)) {
				interaction.client.guilds.fetch(guildID).then(guild => {
					guild.channels.resolve(customEmbeds[messageID]).messages.fetch(messageID).then(message => {
						let embed = message.embeds[0].setColor(colorCode).setTimestamp();
						message.edit({ embeds: [embed] });
						interaction.reply({ content: `The embed's color has been updated. Link: ${message.url}`, ephemeral: true });
					})
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

module.exports = command;
