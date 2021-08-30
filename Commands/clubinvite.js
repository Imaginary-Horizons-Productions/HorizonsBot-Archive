const Command = require('../Classes/Command.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { getClubs } = require('../helpers.js');

var command = new Command("club-invite", "Send the user (default: self) an invite to the club by channel mention, or by sending from club");

command.data.addStringOption(option => option.setName("clubid").setDescription("The club to provide details on").setRequired(false))
	.addUserOption(option => option.setName("invitee").setDescription("The user to invite to the club").setRequired(false));

command.execute = (interaction) => {
	// Provide full details on the given club
	let clubId = interaction.options.getString("clubid") || interaction.channel.id;
	let club = getClubs()[clubId];
	let recipient = interaction.options.getUser("invitee");
	if (club) {
		if (!recipient) {
			recipient = interaction.user;
		}
		if (!recipient.bot) {
			let embed = new MessageEmbed()
				.setAuthor("Click here to visit the Imaginary Horizons Patreon", interaction.client.user.displayAvatarURL(), "https://www.patreon.com/imaginaryhorizonsproductions")
				.setTitle(`__**${club.title}**__ (${club.userIDs.length}${club.seats != 0 ? `/${club.seats}` : ""} Members)`)
				.setDescription(club.description)
				.addField("Club Host", `<@${club.hostID}>`)
				.addField("Game", club.system)
				.addField("Time Slot", club.timeslot)
				.setImage(club.imageURL);
			if (recipient.id === club.hostID || club.userIDs.includes(recipient.id)) {
				interaction.reply({ content: "Here is a preview of your club's info sheet. When sent to server members not in the club already, it'll also include an option to join.", embeds: [embed], ephemeral })
					.catch(console.error);
			} else {
				var joinButton = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`join-${clubId}`)
							.setLabel(`Join ${club.title}`)
							.setStyle("SUCCESS")
					);
				recipient.send({ embeds: [embed], components: [joinButton] }).then(message => {
					interaction.reply({ content: "Club details have been sent.", ephemeral: true });
				}).catch(console.error);
			}
		}
	} else {
		interaction.reply({ content: `The club you indicated could not be found. Please check for typos!`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
