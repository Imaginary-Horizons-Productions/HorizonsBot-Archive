const Command = require('../../Classes/Command.js');
const embed = require("../../Config/embeds/rules.json");

const options = [];
const subcommands = [];
module.exports = new Command("rules", "Get the server rules", options, subcommands);

module.exports.execute = (interaction) => {
	// Private message the server rules to the user
	//TODONOW server logo
	interaction.reply({ embeds: [embed], ephemeral: true });
}
