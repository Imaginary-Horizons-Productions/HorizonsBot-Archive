const Command = require('../../Classes/Command.js');

let options = [
	{ type: "String", name: "message", description: "The text to go with the notification", required: true, choices: {} },
	{ type: "String", name: "type", description: "Who to notify with the message", required: false, choices: { "Only notifiy online users in this channel": "@here", "Also notify offline users in this channel": "@everyone" } }
];
module.exports = new Command("at-channel", "Send a ping to the current channel", options);

module.exports.execute = (interaction) => {
	// Send a rate-limited ping
	if (true) { //TODONOW per user rate limiting 1 ping / 5 minutes
		if (true) { //TODONOW server-wide rate limiting (text channels / 10) / 5 minutes
			interaction.reply(`${interaction.options.getString("type") === "@everyone" ? "@everyone" : "@here"} ${interaction.options.getString("message")}`);
		} else {
			//TODONOW error
		}
	} else {
		interaction.reply({ content: "You may only use `/at-channel` once every 5 minutes. Please wait to send your next at.", ephemeral: true });
	}
}
