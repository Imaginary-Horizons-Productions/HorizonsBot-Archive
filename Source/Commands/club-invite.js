const Command = require('../../Classes/Command.js');

const options = [
	// can't use channel mention because users can't mention channels that are invisible to them (even by constructing the mention manually)
	{ type: "String", name: "club-id", description: "The club text channel's id", required: false, choices: [] },
	{ type: "User", name: "invitee", description: "The user's mention", required: false, choices: [] }
];
const subcommands = [];
module.exports = new Command("club-invite", "Send a user (default: self) an invite to a club", options, subcommands);

let clubInvite;
module.exports.initialize = function (helpers) {
	({ clubInvite } = helpers);
}

module.exports.execute = (interaction) => {
	// Provide full details on the given club
	let clubId = interaction.options.getString("club-id") || interaction.channelId;
	clubInvite(interaction, clubId, interaction.options.getUser("invitee"))
}
