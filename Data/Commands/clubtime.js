const Command = require('../../Classes/Command.js');
const { getClubs, clubCountdown } = require('../../helpers.js');

module.exports = new Command("club-time", "Calculates the time until the club's next meeting"); // (name, description)

module.exports.execute = (interaction) => {
	// Calculate the time until the next meeting of the given club
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (club.timeslot[0] !== null) {
			clubCountdown(interaction, interaction.channel.id);
		} else {
			interaction.reply({ content: "This club doesn't appear to have set a meeting time yet.", ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please check club meeting time from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}
