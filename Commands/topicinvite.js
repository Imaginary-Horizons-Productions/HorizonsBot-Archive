const Command = require('../Classes/Command.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { getTopicIDs } = require('../helpers.js');

module.exports = new Command("topic-invite", "Invite users to this topic");

module.exports.data.addUserOption(option => option.setName("invitee").setDescription("The user to invite (copy-paste from another channel)").setRequired(true))
	.addChannelOption(option => option.setName("channel").setDescription("The topic channel to invite to").setRequired(true));

module.exports.execute = (interaction) => {
	// Invite users to the given topic
	var channel = interaction.options.getChannel("channel");
	if (getTopicIDs().includes(channel.id)) {
		var invitee = interaction.options.getUser("invitee");
		let embed = new MessageEmbed()
			.setAuthor("Click here to visit the Imaginary Horizons Patreon", interaction.client.user.displayAvatarURL(), "https://www.patreon.com/imaginaryhorizonsproductions")
			.setDescription(`${invitee} has invited you to the following opt-in channel on Imaginary Horizons.`)
			.addField(channel.name, `${channel.topic ? channel.topic : "Description not yet set"}`);
		if (!invitee.bot) {
			var joinButton = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`join-${channel.id}`)
						.setLabel(`Join ${channel.name}`)
						.setStyle("SUCCESS")
				);
			invitee.send({ embeds: [embed], components: [joinButton] }).then(message => {
				interaction.reply({ content: "An invite has been sent!", ephemeral: true });
			}).catch(console.error);
		} else {
			interaction.reply({ content: "If you would like to add a bot to a topic, speak with a moderator.", ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `The mentioned channel doesn't seem to be a topic channel.`, ephemeral: true })
			.catch(console.error);
	}
}
