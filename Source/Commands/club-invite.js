const Command = require('../../Classes/Command.js');

let options = [
	{ type: "String", name: "club-id", description: "The club to provide details on", required: false, choices: {} },
	{ type: "User", name: "invitee", description: "The user to invite to the club", required: false, choices: {} }
];
module.exports = new Command("club-invite", "Send the user (default: self) an invite to the club by channel mention, or by sending from club", options);

let clubInvite;
module.exports.initialize = function (helpers) {
	({ clubInvite } = helpers);
}

module.exports.execute = (interaction) => {
	// Provide full details on the given club
	let clubId = interaction.options.getString("club-id") || interaction.channelId;
	clubInvite(interaction, clubId, interaction.options.getUser("invitee"))
}
