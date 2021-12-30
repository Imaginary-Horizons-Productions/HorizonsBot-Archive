const Button = require('../../Classes/Button.js');
const { getClubs, setClubReminderTimeout, updateClubDetails, updateClub } = require('../../helpers.js');

module.exports = new Button("confirmnextmeeting");

module.exports.execute = (interaction, [timestamp]) => {
	// Join the topic or club channel specified in args
	let club = getClubs()[interaction.channelId];
	if (club) {
		club.timeslot.nextMeeting = timestamp;
		setClubReminderTimeout(club, interaction.guild.channels);
		updateClubDetails(club, interaction.channel);
		updateClub(club, interaction.guild.channels);
		interaction.reply(`This club's next meeting has been set as <t:${timestamp}>.`);
	} else {
		interaction.reply("Please set club meeting times from the club channel.");
	}
}
