const Command = require('../../Classes/Command.js');

const options = [];
const subcommands = [];
module.exports = new Command("name", "description", options, subcommands);

// internal imports go here
module.exports.initialize = function (helpers) {
	({} = helpers);
}

module.exports.execute = (interaction) => {
	// Command specifications go here
}
