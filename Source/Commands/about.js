const Command = require('../../Classes/Command.js');
const embed = require("../../Config/embeds/about.json");

const options = [];
const subcommands = [];
module.exports = new Command("about", "Get the HorizonsBot credits", options, subcommands);

module.exports.execute = (interaction) => {
	// Private message author with description of the bot and contributors
	interaction.reply({ embeds: [embed], ephemeral: true });
}
