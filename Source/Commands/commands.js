const fs = require("fs");
const Command = require('../../Classes/Command.js');

const options = [];
const subcommands = [];
module.exports = new Command("commands", "List HorizonsBot's commands", options, subcommands);

let embedTemplateBuilder, wikiPage;
module.exports.initialize = function (helpers) {
	({ embedTemplateBuilder } = helpers);

	fs.readFile("Wiki/Commands.md", { encoding: "utf-8" }, (error, data) => {
		if (error) {
			console.error(error);
		} else {
			wikiPage = data;
		}
	})
}

module.exports.execute = (interaction) => {
	let embed = embedTemplateBuilder()
		.setTitle("HorizonsBot Commands")
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765059662268727326/info.png')
		.setDescription("Here are HorizonsBots commands.")
		.setFooter({ text: "Use /support to learn how to support the server!", iconURL: interaction.client.user.displayAvatarURL() });
	let totalCharacterCount = embed.author.name.length + embed.title.length + embed.description.length + embed.footer.text.length;

	let files;
	for (const commandSet of wikiPage.split("\n## ")) {
		let commands = commandSet.split("\n### ");
		let [commandSetName, commandSetText] = commands[0].split(/\r*\n/);
		if (commandSetName.startsWith("## ")) {
			commandSetName = commandSetName.slice(2);
		}
		commandSetText = `*${commandSetText}*`;
		for (const command of commands.slice(1)) {
			let [commandName, description, ...args] = command.split(/\r*\n/)
			commandSetText += `\n__${commandName}__ ${description}`;
		}

		totalCharacterCount += commandSetName.length + commandSetText.length;
		if (commandSetText.length > 1024 || totalCharacterCount > 6000) {
			files = [{
				attachment: "Wiki/Commands.md",
				name: "commands.txt"
			}];
			break;
		} else {
			embed.addField(commandSetName, commandSetText);
		}
	}
	if (files) {
		interaction.reply({ files, ephemeral: true })
			.catch(console.error);
	} else {
		interaction.reply({ embeds: [embed], ephemeral: true })
			.catch(console.error);
	}
}
