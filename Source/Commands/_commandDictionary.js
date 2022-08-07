const CommandSet = require('../../Classes/CommandSet.js');

exports.commandSets = [
	new CommandSet("General Commands", "These commands are general use utilities for the server.",
		["at-channel.js", "list.js", "join.js", "leave.js", "roll.js", "timestamp.js"]),
	new CommandSet("Informantional Commands", "Use these commands to learn more about HorizonsBot or this server.",
		['rules.js', 'commands.js', 'roles.js', 'about.js', 'data-policy.js', 'support.js', 'press-kit.js', "version.js"]),
	new CommandSet("Topic Commands", "This server has opt-in topic channels that are automatically generated when enough members petition for them.",
		["petition.js", "topic-invite.js", "topic-add.js", "petition-check.js", "petition-veto.js"]),
	new CommandSet("Club Commands", "Clubs are private text and voice channels that include organization utilities like automatic reminders.",
		["club-instructions.js", "club-invite.js", "club-add.js", "club-config.js", "club-next-meeting.js", "club-set-repeat.js", "club-set-image.js", "club-details.js", "club-promote-leader.js"]),
	new CommandSet("Moderation Commands", "Commands for moderators. Required permissions are listed in (parenthesis) at the beginning of the description.",
		['manage-mods.js', "pin-list.js", "kick.js", "delete.js", "at-permission.js"])
];

let commandDictionary = {};

const commandFiles = exports.commandSets.reduce((allFiles, set) => allFiles.concat(set.fileNames), []);

for (const file of commandFiles) {
	const command = require(`./${file}`);
	commandDictionary[command.name] = command;
}

exports.getCommand = function (commandName) {
	return commandDictionary[commandName];
}
