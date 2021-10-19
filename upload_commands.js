const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, botId, guildID} = require('./Config/auth.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./Data/Commands').filter(name => name !== "_commandDictionary.js");

for (const file of commandFiles) {
	const command = require(`./Data/Commands/${file}`);
	if (command.data) {
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: 9 }).setToken(token);


(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(botId, guildID),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
