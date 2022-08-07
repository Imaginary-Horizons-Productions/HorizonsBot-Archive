const Command = require('../../Classes/Command.js');

const options = [];
const subcommands = [];
module.exports = new Command("club-instructions", "Get up-to-date club setup instructions", options, subcommands);

module.exports.execute = (interaction) => {
	// Send the user the club setup instructions
	interaction.reply({ content: module.exports.clubInstructionsText(interaction.user), ephemeral: true });
}

module.exports.clubInstructionsText = function (host) {
	return `Welcome to your new club's text channel ${host}! As club host, you can pin and delete messages in this channel.\n\nYou can use the following commands to manage the club:\n\
	\`/club-config\` - configure name, description, game, max-members, or color\n\
	\`/club-set-image\` - set or clear the club's image\n\
	\`/club-next-meeting\` - set the club's next meeting for reminders and events\n\
	\`/club-set-repeat\` - set the how frequently meetings repeat\n\
	\`/club-promote-leader\` - give leadership of the club to another user\n\
	\`/club-instructions\` - get the latest version of these instructions`;
}
