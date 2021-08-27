const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const auth = require('./data/auth.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./Commands').filter(name => name !== "CommandsList.js");

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: 9 }).setToken(auth.token);


(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands("634069551142928455", auth.guildID),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
