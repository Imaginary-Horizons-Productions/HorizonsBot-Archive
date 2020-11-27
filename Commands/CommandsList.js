const fs = require('fs');
const CommandSet = require('./../Classes/CommandSet.js');

// Total commands (new CommandSet when exceeding 25): 20
exports.commandSets = [
	new CommandSet(['about.js', 'help.js', 'support.js', 'datapolicy.js', 'roll.js', 'list.js', 'campaigndetails.js', 'joincampaign.js', 'leavecampaign.js', 'addcampaign.js', 'deletecampaign.js', 'renamecampaign.js', 'setdescription.js', 'setseats.js', 'setsystem.js', 'settimeslot.js', 'setimage.js', 'managerrole.js', 'permissionsrole.js', 'pinlist.js'])
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
