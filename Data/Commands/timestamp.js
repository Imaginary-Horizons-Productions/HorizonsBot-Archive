const Command = require('../../Classes/Command.js');
const { timeConversion } = require('../../helpers.js');

let options = [
	{ type: "Number", name: "days-from-now", description: "How many days from now for the timestamp", required: false, choices: {} },
	{ type: "Number", name: "hours-from-now", description: "How many hours from now for the timestamp", required: false, choices: {} },
	{ type: "Number", name: "minutes-from-now", description: "How many minutes from now for the timestamp", required: false, choices: {} },
	{ type: "Number", name: "seconds-from-now", description: "How many seconds from now for the timestamp", required: false, choices: {} },
];
module.exports = new Command("timestamp", "Calculate the unix timestamp for a moment in time, which Discord displays with timezones applied", options);

module.exports.execute = (interaction) => {
	// Calculate the unix timestamp given days, hours, minutes, and seconds from now
	// reference on ?? --> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
	let days = interaction.options.getNumber("days-from-now") ?? 0;
	let hours = interaction.options.getNumber("hours-from-now") ?? 0;
	let minutes = interaction.options.getNumber("minutes-from-now") ?? 0;
	let seconds = interaction.options.getNumber("seconds-from-now") ?? 0;
	let now = new Date;
	let timestamp = timeConversion(now.getTime() - now.getMilliseconds(), "ms", "s");
	timestamp += timeConversion(days, "d", "s");
	timestamp += timeConversion(hours, "h", "s");
	timestamp += timeConversion(minutes, "m", "s");
	timestamp += seconds;
	timestamp = Math.round(timestamp);
	interaction.reply({ content: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds from now is:\n\`<t:${timestamp}>\`\n\nDiscord will automatically convert timezones from the above. Following is an example with the styling removed for copying on mobile:`, ephemeral: true }).then(() => {
		interaction.followUp({ content: `<t:${timestamp}>`, ephemeral: true });
	});
}
