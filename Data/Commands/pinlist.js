const Command = require('../../Classes/Command.js');
const { isModerator, pinTopicsList, pinClubsList } = require('../../helpers.js');

module.exports = new Command("pin-list", "Pin the list message for topics or clubs in this channel");

module.exports.data.addStringOption(option => option.setName("listtype").setDescription(`Pin the list message for topics or clubs in this channel`).setRequired(true).addChoice("Pin the topic list", "topic").addChoice("Pin the club list", "club"));

module.exports.execute = (interaction) => {
	// Pin the list message for topics or clubs to the receiving channel
	if (isModerator(interaction.user.id)) {
		let listType = interaction.options.getString("listtype").toLowerCase();
		if (listType == "topic") {
			pinTopicsList(interaction.guild.channels, interaction.channel);
			interaction.reply({ content: "Pinning the topic list succeded.", ephemeral: true })
				.catch(console.error);
		} else if (listType == "club") {
			pinClubsList(interaction.guild.channels, interaction.channel);
			interaction.reply({ content: "Pinning the club list succeded.", ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Please specify either \`topic\` or \`club\` for the type of list to pin.`, ephemeral: true })
				.catch(console.log);
		}
	} else {
		interaction.reply({ content: `Pinning topic or club lists is restricted to Moderators.`, ephemeral: true })
			.catch(console.log);
	}
}
