const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = new Command("commands", "List HorizonsBot command(s)");

module.exports.execute = (interaction) => {
    //TODO if placed with other dependencies, commandDictionary will be fetched before it's done being set
    const { commandSets } = require(`./CommandsList.js`);

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
