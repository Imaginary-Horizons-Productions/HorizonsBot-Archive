const Command = require('../../Classes/Command.js');
const { timeConversion } = require('../../helpers.js');

module.exports = new Command("timestamp", "Calculate the unix timestamp for a moment in time, which Discord displays with timezones applied"); // (name, description)

module.exports.data
	.addNumberOption(option => option.setName("days-from-now").setDescription("How many days from now for the timestamp").setRequired(false))
	.addNumberOption(option => option.setName("hours-from-now").setDescription("How many hours from now for the timestamp").setRequired(false))
	.addNumberOption(option => option.setName("minutes-from-now").setDescription("How many minutes from now for the timestamp").setRequired(false))
	.addNumberOption(option => option.setName("seconds-from-now").setDescription("How many seconds from now for the timestamp").setRequired(false))

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
	interaction.reply({ content: `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds from now is:\n<t:${timestamp}>\n\nType the following in chat to have Discord do timezone conversions automatically:\n\`\`\`\n<t:${timestamp}>\`\`\``, ephemeral: true });
}
