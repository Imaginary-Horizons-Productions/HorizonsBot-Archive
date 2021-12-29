const Command = require('../../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

let options = [];
module.exports = new Command("data-policy", "Shows types of user data HorizonsBot collects and how it's used", options);

module.exports.execute = (interaction) => {
	// Command specifications go here
	interaction.reply({ embeds: [dataPolicyBuilder(interaction.client.user.displayAvatarURL())], ephemeral: true })
		.catch(console.error);
}

function dataPolicyBuilder(footerURL) {
	return new MessageEmbed().setColor(`6b81eb`)
		.setAuthor({
			name: "Click here to visit the Imaginary Horizons GitHub",
			iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png",
			url: "https://github.com/Imaginary-Horizons-Productions"
		})
		.setTitle(`HorizonsBot Data Policy`)
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/782019073562378298/shaking-hands.png')
		.setDescription(`If you leave Imaginary Horizons, your data will be deleted.`)
		.addField(`Data Collected`, `HorizonsBot stores user submitted topics, petitions, and club details.`)
		.addField(`Data Usage`, `Imaginary Horizons does not use any user data at this time.`)
		.setFooter({ text: `Updated: HorizonsBot version 1.8.1`, iconURL: footerURL })
		.setTimestamp();
}
