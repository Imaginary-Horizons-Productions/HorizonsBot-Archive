const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class Command {
	constructor(nameInput, descriptionInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.data = new SlashCommandBuilder()
			.setName(nameInput)
			.setDescription(descriptionInput);
	}

	execute(interaction) { }
}
