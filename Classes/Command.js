const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class Command {
	constructor(aliasesInput, descriptionInput, requirementsInput, headingsInput, fieldsInput) {
		this.aliases = aliasesInput;
		this.description = descriptionInput;
		this.requirements = requirementsInput;
		this.headings = headingsInput; // This array must have the same length as this.texts
		this.texts = fieldsInput;

		this.data = new SlashCommandBuilder()
			.setName(aliasesInput[0].toLowerCase())
			.setDescription(descriptionInput);
	}

	help(avatarURL) {
		let embed = new MessageEmbed().setAuthor("Imaginary Horizons Productions", `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `)
			.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765061579619565588/magnifying-glass.png')
			.setTitle(`HorizonsBot Command: ${this.aliases.join(', ')}`)
			.setDescription(this.description)
			.addField("Usage Requirements", this.requirements)
			.setFooter(`Use "@HorizonsBot support" to learn how to support development!`, avatarURL);
		for (var i = 0; i < this.headings.length; i++) {
			embed.addField(this.headings[i], this.texts[i]);
		}

		return embed;
	}

	execute(receivedMessage, state) { }

	executeInteraction(interaction) { }
}
