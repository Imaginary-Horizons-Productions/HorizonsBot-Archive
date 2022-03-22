const Button = require('../../Classes/Button.js');
const { getClubs, setClubReminder, updateClubDetails, updateClub, cancelClubEvent, scheduleClubEvent, clearClubReminder, createClubEvent } = require('../../helpers.js');

module.exports = new Button("confirmnextmeeting");

module.exports.execute = (interaction, [timestamp]) => {
	// Join the topic or club channel specified in args
	let club = getClubs()[interaction.channelId];
	if (club) {
		club.timeslot.nextMeeting = Number(timestamp);
		clearClubReminder(club.id);
		cancelClubEvent(club.voiceChannelID, club.timeslot.eventId, interaction.guild.scheduledEvents);
		setClubReminder(club, interaction.guild.channels);
		createClubEvent(club, interaction.guild);
		if (club.timeslot.periodCount && club.userIDs.length < club.seats) {
			scheduleClubEvent(club, interaction.guild);
		}
		updateClubDetails(club, interaction.channel);
		updateClub(club, interaction.guild.channels);
		interaction.update({ components: [] });
		interaction.channel.send(`This club's next meeting has been set as <t:${timestamp}:F>.`);
	} else {
		interaction.reply({ content: "Please set club meeting times from the club channel.", ephemeral: true });
	}
}
