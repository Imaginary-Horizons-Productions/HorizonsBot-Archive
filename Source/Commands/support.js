const Command = require('../../Classes/Command.js');
const embed = require("../../Config/embeds/support.json");

const options = [];
const subcomands = [];
module.exports = new Command("support", "Show ways to support Imaginary Horizons", options, subcomands);

module.exports.execute = (interaction) => {
	// Lists ways users can support development
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
}
