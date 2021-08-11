const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(["DataPolicy", "PrivacyPolicy"], // aliases
	"Shows types of user data HorizonsBot collects and how it's used", // description
	"N/A", // requirements
	["Usage"], // headings
	["`@HorizonsBot DataPolicy`"]); // texts (must match number of headings)

command.help = (avatarURL) => {
	return dataPolicyBuilder(avatarURL);
}

command.execute = (receivedMessage, state) => {
	// Command specifications go here
	receivedMessage.author.send({ embeds: [dataPolicyBuilder(receivedMessage.client.user.displayAvatarURL())] })
		.catch(console.error);
}

module.exports = command;

function dataPolicyBuilder(footerURL) {
	return new MessageEmbed().setColor(`6b81eb`)
		.setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `)
		.setTitle(`HorizonsBot Data Policy`)
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/782019073562378298/shaking-hands.png')
		.setDescription(`If you leave Imaginary Horizons, your data will be deleted.`)
		.addField(`Data Collected`, `HorizonsBot stores user submitted topics, petitions, and club details.`)
		.addField(`Data Usage`, `Imaginary Horizons does not use any user data at this time.`)
		.setFooter(`Updated: HorizonsBot version 1.6.0`, footerURL)
		.setTimestamp();
}
