const Command = require('../Classes/Command.js');
const { getClubs, isModerator, updateClub } = require('../helpers.js');

module.exports = new Command("club-set-timeslot", "Set a meeting time; a reminder will be sent a day before");

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = ["Midnight", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "Noon", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

module.exports.data
	.addIntegerOption(option => option.setName("day").setDescription("The day of the week").setRequired(true)
		.addChoices(DAYS.map((day, i) => [day, i])))
	.addIntegerOption(option => option.setName("hour").setDescription("The hour of the meeting in server time (US Central)").setRequired(true)
		.addChoices(HOURS.map((hour, i) => [hour, i])))
	.addStringOption(option => option.setName("remindertext").setDescription("The text to post with the reminder").setRequired(false));

module.exports.execute = (interaction) => {
	// Receive a day of the week and hour (in server time) from the user, store to allow ready checks
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || (club && interaction.user.id == club.hostID)) {
			let dayIndex = interaction.options.getInteger("day");
			let hourIndex = interaction.options.getInteger("hour");
			let timeslotArray = [dayIndex, hourIndex, interaction.options.getString("remindertext") || ""];
			club.timeslot = timeslotArray;
			interaction.reply(`The timeslot for this club has been set for **${DAYS[dayIndex]}s at ${HOURS[hourIndex]}**.`);
			updateClub(club, interaction.guild.channels);
		} else {
			interaction.reply({ content: `Setting a club time slot is restricted to the host of that club or Moderators from that club channel.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `Please set club settings from the club channel.`, ephemeral: true })
			.catch(console.error);
	}
}
