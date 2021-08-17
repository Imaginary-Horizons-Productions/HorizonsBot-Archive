const Command = require('./../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(['Help', 'Commands'],
    "Get info about HorizonsBot command(s)",
    "N/A",
    ["Example: list HorizonBot's commands", "Example: get command specific info - replace ( ) with your settings"],
    ["`@HorizonsBot Help`", "`@HorizonsBot Help (command)`"]);

command.data.addStringOption(option => option.setName("command").setDescription("Get examples and more details").setRequired(false));

command.execute = (receivedMessage, state) => {
    //TODO if placed with other dependencies, commandDictionary will be fetched before it's done being set
    const { commandSets, getCommand } = require(`./CommandsList.js`);

    // Provides a summary about bot commands, or details about a given command
    if (state.messageArray.length > 0) {
        state.messageArray.forEach(searchTerm => {
            searchTerm = searchTerm.toLowerCase();
            var lookedUpCommand = getCommand(searchTerm);
            if (lookedUpCommand) {
                receivedMessage.author.send({ embeds: [lookedUpCommand.help(receivedMessage.client.user.displayAvatarURL())] })
                    .catch(console.error);
            } else {
                receivedMessage.author.send(`**${searchTerm}** does not appear to be a ${receivedMessage.client.user} command. Please check for typos!`)
                    .catch(console.error);
            }
        })
    } else {
        let titleString = "HorizonsBot Commands";
        let descriptionString = "Here are HorizonsBots commands. Check a command's details to see what the usage requirements are!";
        let footerString = `Use "@HorizonsBot support" to learn how to support the server!`;
        let totalCharacterCount = `Imaginary Horizons Productions`.length + titleString.length + descriptionString.length + footerString.length;
        var embed = new MessageEmbed().setColor('6b81eb')
            .setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `)
            .setTitle(titleString)
            .setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765059662268727326/info.png')
            .setDescription(descriptionString)
            .setFooter(footerString, receivedMessage.client.user.displayAvatarURL())
            .setTimestamp();
        for (commandSet of commandSets) {
            let commandSetText = commandSet.description + "\n";
            commandSet.fileNames.forEach(filename => {
                const command = require(`./${filename}`)
                commandSetText += `\n__${command.aliases[0]}__ ${command.description}`;
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
        receivedMessage.author.send({ embeds: [embed] })
            .catch(console.error);
    }
}

command.executeInteraction = (interaction) => {
    //TODO if placed with other dependencies, commandDictionary will be fetched before it's done being set
    const { commandSets, getCommand } = require(`./CommandsList.js`);

    // Provides a summary about bot commands, or details about a given command
    var searchTerm = interaction.options.getString("command");
    if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        var lookedUpCommand = getCommand(searchTerm);
        if (lookedUpCommand) {
            interaction.reply({ embeds: [lookedUpCommand.help(interaction.client.user.displayAvatarURL())], ephemeral: true })
                .catch(console.error);
        } else {
            interaction.reply({ content: `**${searchTerm}** does not appear to be a ${interaction.client.user} command. Please check for typos!`, ephemeral: true })
                .catch(console.error);
        }
    } else {
        let titleString = "HorizonsBot Commands";
        let descriptionString = "Here are HorizonsBots commands. Check a command's details to see what the usage requirements are!";
        let footerString = `Use "@HorizonsBot support" to learn how to support the server!`;
        let totalCharacterCount = `Imaginary Horizons Productions`.length + titleString.length + descriptionString.length + footerString.length;
        var embed = new MessageEmbed().setColor('6b81eb')
            .setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `)
            .setTitle(titleString)
            .setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765059662268727326/info.png')
            .setDescription(descriptionString)
            .setFooter(footerString, interaction.client.user.displayAvatarURL())
            .setTimestamp();
        for (commandSet of commandSets) {
            let commandSetText = commandSet.description + "\n";
            commandSet.fileNames.forEach(filename => {
                const command = require(`./${filename}`)
                commandSetText += `\n__${command.aliases[0]}__ ${command.description}`;
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
}

module.exports = command;
