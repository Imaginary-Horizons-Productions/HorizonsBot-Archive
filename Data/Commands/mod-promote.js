const Command = require('../../Classes/Command.js');
const { modRoleId, isModerator, addModerator } = require('../../helpers.js');

let options = [
	{ type: "User", name: "promotee", description: "The user to promote to moderator", required: true, choices: {} },
];
module.exports = new Command("mod-promote", "(moderator) Add a Moderator to HorizonsBot's list and give them the role", options);

module.exports.execute = (interaction) => {
	// Add a Moderator: add to list, give role and channel permissions
	if (isModerator(interaction.user.id) || !interaction.member.manageable) {
		let promotee = interaction.options.getMentionable("promotee");
		if (!isModerator(promotee.id)) {
			promotee.roles.add(modRoleId);
			addModerator(promotee.id);
			interaction.reply(`${promotee} has been promoted to Moderator.`)
				.catch(console.error);
		} else {
			interaction.reply({ content: `${promotee} is already a Moderator.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.reply({ content: `You must be a Moderator to use the \`${state.command}\` command.`, ephemeral: true })
			.catch(console.error);
	}
}
