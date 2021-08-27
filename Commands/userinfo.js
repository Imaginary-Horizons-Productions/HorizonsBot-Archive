const { MessageEmbed } = require('discord.js');
const Command = require('../Classes/Command.js');
const { guildID } = require('../helpers.js');

var command = new Command("user-info", "Get join information about a user");

command.data.addUserOption(option => option.setName("target").setDescription("The user to inspect").setRequired(true));

command.execute = (interaction) => {
	// Get join information about a user
	interaction.client.guilds.fetch(guildID).then(guild => {
		guild.members.fetch((interaction.options.getUser("target"))).then(member => {
			var embed = new MessageEmbed()
				.setTitle(`${member.user.tag} (nickname: ${member.nickname})`)
				.setTimestamp();
			if (member.joinedAt) {
				embed.addField("Joined At", member.joinedAt.toDateString());
			}
			if (member.user.createdAt) {
				embed.addField("Account Created At", member.user.createdAt.toDateString());
			}
			interaction.reply({ embeds: [embed], ephemeral: true })
				.catch(console.error);
		});
	})
}

module.exports = command;
