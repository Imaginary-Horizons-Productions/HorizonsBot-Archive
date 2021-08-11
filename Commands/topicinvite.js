const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');
const { getTopicIDs, joinChannel, guildID } = require('../helpers.js');

var command = new Command(["TopicInvite"], // aliases
	"Invite users to this topic", // description
	"Use from channel to invite to", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot TopicInvite (recepient(s))`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Invite users to the given topic
	let channel = receivedMessage.channel;
	let recipients = receivedMessage.mentions.users.map(user => user).filter(user => user.id != receivedMessage.client.user.id);
	if (getTopicIDs().includes(channel.id)) {
		if (recipients.length > 0) {
			let embed = new MessageEmbed()
				.setAuthor("Click here to visit the Imaginary Horizons Patreon", receivedMessage.client.user.displayAvatarURL(), "https://www.patreon.com/imaginaryhorizonsproductions")
				.setDescription(`${receivedMessage.member} has invited you to the following opt-in channel on Imaginary Horizons.`)
				.addField(channel.name, `${channel.topic ? channel.topic : ""}\n\nReact with ✅ to join!`)
				.setFooter(`5 minute time limit`);
			recipients.forEach(recipient => {
				recipient.send({ embeds: [embed] }).then(async message => {
					await message.react("✅");
					await message.react("🚫");
					let collector = message.createReactionCollector((reaction, user) => { return user.id != receivedMessage.client.user.id && reaction.emoji.name == "🚫" || reaction.emoji.name == "✅" }, { "max": 1, "time": 300000 });

					collector.on("collect", (reaction) => {
						if (reaction.emoji.name === "🚫") {
							collector.stop();
						} else if (reaction.emoji.name === "✅") {
							receivedMessage.client.guilds.fetch(guildID).then(guild => {
								joinChannel(guild.channels.resolve(channel.channelID), recipient);
							});
						}
					})
				})
			})
		} else {
			receivedMessage.author.send(`Please mention some users to invite to the channel.`)
				.catch(console.error);
		}
	} else {
		receivedMessage.author.send(`The topic you indicated could not be found. Please make sure to use the command from the channel you want to invite users to!`)
			.catch(console.error);
	}
}

module.exports = command;
