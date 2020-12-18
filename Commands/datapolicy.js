const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(["DataPolicy", "PrivacyPolicy"], // aliases
	"Shows types of user data HorizonsBot collects and how it's used", // description
	"None", // requirements
	["Usage"], // headings
	["`@HorizonsBot DataPolicy`"]); // texts (must match number of headings)

command.help = (avatarURL) => {
	return dataPolicyBuilder(avatarURL);
}

command.execute = (receivedMessage, state) => {
	// Command specifications go here
	receivedMessage.author.send(dataPolicyBuilder(receivedMessage.client.user.displayAvatarURL()))
		.catch(console.error);
}

module.exports = command;

function dataPolicyBuilder(footerURL) {
	return new MessageEmbed().setColor(`6b81eb`)
		.setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `)
		.setTitle(`HorizonsBot Data Policy`)
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/782019073562378298/shaking-hands.png')
		.setDescription(`If you leave Imaginary Horizons, your data will be deleted.`)
		.addField(`Data Collected (version 1.0)`, `HorizonsBot does not collect user data at this time.`)
		.addField(`Data Usage (version 1.0)`, `Imaginary Horizons does not use uncollected user data at this time.`)
		.setFooter(``, footerURL)
		.setTimestamp();
}
