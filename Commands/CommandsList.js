const fs = require('fs');
const CommandSet = require('./../Classes/CommandSet.js');

// Total commands (new CommandSet when exceeding 25): 13
exports.commandSets = [
	new CommandSet("HorizonsBot Commands", "Here are all of HorizonsBot's commands. Check their details to see what the usage requirements are!",
		['about.js', 'help.js', 'support.js', 'datapolicy.js', 'messageembed.js', 'embedsettitle.js', 'embedsetdescription.js', 'embedseturl.js', 'embedsetimage.js', 'embedsetthumbnail.js', 'embedaddfield.js', 'embedsetauthor.js'])
];

var commandFileNames = [];
exports.commandSets.forEach(commandSet => {
	commandFileNames = commandFileNames.concat(commandSet.fileNames);
})
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js') && commandFileNames.includes(file));
var commandDictionary = {};

for (const file of commandFiles) {
	const command = require(`./${file}`);
	command.aliases.forEach(alias => {
		let searchableAlias = alias.toLowerCase();
		commandDictionary[searchableAlias] = command;
	})
}

exports.commandDictionary = commandDictionary;
