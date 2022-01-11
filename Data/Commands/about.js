const Command = require('../../Classes/Command.js');
const { embedTemplateBuilder } = require('../../helpers.js');

let options = [];
module.exports = new Command("about", "Provides details about HorizonsBot and its contributors", options);

module.exports.execute = (interaction) => {
	// Private message author with description of the bot and contributors
	let embed = embedTemplateBuilder()
		.setTitle(`HorizonsBot (version 1.14.1)`)
		.setDescription(`HorizonsBot helps with channel management and other stuff on the Imaginary Horizons Community Discord.`)
		.addField(`Design & Engineering`, `Nathaniel Tseng ( <@106122478715150336> | [Twitter](https://twitter.com/Arcane_ish) )`)
		.addField(`Dice Roller`, `Lucas Ensign ( <@112785244733628416> | [Twitter](https://twitter.com/SillySalamndr) )`)
		.setFooter({ text: "Use \"@HorizonsBot support\" to learn how to support the server!", iconURL: interaction.client.user.displayAvatarURL() });

	interaction.reply({ embeds: [embed], ephemeral: true });
}
