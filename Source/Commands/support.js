const Command = require('../../Classes/Command.js');
const { embedTemplateBuilder } = require('../../helpers.js');

const options = [];
const subcomands = [];
module.exports = new Command("support", "Show ways to support Imaginary Horizons", options, subcomands);

module.exports.execute = (interaction) => {
	// Lists ways users can support development
	interaction.reply({ embeds: [supportBuilder(interaction.client.user.displayAvatarURL())], ephemeral: true })
		.catch(console.error);
}

function supportBuilder(footerURL) {
	return embedTemplateBuilder()
		.setTitle(`Supporting Imaginary Horizons`)
		.setThumbnail(`https://cdn.discordapp.com/attachments/545684759276421120/734202424960745545/love-mystery.png`)
		.setDescription("Thanks for being a part of the Imaginary Horizons Community. Here are a few ways to support us:")
		.addField("Invite Friends", "Ask a moderator how to get an invite link for the server!")
		.addField("Vote for us on top.gg", "top.gg is a Discord bot/server listing and distrabution service. Voting causes us to appear earlier in searches. [Vote here!](https://top.gg/servers/353575133157392385/vote)")
		.addField("Check out the github", "Check out our [github](https://github.com/Imaginary-Horizons-Productions) and tackle some issues or sponsor a project!")
		.setFooter({ text: "Thanks in advanced!", iconURL: footerURL })
}
