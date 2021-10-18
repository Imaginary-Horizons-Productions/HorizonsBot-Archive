const Command = require('../../Classes/Command.js');
const { clubInvite } = require('../../helpers.js');

module.exports = new Command("club-invite", "Send the user (default: self) an invite to the club by channel mention, or by sending from club");

module.exports.data.addStringOption(option => option.setName("clubid").setDescription("The club to provide details on").setRequired(false))
	.addUserOption(option => option.setName("invitee").setDescription("The user to invite to the club").setRequired(false));

module.exports.execute = (interaction) => {
	// Provide full details on the given club
	let clubId = interaction.options.getString("clubid") || interaction.channel.id;
	clubInvite(interaction, clubId, interaction.options.getUser("invitee"))
}
