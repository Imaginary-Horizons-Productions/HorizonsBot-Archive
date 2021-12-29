const Command = require('../../Classes/Command.js');
const { isModerator, noAts } = require('../../helpers.js');

let options = [
	{ type: "User", name: "user", description: "The user to prevent/allow the use of /at-channel", required: true, choices: {} }
];
module.exports = new Command("no-ats", "Toggles whether the user can use /at-channel", options);

module.exports.execute = (interaction) => {
	// Toggle whether the provided user can use /at-channel
	if (isModerator(interaction.user.id)) {
		let userId = interaction.options.getUser("user").id;
		if (noAts.includes(userId)) {
			noAts = noAts.filter(id => id !== userId);
			//TOODNOW save
			//TODONOW notify user?
			//TODONOW feedback
			interaction.reply();
		} else {
			noAts.push(userId);
			//TOODNOW save
			//TODONOW notify user?
			//TODONOW feedback
			interaction.reply();
		}
	} else {
		interaction.reply({ content: "Toggling /at-channel permission is limited to moderators.", ephemeral: true });
	}
}
