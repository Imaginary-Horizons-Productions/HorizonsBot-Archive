const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command("club-set-timeslot", "Set a club's timeslot");

command.data.addStringOption(option => option.setName("timeslot").setDescription("The text to set for the club timeslot").setRequired(true));

command.execute = (interaction) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || (club && interaction.user.id == club.hostID)) {
			club.timeslot = interaction.options.getString("timeslot");
			updateClub(club, interaction.guild.channels);
			interaction.reply({ content: `${club.title}'s time slot has been set as ${club.timeslot}.`, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Setting a club time slot is restricted to the host of that club or Moderators from that club channel.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please set club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
