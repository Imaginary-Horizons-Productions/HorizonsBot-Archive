const { MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../Classes/Command.js');
const { getManagedChannels, getClubs, updateList, updateClub } = require('../../helpers.js');

const options = [];
const subcomands = [];
module.exports = new Command("leave", "Leave a topic or club", options, subcomands);

module.exports.execute = (interaction) => {
	const { user: { id: userId }, channelId } = interaction;
	if (getManagedChannels().includes(channelId)) {
		let club = getClubs()[channelId];
		if (club) {
			if (userId == club.hostId) {
				var buttonsRow = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`delete-${channelId}`)
							.setLabel("Leave")
							.setStyle("DANGER"),
					);
				interaction.reply({ content: "If a club's host leaves, the club will be deleted. Really leave?", components: [buttonsRow], ephemeral: true })
					.catch(console.error);
			} else {
				club.userIds = club.userIds.filter(id => id != userId);
				interaction.channel.permissionOverwrites.delete(interaction.user, "HorizonsBot leave used")
					.catch(console.error);
				interaction.guild.channels.resolve(club.voiceChannelId).permissionOverwrites.delete(interaction.user, "HorizonsBot leave used")
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
		interaction.reply(`Could not find a topic or club channel associated with ${channelId}.`)
			.catch(console.error);
	}
}
