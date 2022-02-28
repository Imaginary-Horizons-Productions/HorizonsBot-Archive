const Command = require('../../Classes/Command.js');

let options = [
	{ type: "User", name: "user", description: "The user's mention", required: true, choices: {} }
];
module.exports = new Command("no-ats", "Toggles whether a user can use /at-channel", options);

let isModerator, noAts, saveModData;
module.exports.initialize = function (helpers) {
	({ isModerator, noAts, saveModData } = helpers);
}

module.exports.execute = (interaction) => {
	// Toggle whether the provided user can use /at-channel
	if (isModerator(interaction.user.id)) {
		let userId = interaction.options.getUser("user").id;
		if (noAts.includes(userId)) {
			noAts.splice(noAts.findIndex(id => id === userId), 1);
			interaction.reply(`<@${userId}> can use \`/at-channel\` again.`);
			saveModData();
		} else {
			noAts.push(userId);
			interaction.reply(`<@${userId}> can no longer use \`/at-channel\`.`);
			saveModData();
		}
	} else {
		interaction.reply({ content: "Toggling /at-channel permission is limited to moderators.", ephemeral: true });
	}
}
