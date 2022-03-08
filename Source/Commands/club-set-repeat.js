const Command = require('../../Classes/Command.js');
const { cancelClubEvent } = require('../../helpers.js');

let options = [
	{ type: "Integer", name: "count", description: "The units of time between meetings", required: true, choices: {} },
	{
		type: "String", name: "time-unit", description: "The unit of time", required: true, choices: {
			weeks: "w",
			days: "d"
		}
	},
	{ type: "String", name: "reminder-text", description: "The reminder's text", required: false, choices: {} }
];
module.exports = new Command("club-set-repeat", "Set how frequently to send reminders about club meetings", options);

let getClubs, updateClub, updateClubDetails, clearClubReminder;
module.exports.initialize = function (helpers) {
	({ getClubs, updateClub, updateClubDetails, clearClubReminder } = helpers);
}

module.exports.execute = (interaction) => {
	// Set the reminder period for the given club
	let club = getClubs()[interaction.channelId];
	if (club) {
		let count = interaction.options.getInteger("count");
		if (count > -1) {
			club.timeslot.periodCount = count;
			let units = interaction.options.getString("time-unit");
			let message = interaction.options.getString("reminder-text");
			if (message !== undefined && message !== null) {
				club.timeslot.message = message;
				interaction.reply({ content: `The reminder message for this club has been set to the following:\n\t${message}`, ephemeral: true });
			} else {
				club.timeslot.message = "";
				interaction.reply({ content: `The reminder message for this club has been cleared.`, ephemeral: true });
			}
			club.timeslot.periodUnits = units;
			updateClub(club, interaction.guild.channels);
			updateClubDetails(club, interaction.channel);
			if (count > 0) {
				interaction.channel.send(`This club has been set to repeat meetings every ${count} ${units === "w" ? "week" : "day"}(s).`);
			} else {
				interaction.guild.scheduledEvents.delete(club.timeslot.eventId);
				club.timeslot.eventId = "";
				clearClubReminder(club.id);
				cancelClubEvent(club.voiceChannelID, club.eventId, interaction.guild.scheduledEvents);
				interaction.channel.send("Repeating meetings have been canceled for this club.");
			}
		} else {
			interaction.reply({ content: "Please choose a positive non-zero number for count.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please set club meeting repetition in the club's channel.", ephemeral: true });
	}
}
