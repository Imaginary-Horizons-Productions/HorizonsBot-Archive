const Command = require('../../Classes/Command.js');

const options = [
	{ type: "String", name: "message", description: "The text of the notification", required: true, choices: {} },
	{ type: "String", name: "type", description: "Who to notify", required: false, choices: { "Only online users in this channel": "@here", "All users in this channel": "@everyone" } }
];
const subcomands = [];
module.exports = new Command("at-channel", "Send a ping to the current channel", options, subcomands);

let atIds, timeConversion, noAts;
module.exports.initialize = function (helpers) {
	({ atIds, timeConversion, noAts } = helpers);
}

module.exports.execute = (interaction) => {
	// Send a rate-limited ping
	if (!noAts.includes(interaction.user.id)) {
		if (!atIds.has(interaction.user.id)) {
			atIds.add(interaction.user.id);
			setTimeout((timeoutId) => {
				atIds.delete(timeoutId);
			}, timeConversion(5, "m", "ms"), interaction.user.id);
			interaction.reply(`${interaction.options.getString("type") === "@everyone" ? "@everyone" : "@here"} ${interaction.options.getString("message")}`);
		} else {
			interaction.reply({ content: "You may only use `/at-channel` once every 5 minutes. Please wait to send your next at.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "You are currently not permitted to use /at-channel. Please speak to a moderator if you believe this to be in error.", ephemeral: true });
	}
}
