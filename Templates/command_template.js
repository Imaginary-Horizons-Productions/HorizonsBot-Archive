const Command = require('../../Classes/Command.js');

let options = [];
module.exports = new Command("", "", options); // (name, description)

// internal imports go here
module.exports.initialize = function (helpers) {
	({} = helpers);
}

module.exports.execute = (interaction) => {
	// Command specifications go here
}
