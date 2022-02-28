const Command = require('../../Classes/Command.js');

let options = [
	{ type: "String", name: "start", description: "The timestamp to start from (default: now)", required: false, choices: {} },
	{ type: "Number", name: "days-from-start", description: "86400 seconds", required: false, choices: {} },
	{ type: "Number", name: "hours-from-start", description: "3600 seconds", required: false, choices: {} },
	{ type: "Number", name: "minutes-from-start", description: "60 seconds", required: false, choices: {} }
];
module.exports = new Command("timestamp", "Calculate the unix timestamp for a moment in time, which Discord displays with timezones applied", options);

let timeConversion;
module.exports.initialize = function (helpers) {
	({ timeConversion } = helpers);
}

module.exports.execute = (interaction) => {
	// Calculate the unix timestamp given days, hours, minutes, and seconds from now
	// reference on ?? --> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
	let days = interaction.options.getNumber("days-from-start") ?? 0;
	let hours = interaction.options.getNumber("hours-from-start") ?? 0;
	let minutes = interaction.options.getNumber("minutes-from-start") ?? 0;
	let now = new Date;
	let start = interaction.options.getString("start");
	let startValue = start?.match(/<t:(\d+)>/)?.[1];
	if (start === undefined || start === null || startValue) {
		let timestamp;
		if (startValue) {
			timestamp = Number(startValue);
		} else {
			timestamp = timeConversion(now.getTime() - now.getMilliseconds(), "ms", "s");
		}

		timestamp += timeConversion(days, "d", "s");
		timestamp += timeConversion(hours, "h", "s");
		timestamp += timeConversion(minutes, "m", "s");
		timestamp = Math.round(timestamp);
		interaction.reply({ content: `${days} days, ${hours} hours, and ${minutes} minutes from ${startValue ? `<t:${startValue}>` : "now"} is:\n\`<t:${timestamp}>\`\n\nDiscord will automatically convert timezones from the above. Following is an example with the styling removed for copying on mobile:`, ephemeral: true }).then(() => {
			interaction.followUp({ content: `<t:${timestamp}>`, ephemeral: true });
		});
	} else {
		interaction.reply({ content: "Please provide start timestamp in <t:seconds> format.", ephemeral: true });
	}
}
