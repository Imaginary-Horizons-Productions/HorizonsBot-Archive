const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command("club-set-description", "Set a club's description");

command.data.addStringOption(option => option.setName("description").setDescription("The text to set as the club description").setRequired(true));

command.execute = (interaction) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || interaction.user.id == club.hostID) {
			club.description = interaction.options.getString("description");
			interaction.channel.setTopic(club.description);
			updateClub(club, interaction.guild.channels);
			interaction.reply({ content: "The club's description has been updated.", ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Setting a club description is restricted to the host of that club or Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please set club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
