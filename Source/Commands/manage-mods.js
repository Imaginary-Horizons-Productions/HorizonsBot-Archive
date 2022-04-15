const Command = require('../../Classes/Command.js');

const options = [];
const subcomands = [
	{
		name: "promote",
		description: "(moderator) Add a user to the moderator list",
		optionsInput: [
			{ type: "User", name: "promotee", description: "The user's mention", required: true, choices: {} },
		]
	},
	{
		name: "demote",
		description: "(moderator) Remove a user from the moderator list",
		optionsInput: [
			{ type: "User", name: "demotee", description: "The user's mention", required: true, choices: {} }
		]
	}
];
module.exports = new Command("manage-mods", "(moderator) Promote/demote a user to moderator", options, subcomands);

let modRoleId, isModerator, addModerator, removeModerator;
module.exports.initialize = function (helpers) {
	({ modRoleId, isModerator, addModerator, removeModerator } = helpers);
}

module.exports.execute = (interaction) => {
	if (interaction.options.getSubcommand() === "promote") {
		// Add a Moderator: add to list, give role and channel permissions
		if (isModerator(interaction.user.id) || !interaction.member.manageable) {
			let promotee = interaction.options.getUser("promotee");
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

	if (interaction.options.getSubcommand() === "demote") {
		// Remove a Moderator: remove from list, remove role and channel permissions
		if (isModerator(interaction.user.id) || !interaction.member.manageable) {
			let demotee = interaction.options.getUser("demotee");
			if (isModerator(demotee.id)) {
				demotee.roles.remove(modRoleId);
				removeModerator(demotee.id);
				interaction.reply(`${demotee} has been demoted from Moderator.`)
					.catch(console.error);
			} else {
				interaction.reply({ content: `${demotee} is already not a Moderator.`, ephemeral: true })
					.catch(console.error);
			}
		} else {
			interaction.reply({ content: `You must be a Moderator to use the \`${interaction.commandName}\` command.`, ephemeral: true })
				.catch(console.error);
		}
	}
}
