const Command = require('../../Classes/Command.js');

let options = [
	{
		type: "String", name: "list-type", description: "Pin the list message for topics or clubs in this channel", required: true, choices: {
			"Pin the topic list": "topic",
			"Pin the club list": "club"
		}
	}
];
module.exports = new Command("pin-list", "(moderator) Pin the list message for topics or clubs in this channel", options);

let isModerator, pinTopicsList, pinClubsList;
module.exports.initialize = function (helpers) {
	({ isModerator, pinTopicsList, pinClubsList } = helpers);
}

module.exports.execute = (interaction) => {
	// Pin the list message for topics or clubs to the receiving channel
	if (isModerator(interaction.user.id)) {
		let listType = interaction.options.getString("list-type").toLowerCase();
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
