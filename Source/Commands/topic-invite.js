const Command = require('../../Classes/Command.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { getTopicIDs, embedTemplateBuilder } = require('../../helpers.js');

const options = [
	{ type: "User", name: "invitee", description: "The user to invite (copy-paste from another channel)", required: true, choices: [] },
	{ type: "Channel", name: "channel", description: "The topic channel", required: true, choices: [] }
];
const subcomands = [];
module.exports = new Command("topic-invite", "Invite a user to a topic", options, subcomands);

module.exports.execute = (interaction) => {
	// Invite users to the given topic
	let channel = interaction.options.getChannel("channel");
	if (getTopicIDs().includes(channel.id)) {
		let invitee = interaction.options.getUser("invitee");
		let embed = embedTemplateBuilder()
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
