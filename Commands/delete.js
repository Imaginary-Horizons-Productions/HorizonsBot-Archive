const Command = require('../Classes/Command.js');
const { isModerator, getManagedChannels } = require('../helpers.js');

module.exports = new Command("delete", "Delete a topic or club channel, delay supported");

module.exports.data.addIntegerOption(option => option.setName("delay").setDescription("Number of hours to delay deleting the channel").setRequired(false));

module.exports.execute = (interaction) => {
	// Delete a topic or club channel, or set it to be deleted on a delay
	if (isModerator(interaction.user.id)) {
		if (getManagedChannels().includes(interaction.channel.id)) {
			let delay = parseFloat(interaction.options.getInteger("delay"));
			if (!isNaN(delay)) {
				interaction.reply(`This channel has been scheduled to be deleted in ${delay} hour(s).`)
					.catch(console.error);
				setTimeout(() => {
					interaction.channel.delete()
						.catch(console.error);
				}, delay * 3600000)
			} else {
				interaction.channel.delete()
					.catch(console.error);
			}
		} else {
			interaction.reply({ content: "The delete command can only be used on topic or club channels.", ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: "Deleting channels is restricted to Moderators.", ephemeral: true })
			.catch(console.error);
	}
}
