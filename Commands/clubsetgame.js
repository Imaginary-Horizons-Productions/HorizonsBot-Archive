const Command = require('../Classes/Command.js');
const { isModerator, getClubs, updateClub } = require("../helpers.js");

var command = new Command("club-set-game", "Set the name a club's game");

command.data.addStringOption(option => option.setName("game").setDescription("The text to set as the club game").setRequired(true));

command.execute = (interaction) => {
	// Set the decription for the receiving club channel
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || interaction.user.id == club.hostID) {
			club.system = interaction.options.getString("game");
			updateClub(club, interaction.guild.channels);
			interaction.reply({ content: `${club.title}'s game has been set as ${club.system}.`, ephemeral: true })
				.catch(console.error);
		} else {
			interaction.reply({ content: `Setting a club game is restricted to the host of that club or Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please set club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
