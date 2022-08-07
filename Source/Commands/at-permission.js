const Command = require('../../Classes/Command.js');
const { isModerator, noAts, saveModData } = require('../../helpers.js');

const options = [];
const subcomands = [
	{
		name: "disallow",
		description: "(moderator) Prevent a user from using /at-channel",
		optionsInput: [
			{ type: "User", name: "user", description: "The user's mention", required: true, choices: [] }
		]
	},
	{
		name: "allow",
		description: "(moderator) Re-allow a user to use /at-channel",
		optionsInput: [
			{ type: "User", name: "user", description: "The user's mention", required: true, choices: [] }
		]
	}
];
module.exports = new Command("at-permission", "(moderator) Disallow/Re-allow a user to use /at-channel", options, subcomands);

module.exports.execute = (interaction) => {
	if (isModerator(interaction.user.id)) {
		const userId = interaction.options.getUser("user").id;
		if (interaction.options.getSubcommand() === "disallow") {
			// Prevent the given user from using /at-channel
			if (!noAts.includes(userId)) {
				noAts.push(userId);
				interaction.reply(`<@${userId}> can no longer use \`/at-channel\`.`);
				saveModData();
			} else {
				interaction.reply({ content: `<@${userId}> is already restricted from using \`/at-channel\`.`, ephemeral: true });
			}
		} else {
			// Allow the given user from using /at-channel
			if (noAts.includes(userId)) {
				noAts.splice(noAts.findIndex(id => id === userId), 1);
				interaction.reply(`<@${userId}> can use \`/at-channel\` again.`);
				saveModData();
			} else {
				interaction.reply({ content: `<@${userId}> is not restricted from using \`/at-channel\`.`, ephemeral: true });
			}
		}
	} else {
		interaction.reply({ content: "Changing `/at-channel` permission is limited to moderators.", ephemeral: true });
	}
}
