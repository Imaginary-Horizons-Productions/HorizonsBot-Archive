const Command = require('./../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

var command = new Command(['Help', 'Commands'], 
"Lists all HorizonsBot commands; add a command at the end to get give examples and more details on that command",
"None",
["Example: list HorizonBot's commands", "Example: get command specific info - replace ( ) with your settings"],
["`@HorizonsBot Help`", "`@HorizonsBot Help (command)`"]);

command.execute = (receivedMessage, state) => {
    //TODO if placed with other dependencies, commandDictionary will be fetched before it's done being set
    const { commandSets, getCommand } = require(`./CommandsList.js`);

    // Provides a summary about bot commands, or details about a given command
    if (state.messageArray.length > 0) {
        var lookedUpCommand = getCommand(state.messageArray[0]);
        if (lookedUpCommand) {
            receivedMessage.author.send(lookedUpCommand.help(receivedMessage.client.user.displayAvatarURL()))
                .catch(console.error);
        } else {
            receivedMessage.author.send(`**${state.messageArray[0]}** does not appear to be a ${receivedMessage.client.user} command. Please check for typos!`)
                .catch(console.error);
        }
    } else {
        commandSets.forEach(commandSet => {
            if (state.botManager || !commandSet.managerCommands) {
                var embed = new MessageEmbed().setColor('6b81eb')
                    .setAuthor(`Imaginary Horizons Productions`, `https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png `)
                    .setTitle(commandSet.name)
                    .setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/765059662268727326/info.png')
                    .setDescription(commandSet.description)
                    .setFooter(`Use "@HorizonsBot support" to learn how to support the server!`, receivedMessage.client.user.displayAvatarURL())
                    .setTimestamp();
                commandSet.fileNames.forEach(filename => {
                    const command = require(`./${filename}`)
                    embed.addField(`__${command.aliases.join(', ')}__`, command.description);
                })

                receivedMessage.author.send(embed);
            }
        })
    }
}

module.exports = command;
