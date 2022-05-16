const Command = require('../../Classes/Command.js');

const options = [
	{ type: "Integer", name: "count", description: "The units of time between meetings", required: true, choices: [] },
	{ type: "String", name: "time-unit", description: "The unit of time", required: true, choices: [{ name: "weeks", value: "w" }, { name: "days", value: "d" }] },
	{ type: "String", name: "reminder-text", description: "The reminder's text", required: false, choices: [] }
];
const subcomands = [];
module.exports = new Command("club-set-repeat", "(club leader or morderator) Set how frequently to send club meeting reminders", options, subcomands);

let getClubs, isModerator, updateList, updateClub, updateClubDetails, clearClubReminder, cancelClubEvent;
module.exports.initialize = function (helpers) {
	({ getClubs, isModerator, updateList, updateClub, updateClubDetails, clearClubReminder, cancelClubEvent } = helpers);
}

module.exports.execute = (interaction) => {
	// Set the reminder period for the given club
	let club = getClubs()[interaction.channelId];
	if (club) {
		if (isModerator(interaction.user.id) || interaction.user.id == club.hostID) {
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
				updateList(interaction.guild.channels, "clubs");
				updateClub(club);
				updateClubDetails(club, interaction.channel);
				if (count > 0) {
					interaction.channel.send(`This club has been set to repeat meetings every ${count} ${units === "w" ? "week" : "day"}(s).`);
				} else {
					interaction.guild.scheduledEvents.delete(club.timeslot.eventId);
					club.timeslot.eventId = "";
					clearClubReminder(club.channelID);
					cancelClubEvent(club.voiceChannelID, club.eventId, interaction.guild.scheduledEvents);
					interaction.channel.send("Repeating meetings have been canceled for this club.");
				}
			} else {
				interaction.reply({ content: "Please choose a positive non-zero number for count.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: `Configuring club settings is restricted to the club leader and Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: "Please set club meeting repetition in the club's channel.", ephemeral: true });
	}
}
