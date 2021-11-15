const Command = require('../../Classes/Command.js');
const { updateClub, getClubs, isModerator } = require('../../helpers.js');

module.exports = new Command("club-skip", "(club leader or moderator) Set a number of weeks to skip club reminders"); // (name, description)

module.exports.data
	.addIntegerOption(option => option.setName("weeks").setDescription("The number of weeks to skip reminders").setRequired(true));

module.exports.execute = (interaction) => {
	// Receive an integer and pause club reminders for that many weeks
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || (club && interaction.user.id == club.hostID)) {
			let weeksInput = interaction.options.getInteger("weeks");
			if (weeksInput > -1) {
				club.timeslot.skip = weeksInput;
				interaction.reply(`Club reminders will be skipped for ${weeksInput} weeks.`);
				updateClub(club, interaction.guild.channels);
			} else {
				interaction.reply({ content: "Please set a positive number of weeks to skip club reminders.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: `Pausing club reminders is restricted to the host of that club or Moderators from that club channel.`, ephemeral: true });
		}
	} else {
		interaction.reply({ content: `Please pause club reminders from the club channel.`, ephemeral: true });
	}
}
