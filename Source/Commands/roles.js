const Command = require('../../Classes/Command.js');
const embed = require("../../Config/embeds/roles.json");

const options = [];
const subcommands = [];
module.exports = new Command("roles", "Get a rundown of the server's roles", options, subcommands);

module.exports.execute = (interaction) => {
	// Private message the user with roles info
	//TODO rolesbot thumbnail?
	interaction.reply({ embeds: [embed], ephemeral: true });
}
