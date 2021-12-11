const Command = require('../../Classes/Command.js');
const { DAYS, HOURS, getClubs, isModerator, timeSlotToString, updateClub, TIMEZONES, updateClubDetails, setClubReminderTimeout } = require('../../helpers.js');

module.exports = new Command("club-set-timeslot", "(club leader or moderator) Set a meeting time; a reminder will be sent a day before");

module.exports.data
	.addIntegerOption(option => option.setName("day").setDescription("The day of the week").setRequired(false)
		.addChoices(DAYS.map((day, i) => [day, i])))
	.addIntegerOption(option => option.setName("hour").setDescription("The hour of the meeting").setRequired(false)
		.addChoices(HOURS.map((hour, i) => [hour, i])))
	.addIntegerOption(option => option.setName("timezone").setDescription("The timezone of the meeting time").setRequired(false)
		.addChoices(TIMEZONES.map((timezone, i) => [timezone, i - 11]))) // subtracting 11 converts index to timezone offset
	.addStringOption(option => option.setName("remindertext").setDescription("The text to post with the reminder").setRequired(false))
	.addIntegerOption(option => option.setName("delayweeks").setDescription("How many (non-negative) weeks to wait before starting reminders (default: 0)").setRequired(false));

module.exports.execute = (interaction) => {
	// Receive a day of the week and hour (in server time) from the user, store to allow ready checks
	let club = getClubs()[interaction.channel.id];
	if (club) {
		if (isModerator(interaction.user.id) || (club && interaction.user.id == club.hostID)) {
			let incorrectInputs = [];
			// reference on ?? --> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
			let dayInput = interaction.options.getInteger("day") ?? incorrectInputs.push("day");
			let hourInput = interaction.options.getInteger("hour") ?? incorrectInputs.push("hour");
			let timezoneInput = interaction.options.getInteger("timezone") ?? incorrectInputs.push("time zone");
			let messageInput = interaction.options.getString("remindertext") ?? "";
			let breakInput = interaction.options.getInteger("delayweeks") ?? 0;

			if (breakInput < 0) {
				incorrectInputs.push("delay weeks");
			}

			if (!incorrectInputs.length) {
				club.timeslot = {
					day: dayInput,
					hour: hourInput,
					timezone: timezoneInput,
					message: messageInput,
					break: breakInput
				};
				interaction.reply(`The timeslot for this club has been set for **${timeSlotToString(club.timeslot)}**.`);
			} else if (incorrectInputs.length === 3 && !messageInput && breakInput === 0) {
				club.timeslot = {
					day: null,
					hour: null,
					timezone: null,
					message: "",
					break: 0
				};
				interaction.reply({ content: "The club's time slot has been cleared.", ephemeral: true });
			} else {
				interaction.reply({ content: `Your timeslot could not be set. The following values were missing or invalid: *${incorrectInputs.join(", ")}*`, ephemeral: true });
			}

			setClubReminderTimeout(club, interaction.guild.channels);
			updateClubDetails(club, interaction.channel);
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
