const Command = require('../../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

let options = [];
module.exports = new Command("embed-create", "(moderator) Make a new MessageEmbed, configurable with other commands", options);

let isModerator, customEmbeds, saveObject;
module.exports.initialize = function (helpers) {
	({ isModerator, customEmbeds, saveObject } = helpers);
}

module.exports.execute = (interaction) => {
	// Create a new MessageEmbed
	if (interaction.guild) {
		if (isModerator(interaction.user.id)) {
			let embed = new MessageEmbed().setFooter({ text: "Custom Embed" }).setTimestamp();
			interaction.channel.send({ embeds: [embed] }).then(message => {
				customEmbeds[message.id] = message.channelId;
				saveObject(customEmbeds, "embedsList.json");
				interaction.reply({ content: "Here's your new embed.", ephemeral: true });
			}).catch(console.error);
		} else {
			interaction.reply({ content: `You must be a Moderator to use the \`${state.command}\` command.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `The \`${state.command}\` command must be used from a server channel.`, ephemeral: true })
			.catch(console.error);
	}
}