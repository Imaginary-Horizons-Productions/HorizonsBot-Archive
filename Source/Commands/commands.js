const fs = require("fs");
const Command = require('../../Classes/Command.js');
const { embedTemplateBuilder } = require("../../helpers.js");

const options = [
	{
		type: "Integer", name: "page", description: "Pick a single page of commands to view", required: false, choices: [
			{ name: "General Commands", value: 0 },
			{ name: "Informational Commands", value: 1 },
			{ name: "Topic Commands", value: 2 },
			{ name: "Club Commands", value: 3 },
			{ name: "Moderation Commands", value: 4 }
		]
	}
];
const subcommands = [];
module.exports = new Command("commands", "List HorizonsBot's commands", options, subcommands);

let wikiPage;
fs.readFile("Wiki/Commands.md", { encoding: "utf-8" }, (error, data) => {
	if (error) {
		console.error(error);
	} else {
		wikiPage = data;
	}
})

module.exports.execute = (interaction) => {
	const embeds = [];
	for (const commandSet of wikiPage.split("\n## ")) {
		let commands = commandSet.split("\n### ");
		let [commandSetName, commandSetText] = commands[0].split(/\r*\n/);
		if (commandSetName.startsWith("## ")) {
			commandSetName = commandSetName.slice(2);
		}
		const embed = embedTemplateBuilder()
			.setTitle(commandSetName)
			.setDescription(commandSetText)
			.setFooter({ text: "Use /support to learn how to support the server!", iconURL: interaction.client.user.displayAvatarURL() })

		for (const command of commands.slice(1)) {
			let [commandName, description, ...args] = command.split(/\r*\n/)
			embed.addField(commandName, description)
		}

		embeds.push(embed);
	}

	const pageNumber = interaction.options.getInteger("page");
	if (pageNumber !== null) {
		interaction.reply({ embeds: [embeds[pageNumber]], ephemeral: true })
			.catch(console.error);
	} else {
		interaction.reply({ embeds, ephemeral: true })
			.catch(console.error);
	}
}
