const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class Command {
	constructor(nameInput, descriptionInput, optionsInput, subcommandsInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.data = new SlashCommandBuilder()
			.setName(nameInput)
			.setDescription(descriptionInput);
		optionsInput.forEach(option => {
			this.data[`add${option.type}Option`](built => {
				built.setName(option.name).setDescription(option.description).setRequired(option.required);
				if (option.choices === null || option.choices === undefined) {
					throw `Error: ${this.nameInput} (${descriptionInput}) ${option.type} Option was nullish.`;
				}
				if (option.choices.length) {
					built.addChoices(...option.choices);
				}
				return built;
			})
		})
		subcommandsInput.forEach(subcommand => {
			this.data.addSubcommand(built => {
				built.setName(subcommand.name).setDescription(subcommand.description);
				subcommand.optionsInput.forEach(option => {
					built[`add${option.type}Option`](subBuilt => {
						subBuilt.setName(option.name).setDescription(option.description).setRequired(option.required);
						if (option.choices === null || option.choices === undefined) {
							throw `Error: ${this.nameInput} (${descriptionInput}) ${option.type} Option was nullish.`;
						}
						if (option.choices.length) {
							subBuilt.addChoices(...option.choices);
						}
						return subBuilt;
					})
				})
				return built;
			})
		})
	}

	execute(interaction) { }
}
