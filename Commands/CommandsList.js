const fs = require('fs');
const CommandSet = require('./../Classes/CommandSet.js');

// Total commands (new CommandSet when exceeding 25): 15
exports.commandSets = [
	new CommandSet("HorizonsBot Commands", "Here are all of HorizonsBot's commands. Check their details to see what the usage requirements are!",
		['about.js', 'help.js', 'support.js', 'datapolicy.js', "list.js", "join.js", "leave.js", "petition.js", "setchannelemoji.js", "ban.js", "delete.js", "pinlist.js", "roll.js", "rollDetailed.js", "rollVerbose.js", "rollWithMax.js"]),
	new CommandSet("Custom Message Embeds", "To get a message's id, enable developer mode (User Settings > Appearance > Developer Mode), then right-click the message and select \"Copy ID\".",
		['embedcreate.js', 'embedabandon.js', 'embedsetauthor.js', 'embedsettitle.js', 'embedseturl.js', 'embedsetcolor.js', 'embedsetdescription.js', 'embedsetthumbnail.js', 'embedaddfield.js', 'embedsplicefields.js', 'embedsetimage.js', 'embedsetfooter.js',]),
	new CommandSet("Topic Commands", "Commands for managing opt-in topic text channels.",
		["topicinvite.js", "topicadd.js", "topicveto.js"]),
	new CommandSet("TRPG Campaign Commands", "Commands for managing TRPG text and voice channels.",
		["campaigndetails.js", "campaignadd.js", "campaignrename.js", "campaignsetseats.js", "campaignsetdescription.js", "campaignsetsystem.js", "campaignsettimeslot.js", "campaignsetimage.js"]),
	new CommandSet("Moderation Commands", "Commands for managing HorizonsBot's list of moderators.",
		['modpromote.js', 'moddemote.js'])
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

exports.getCommand = function (commandName) {
	return commandDictionary[commandName];
}
