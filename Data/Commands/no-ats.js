const Command = require('../../Classes/Command.js');
const { isModerator, noAts, saveModData } = require('../../helpers.js');

let options = [
	{ type: "User", name: "user", description: "The user to prevent/allow the use of /at-channel", required: true, choices: {} }
];
module.exports = new Command("no-ats", "Toggles whether the user can use /at-channel", options);

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
