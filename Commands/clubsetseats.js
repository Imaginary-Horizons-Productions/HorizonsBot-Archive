const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command("club-set-seats", "Set a club's max number of members");

command.data.addIntegerOption(option => option.setName("seats").setDescription("The maximum number of members for the club").setRequired(true));

command.execute = (interaction) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || interaction.user.id == club.hostID) {
			club.seats = interaction.options.getInteger("seats");
			updateClub(club, interaction.guild.channels);
			interaction.reply({ content: `${club.title}'s max member count has been set as ${club.seats}.`, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Setting a club max member count is restricted to the host of that club or Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please set club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
