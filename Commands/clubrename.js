const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command("club-rename", "Rename a club's channels");

command.data.addStringOption(option => option.setName("name").setDescription("The new name for the club").setRequired(true));

command.execute = (interaction) => {
	// Rename the text voice channels associated with receiving channel
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || interaction.user.id == club.hostID) {
			club.title = interaction.options.getString("name");
			interaction.channel.setName(club.title);
			interaction.guild.channels.resolve(club.voiceChannelID).setName(club.title + " Voice");
			updateClub(club, interaction.guild.channels);
			interaction.reply({ content: "Club name has been updated.", ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Renaming a club is restricted to the club's host or Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please set club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
