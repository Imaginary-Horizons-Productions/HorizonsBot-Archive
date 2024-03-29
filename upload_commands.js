const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, botId, guildId} = require('./Config/_env.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./Source/Commands').filter(name => name !== "_commandDictionary.js");

for (const file of commandFiles) {
	const command = require(`./Source/Commands/${file}`);
	if (command.data) {
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: 9 }).setToken(token);


(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(botId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
