const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = new Command("about", "Provides details about HorizonsBot and its contributors");

module.exports.execute = (interaction) => {
	// Private message author with description of the bot and contributors
	let embed = new MessageEmbed().setColor(`6b81eb`)
		.setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `)
		.setTitle(`HorizonsBot (version 1.9.0)`)
		.setDescription(`HorizonsBot helps with channel management and other stuff on the Imaginary Horizons Community Discord.`)
		.addField(`Design & Engineering`, `Nathaniel Tseng ( <@106122478715150336> | [Twitter](https://twitter.com/Arcane_ish) )`)
		.addField(`Engineering`, `Lucas Ensign ( <@112785244733628416> | [Twitter](https://twitter.com/SillySalamndr) )`)
		.addField(`\u200B`, `**__Patrons__**\nImaginary Horizons Productions is supported on [Patreon](https://www.patreon.com/imaginaryhorizonsproductions) by generous users like you, credited below.`)
		.addField(`Cartographer Tier`, `Ralph Beish`, false)
		.addField(`Explorer Tier`, `Eric Hu`, false)
		.setFooter(`Use "@HorizonsBot support" to learn how to support the server!`, interaction.client.user.displayAvatarURL())
		.setTimestamp();

	interaction.reply({ embeds: [embed], ephemeral: true });
}
