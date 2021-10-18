const Command = require('../../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = new Command("support", "Show ways to support the community");

module.exports.execute = (interaction) => {
	// Lists ways users can support development
	interaction.reply({ embeds: [supportBuilder(interaction.client.user.displayAvatarURL())], ephemeral: true })
		.catch(console.error);
}

function supportBuilder(footerURL) {
	return new MessageEmbed().setColor('6b81eb')
		.setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `)
		.setTitle(`Supporting Imaginary Horizons`)
		.setThumbnail(`https://cdn.discordapp.com/attachments/545684759276421120/734202424960745545/love-mystery.png`)
		.setDescription("Thanks for being a part of the Imaginary Horizons Community. Here are a few ways to support us:")
		.addField("Invite Friends", "Ask a moderator how to get an invite link for the server!")
		.addField("Vote for us on top.gg", "top.gg is a Discord bot/server listing and distrabution service. Voting causes us to appear earlier in searches. [Vote here!](https://top.gg/servers/353575133157392385/vote)")
		.addField("Contribute Code", "Check out our [github](https://github.com/Imaginary-Horizons-Productions) and tackle some issues!")
		.addField("Become a Patron", "Chip in for server costs at the [Imaginary Horizons Productions Patreon](https://www.patreon.com/imaginaryhorizonsproductions). Patrons enjoy various benefits, including premium features for other bots!")
		.setFooter("Thanks in advanced!", footerURL)
		.setTimestamp();
}