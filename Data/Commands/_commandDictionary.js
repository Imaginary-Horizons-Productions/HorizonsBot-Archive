const fs = require('fs');
const CommandSet = require('../../Classes/CommandSet.js');

// Total commands (new CommandSet when exceeding 25): 15
exports.commandSets = [
	new CommandSet("HorizonsBot Commands", "Here are all of HorizonsBot's commands. Check their details to see what the usage requirements are!",
		['about.js', 'commands.js', 'support.js', 'data-policy.js', "list.js", "join.js", "leave.js", "petition.js", "kick.js", "delete.js", "pin-list.js", "roll.js", "timestamp.js"]),
	new CommandSet("Custom Message Embeds", "To get a message's id, enable developer mode (User Settings > Appearance > Developer Mode), then right-click the message and select \"Copy ID\".",
		['embed-create.js', 'embed-abandon.js', 'embed-set-author.js', 'embed-set-title.js', 'embed-set-url.js', 'embed-set-color.js', 'embed-set-description.js', 'embed-set-thumbnail.js', 'embed-add-field.js', 'embed-splice-fields.js', 'embed-set-image.js', "embed-set-message.js"]),
	new CommandSet("Topic Commands", "Commands for managing opt-in topic text channels.",
		["topic-invite.js", "topic-add.js", "topic-veto.js"]),
	new CommandSet("Club Commands", "Commands for managing club text and voice channels.",
		["club-invite.js", "club-add.js", "club-config.js", "club-next-meeting.js", "club-set-repeat.js", "club-set-image.js", "club-details.js", "club-promote-leader.js"]),
	new CommandSet("Moderation Commands", "Commands for managing HorizonsBot's list of moderators.",
		['mod-promote.js', 'mod-demote.js'])
];

var commandFileNames = [];
exports.commandSets.forEach(commandSet => {
	commandFileNames = commandFileNames.concat(commandSet.fileNames);
})
const commandFiles = fs.readdirSync('./Data/Commands').filter(file => file.endsWith('.js') && commandFileNames.includes(file));
var commandDictionary = {};

for (const file of commandFiles) {
	const command = require(`./${file}`);
	commandDictionary[command.name] = command;
}

exports.getCommand = function (commandName) {
	return commandDictionary[commandName];
}
