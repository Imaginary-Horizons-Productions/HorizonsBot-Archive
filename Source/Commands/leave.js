const { MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../Classes/Command.js');

const options = [];
const subcomands = [];
module.exports = new Command("leave", "Leave a topic or club", options, subcomands);

let getManagedChannels, getClubs, updateList, updateClub;
module.exports.initialize = function (helpers) {
	({ getManagedChannels, getClubs, updateList, updateClub } = helpers);
}

module.exports.execute = (interaction) => {
	let userID = interaction.user.id;
	var channelID = interaction.channelId;
	if (getManagedChannels().includes(channelID)) {
		let club = getClubs()[channelID];
		if (club) {
			if (userID == club.hostID) {
				var buttonsRow = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`delete-${channelID}`)
							.setLabel("Leave")
							.setStyle("DANGER"),
					);
				interaction.reply({ content: "If a club's host leaves, the club will be deleted. Really leave?", components: [buttonsRow], ephemeral: true })
					.catch(console.error);
			} else {
				club.userIDs = club.userIDs.filter(id => id != userID);
				interaction.channel.permissionOverwrites.delete(interaction.user, "HorizonsBot leave used")
					.catch(console.error);
				interaction.guild.channels.resolve(club.voiceChannelID).permissionOverwrites.delete(interaction.user, "HorizonsBot leave used")
					.catch(console.error);
				updateList(interaction.guild.channels, "clubs");
				updateClub(club);
				interaction.reply(`${interaction.user} has left this channel.`)
					.catch(console.error);
			}
		} else {
			interaction.channel.permissionOverwrites.delete(interaction.user, "HorizonsBot leave used")
				.catch(console.error);
			interaction.reply(`${interaction.user} has left this channel.`)
				.catch(console.error);
		}
	} else {
		interaction.reply(`Could not find a topic or club channel associated with ${channelID}.`)
			.catch(console.error);
	}
}
