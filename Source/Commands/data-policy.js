const Command = require('../../Classes/Command.js');
const embed = require("../../Config/embeds/data-policy.json");

const options = [];
const subcomands = [];
module.exports = new Command("data-policy", "Show what user data HorizonsBot collects and how it's used", options, subcomands);

module.exports.execute = (interaction) => {
	// Show the user the Imaginary Horizons data policy
	interaction.reply({ embeds: [embed], ephemeral: true });
}
