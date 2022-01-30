const Command = require('../../Classes/Command.js');

let options = [];
module.exports = new Command("commands", "List HorizonsBot command(s)", options);

let embedTemplateBuilder;
module.exports.initialize = function (helpers) {
	({ embedTemplateBuilder } = helpers);
}

module.exports.execute = (interaction) => {
	//TODO #192 read command data from wiki page instead of commandDictionary
	const { commandSets } = require(`./_commandDictionary.js`);

	let titleString = "HorizonsBot Commands";
	let descriptionString = "Here are HorizonsBots commands. Check a command's details to see what the usage requirements are!";
	let footerString = `Use "@HorizonsBot support" to learn how to support the server!`;
	let totalCharacterCount = "Imaginary Horizons Productions".length + titleString.length + descriptionString.length + footerString.length;
	let embed = embedTemplateBuilder()
		.setTitle(titleString)
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765059662268727326/info.png')
		.setDescription(descriptionString)
		.setFooter({ text: footerString, iconURL: interaction.client.user.displayAvatarURL() });
	for (commandSet of commandSets) {
		let commandSetText = commandSet.description + "\n";
		commandSet.fileNames.forEach(filename => {
			const command = require(`./${filename}`)
			commandSetText += `\n__${command.name}__ ${command.description}`;
		})
		totalCharacterCount += commandSetText.length;
		if (commandSetText.length > 1024 || totalCharacterCount > 6000) {
			embed = {
				files: [{
					attachment: "README.md",
					name: "commands.txt"
				}]
			}
			break;
		} else {
			embed.addField(commandSet.name, commandSetText);
		}
	}
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
}
