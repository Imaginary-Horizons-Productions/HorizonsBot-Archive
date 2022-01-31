const fs = require('fs');
const { initializeCommands, commandSets } = require('../../Data/Commands/_commandDictionary.js');

initializeCommands(false);

let text = "";

commandSets.forEach(commandSet => {
	text += `## ${commandSet.name}\n${commandSet.description}\n`;
	commandSet.fileNames.forEach(filename => {
		const command = require(`./../../Data/Commands/${filename}`);
		text += `### /${command.name}\n${command.description}\n`;
		for (var i = 0; i < command.data.options.length; i++) {
			text += `#### ${command.data.options[i].name}\n${command.data.options[i].description}\n`;
		}
	})
})

fs.writeFile('../../Wiki/Commands.md', text, (error) => {
	if (error) {
		console.log(error);
	}
});
