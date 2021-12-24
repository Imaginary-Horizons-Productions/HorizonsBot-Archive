const Command = require('../../Classes/Command.js');
const { getClubs, timeConversion, updateClubDetails, updateClub, setClubReminderTimeout } = require('../../helpers.js');

let options = [{ type: "String", name: "timestamp", description: "The timestamp for the next meeting (use <t:seconds> format)", required: true, choices: {} }]
module.exports = new Command("club-next-meeting", "Set the club's next meeting by timestamp (use /timestamp to calculate)", options);

module.exports.execute = (interaction) => {
	// Set the club's next meeting
	let club = getClubs()[interaction.channelId];
	if (club) {
		let timestamp = interaction.options.getString("timestamp");
		let meetingTime = timestamp.match(/<t:(\d+)>/);
		if (meetingTime) {
			meetingTime = Number(meetingTime[1]);
			let now = new Date();
			let nowInSeconds = timeConversion(now.getTime() - now.getMilliseconds(), "ms", "s");
			if (nowInSeconds < meetingTime) {
				club.timeslot.nextMeeting = meetingTime;
				setClubReminderTimeout(club, interaction.guild.channels);
				updateClubDetails(club, interaction.channel);
				updateClub(club, interaction.guild.channels);
				interaction.reply(`The next meeting has been set as ${timestamp}.`);
			} else {
				interaction.reply({ content: "The provided timestamp is in the past.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: "Please provide the timestamp in the format `<t:seconds since Jan 1st 1970>`. /timestamp can be used calculate that.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please set club meeting times from the club's channel.", ephemeral: true });
	}
}
