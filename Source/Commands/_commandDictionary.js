const CommandSet = require('../../Classes/CommandSet.js');

// Total commands (new CommandSet when exceeding 25): 15
exports.commandSets = [
	new CommandSet("HorizonsBot Commands", "The general use commands. Required permissions are listed in (parenthesis) at the beginning of the description.",
		['about.js', 'commands.js', 'support.js', 'data-policy.js', "list.js", "join.js", "leave.js", "roll.js", "timestamp.js", "at-channel.js"]),
	new CommandSet("Custom Message Embeds", "To get a message's id, enable developer mode (User Settings > Appearance > Developer Mode), then right-click the message and select \"Copy ID\".",
		['embed-create.js', 'embed-abandon.js', 'embed-set-author.js', 'embed-set-title.js', 'embed-set-url.js', 'embed-set-color.js', 'embed-set-description.js', 'embed-set-thumbnail.js', 'embed-add-field.js', 'embed-splice-fields.js', 'embed-set-image.js', "embed-set-message.js"]),
	new CommandSet("Topic Commands", "Commands for managing topics.",
		["petition.js", "topic-invite.js", "topic-add.js", "petition-check.js", "petition-veto.js"]),
	new CommandSet("Club Commands", "Commands for managing clubs.",
		["club-instructions.js", "club-invite.js", "club-add.js", "club-config.js", "club-next-meeting.js", "club-set-repeat.js", "club-set-image.js", "club-details.js", "club-promote-leader.js"]),
	new CommandSet("Moderation Commands", "Commands for moderators.",
		['mod-promote.js', 'mod-demote.js', "pin-list.js", "kick.js", "delete.js", "no-ats.js"])
];

let commandDictionary = {};

exports.initializeCommands = function (isProduction, helpers) {
	const commandFiles = exports.commandSets.reduce((allFiles, set) => allFiles.concat(set.fileNames), []);

	for (const file of commandFiles) {
		const command = require(`./${file}`);
		if (isProduction) {
			command.initialize(helpers);
		}
		commandDictionary[command.name] = command;
	}
}

exports.getCommand = function (commandName) {
	return commandDictionary[commandName];
}
