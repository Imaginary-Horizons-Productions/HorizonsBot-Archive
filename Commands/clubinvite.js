const Command = require('../Classes/Command.js');
const { MessageEmbed } = require('discord.js');
const { getClubs, joinChannel, guildID } = require('../helpers.js');

var command = new Command(["ClubInvite", "ClubDetails", "CampaignInvite", "CampaignDetails"], // aliases
	"Send the mentioned users (default: self) an invite to the given club (indicated by channel mention, or by sending from club)", // description
	"N/A", // requirements
	["Example - replace ( ) with your settings"], // headings
	["`@HorizonsBot ClubInvite (mention club text channel) [recepient(s)]`"]); // texts (must match number of headings)

command.execute = (receivedMessage, state) => {
	// Provide full details on the given club
	let clubId = receivedMessage.channel.id;
	if (receivedMessage.mentions.channels.first()) {
		clubId = receivedMessage.mentions.channels.first().id;
	} else if (!isNaN(parseInt(state.messageArray[0]))) {
		clubId = state.messageArray[0];
	}
	let club = getClubs()[clubId];
	let recipients = Array.from(receivedMessage.mentions.users.values).filter(user => user.id != receivedMessage.client.user.id);
	if (club) {
		if (recipients.length == 0) {
			recipients.push(receivedMessage.author);
		}
		let embed = new MessageEmbed()
			.setAuthor("Click here to visit the Imaginary Horizons Patreon", receivedMessage.client.user.displayAvatarURL(), "https://www.patreon.com/imaginaryhorizonsproductions")
			.setTitle(`__**${club.title}**__ (${club.userIDs.length}${club.seats != 0 ? `/${club.seats}` : ""} Players)`)
			.setDescription(club.description)
			.addField("Club Host", `<@${club.hostID}>`)
			.addField("Game", club.system)
			.addField("Time Slot", club.timeslot)
			.setImage(club.imageURL)
			.setFooter("React with 🎲 to join! (5 minute time limit)");
		recipients.forEach(recipient => {
			recipient.send({ embeds: [embed] }).then(async message => {
				await message.react("🎲");
				await message.react("🚫");
				let collector = message.createReactionCollector((reaction, user) => { return user.id != receivedMessage.client.user.id && reaction.emoji.name == "🚫" || reaction.emoji.name == "🎲" }, { "max": 1, "time": 300000 });

				collector.on("collect", (reaction) => {
					if (reaction.emoji.name == "🚫") {
						collector.stop();
					} else if (reaction.emoji.name == "🎲") {
						receivedMessage.client.guilds.fetch(guildID).then(guild => {
							joinChannel(guild.channels.resolve(club.channelID), recipient);
						});
					}
				})
			})
		})
	} else {
		receivedMessage.author.send(`The club you indicated could not be found. Please check for typos!`)
			.catch(console.error);
	}
}

module.exports = command;
