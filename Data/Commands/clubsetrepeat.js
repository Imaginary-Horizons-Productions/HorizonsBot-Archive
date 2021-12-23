const Command = require('../../Classes/Command.js');
const { getClubs, updateClub } = require('../../helpers.js');

module.exports = new Command("club-set-repeat", "Set how frequently club meetings repeat, this will set the next meetings automatically"); // (name, description)

module.exports.data.addIntegerOption(option => option.setName("count").setDescription("The number of units between meetings").setRequired(true))
	.addStringOption(option => option.setName("time-unit").setDescription("The amount of time each unit represents").setRequired(true)
		.addChoices([["weeks", "w"], ["days", "d"]]))

module.exports.execute = (interaction) => {
	// Set the reminder period for the given club
	let club = getClubs()[interaction.channelId];
	if (club) {
		let count = interaction.options.getInteger("count");
		if (count > -1) {
			club.timeslot.periodCount = count;
			let units = interaction.options.getString("time-unit");
			club.timeslot.periodUnits = units;
			updateClub(club, interaction.guild.channels);
			interaction.reply(count !== 0 ? `This club has been set to repeat meetings every ${count} ${units === "w" ? "week" : "day"}(s).` : "Repeating meetings have been canceled for this club.");
		} else {
			interaction.reply({ content: "Please choose a positive non-zero number for count.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please set club meeting repetition in the club's channel.", ephemeral: true });
	}
}
