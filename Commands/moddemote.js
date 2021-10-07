const Command = require('../Classes/Command.js');
var { getModRoleID, isModerator, removeModerator } = require('../helpers.js');

module.exports = new Command("mod-demote", "Remove a Moderator from HorizonsBot's list and remove the role");

module.exports.data.addMentionableOption(option => option.setName("demotee").setDescription("The user to demote from moderator").setRequired(true));

module.exports.execute = (interaction) => {
	// Remove a Moderator: remove from list, remove role and channel permissions
	if (isModerator(interaction.user.id) || !interaction.member.manageable) {
		let demotee = interaction.options.getMentionable("demotee");
		if (isModerator(demotee.id)) {
			demotee.roles.remove(getModRoleID());
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
