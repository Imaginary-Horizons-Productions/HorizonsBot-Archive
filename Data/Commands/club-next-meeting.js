const { MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../Classes/Command.js');

let options = [
	{ type: "Number", name: "days-from-now", description: "How many days from now for the next meeting", required: false, choices: {} },
	{ type: "Number", name: "hours-from-now", description: "How many hours from now for the next meeting", required: false, choices: {} },
	{ type: "Number", name: "minutes-from-now", description: "How many minutes from now for the next meeting", required: false, choices: {} },
	{ type: "Number", name: "seconds-from-now", description: "How many seconds from now for the next meeting", required: false, choices: {} },
];
module.exports = new Command("club-next-meeting", "Set the club's next meeting", options);

let getClubs, timeConversion;
module.exports.initialize = function (helpers) {
	({ getClubs, timeConversion } = helpers);
}

module.exports.execute = (interaction) => {
	// Set the club's next meeting
	let club = getClubs()[interaction.channelId];
	if (club) {
		let days = interaction.options.getNumber("days-from-now") ?? 0;
		let hours = interaction.options.getNumber("hours-from-now") ?? 0;
		let minutes = interaction.options.getNumber("minutes-from-now") ?? 0;
		let seconds = interaction.options.getNumber("seconds-from-now") ?? 0;
		let now = new Date;
		let nowInSeconds = timeConversion(now.getTime() - now.getMilliseconds(), "ms", "s");
		let timestamp = nowInSeconds;
		timestamp += timeConversion(days, "d", "s");
		timestamp += timeConversion(hours, "h", "s");
		timestamp += timeConversion(minutes, "m", "s");
		timestamp += seconds;
		timestamp = Math.round(timestamp);
		if (nowInSeconds < timestamp) {
			let confirmUI = [new MessageActionRow().addComponents(
				new MessageButton().setCustomId(`confirmnextmeeting-${timestamp}`)
					.setLabel("Confirm")
					.setStyle("PRIMARY")
			)]
			interaction.reply({ content: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds from now is:\n<t:${timestamp}>\n\nIs this the correct time?`, components: confirmUI, ephemeral: true });
		} else {
			interaction.reply({ content: "The provided time is in the past.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please set club meeting times from the club's channel.", ephemeral: true });
	}
}
