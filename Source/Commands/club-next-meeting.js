const { MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../Classes/Command.js');
const { getClubs, isModerator, timeConversion } = require('../../helpers.js');

const options = [
	{ type: "Number", name: "days-from-now", description: "86400 seconds", required: false, choices: [] },
	{ type: "Number", name: "hours-from-now", description: "3600 seconds", required: false, choices: [] },
	{ type: "Number", name: "minutes-from-now", description: "60 seconds", required: false, choices: [] }
];
const subcommands = [];
module.exports = new Command("club-next-meeting", "(club leader or morderator) Set the club's next meeting", options, subcommands);

module.exports.execute = (interaction) => {
	// Set the club's next meeting
	let club = getClubs()[interaction.channelId];
	if (club) {
		if (isModerator(interaction.user.id) || interaction.user.id == club.hostId) {
			let days = interaction.options.getNumber("days-from-now") ?? 0;
			let hours = interaction.options.getNumber("hours-from-now") ?? 0;
			let minutes = interaction.options.getNumber("minutes-from-now") ?? 0;
			let now = new Date;
			let nowInSeconds = timeConversion(now.getTime() - now.getMilliseconds(), "ms", "s");
			let timestamp = nowInSeconds;
			timestamp += timeConversion(days, "d", "s");
			timestamp += timeConversion(hours, "h", "s");
			timestamp += timeConversion(minutes, "m", "s");
			timestamp = Math.round(timestamp);
			if (nowInSeconds < timestamp) {
				let confirmUI = [new MessageActionRow().addComponents(
					new MessageButton().setCustomId(`confirmnextmeeting-${timestamp}`)
						.setLabel("Confirm")
						.setStyle("PRIMARY")
				)]
				interaction.reply({ content: `${days} days, ${hours} hours, and ${minutes} minutes from now is:\n<t:${timestamp}:F>\n\nIs this the correct time?`, components: confirmUI, ephemeral: true });
			} else {
				interaction.reply({ content: "The provided time is in the past.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: `Configuring club settings is restricted to the club leader and Moderators.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: "Please set club meeting times from the club's channel.", ephemeral: true });
	}
}
