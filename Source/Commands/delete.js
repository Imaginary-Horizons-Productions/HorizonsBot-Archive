const Command = require('../../Classes/Command.js');

const options = [{ type: "Integer", name: "delay", description: "Number of hours to delay deleting the channel", required: true, choices: {} }];
const subcomands = [];
module.exports = new Command("delete", "(moderator) Delete a topic or club on a delay", options, subcomands);

let isModerator, getManagedChannels;
module.exports.initialize = function (helpers) {
	({ isModerator, getManagedChannels } = helpers);
}

module.exports.execute = (interaction) => {
	// Delete a topic or club channel, or set it to be deleted on a delay
	if (isModerator(interaction.user.id)) {
		if (getManagedChannels().includes(interaction.channelId)) {
			let delay = parseFloat(interaction.options.getInteger("delay"));
			interaction.reply(`This channel has been scheduled to be deleted in ${delay} hour(s).`)
				.catch(console.error);
			setTimeout(() => {
				interaction.channel.delete()
					.catch(console.error);
			}, delay * 3600000);
		} else {
			interaction.reply({ content: "The delete command can only be used on topic or club channels.", ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: "Deleting channels is restricted to Moderators.", ephemeral: true })
			.catch(console.error);
	}
}
