const Command = require('../../Classes/Command.js');
const embed = require("../../Config/embeds/press-kit.json");

const options = [];
const subcommands = [];
module.exports = new Command("press-kit", "Get info on Imaginary Horizons as a brand", options, subcommands);

module.exports.execute = (interaction) => {
	// Private message user with IHC brand info
	//TODO invite link
	//TODO banner
	interaction.reply({ embeds: [embed], ephemeral: true });
}
