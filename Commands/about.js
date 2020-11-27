const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(["About", "Credits"],
	"Shows details about HorizonsBot and its contributors.",
	"None",
	["Usage"],
	["`@HorizonsBot About`"]);

command.execute = (receivedMessage, state) => {
	// Private message author with description of the bot and contributors
	let embed = new MessageEmbed().setColor(`6b81eb`)
		.setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `, `https://discord.gg/bcE3Syu `)
		.setTitle(`HorizonsBot (version 1.0.0)`)
		.setURL(`https://github.com/Imaginary-Horizons-Productions/TRPGTrackerBot `)
		.setDescription(`HorizonsBot helps with channel management and other stuff on the Imaginary Horizons Community Discord.`)
		.addField(`Design & Engineering`, `Nathaniel Tseng ( <@106122478715150336> | [Twitter](https://twitter.com/Archainis) )`)
		.addField(`\u200B`, `**__Patrons__**\nImaginary Horizons Productions is supported on [Patreon](https://www.patreon.com/imaginaryhorizonsproductions) by generous users like you, credited below.`)
		.addField(`Cartographer Tier`, `Ralph Beish`, false)
		.addField(`Explorer Tier`, `Eric Hu`, false)
		.setFooter(`Use "@HorizonsBot support" to learn how to support development!`, receivedMessage.client.user.displayAvatarURL())
		.setTimestamp();

	receivedMessage.author.send(embed);
}

module.exports = command;
